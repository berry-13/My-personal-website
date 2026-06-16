import { Elysia, t } from "elysia";
import { RateLimiter, getClientIP, fetchWithTimeout } from "../utils/rateLimit";

const rateLimiter = new RateLimiter(30, 60 * 1000);

const GITHUB_USER = "berry-13";

interface GraphQLResponse {
    data?: {
        user?: {
            contributionsCollection?: {
                contributionCalendar?: {
                    totalContributions: number;
                    weeks: Array<{
                        contributionDays: Array<{
                            contributionCount: number;
                            date: string;
                        }>;
                    }>;
                };
            };
        };
    };
    errors?: Array<{ message: string }>;
}

const QUERY = `
    query($login: String!) {
        user(login: $login) {
            contributionsCollection {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            contributionCount
                            date
                        }
                    }
                }
            }
        }
    }
`;

function levelFor(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count < 4) return 1;
    if (count < 8) return 2;
    if (count < 12) return 3;
    return 4;
}

let cache: { data: ContributionPayload; expiresAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

interface ContributionDay {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

interface ContributionPayload {
    total: number;
    weeks: ContributionDay[][];
}

export const contributionsRoute = new Elysia({ prefix: "/api" }).get(
    "/contributions",
    async ({ request, set, server }) => {
        const ip = getClientIP(request, server?.requestIP(request)?.address);
        if (!rateLimiter.check(ip)) {
            set.status = 429;
            return { error: "RATE_LIMIT_EXCEEDED", total: 0, weeks: [] };
        }

        if (!process.env.GITHUB_TOKEN) {
            console.error("GITHUB_TOKEN environment variable is not set");
            set.status = 500;
            return { error: "SERVER_CONFIGURATION_ERROR", total: 0, weeks: [] };
        }

        if (cache && cache.expiresAt > Date.now()) {
            return cache.data;
        }

        try {
            const response = await fetchWithTimeout("https://api.github.com/graphql", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                    "Content-Type": "application/json",
                    Accept: "application/vnd.github.v3+json",
                },
                body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USER } }),
            });

            if (!response.ok) {
                throw new Error(`GitHub GraphQL API request failed (${response.status})`);
            }

            const json = (await response.json()) as GraphQLResponse;
            const calendar = json.data?.user?.contributionsCollection?.contributionCalendar;

            if (!calendar) {
                throw new Error(json.errors?.[0]?.message || "Invalid GraphQL response");
            }

            const payload: ContributionPayload = {
                total: calendar.totalContributions,
                weeks: calendar.weeks.map(week =>
                    week.contributionDays.map(day => ({
                        date: day.date,
                        count: day.contributionCount,
                        level: levelFor(day.contributionCount),
                    })),
                ),
            };

            cache = { data: payload, expiresAt: Date.now() + CACHE_TTL_MS };
            return payload;
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                console.error("GitHub GraphQL API request timed out");
            } else {
                console.error("Error fetching contributions:", error);
            }
            set.status = 500;
            return { error: "FETCH_ERROR", total: 0, weeks: [] };
        }
    },
    {
        response: t.Object({
            error: t.Optional(t.String()),
            total: t.Number(),
            weeks: t.Array(
                t.Array(
                    t.Object({
                        date: t.String(),
                        count: t.Number(),
                        level: t.Number(),
                    }),
                ),
            ),
        }),
    },
);
