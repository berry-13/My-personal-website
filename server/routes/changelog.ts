import { Elysia, t } from "elysia";
import { RateLimiter, getClientIP, fetchWithTimeout } from "../utils/rateLimit";
import { parsePrTitle } from "../utils/prTitle";

const rateLimiter = new RateLimiter(30, 60 * 1000);

const SEARCH = "repo:LibreChat-AI/LibreChat author:berry-13 is:pr is:merged sort:created-desc";
const LIMIT = 40;

const QUERY = `
    query($search: String!, $first: Int!) {
        search(query: $search, type: ISSUE, first: $first) {
            issueCount
            nodes {
                ... on PullRequest {
                    number
                    title
                    url
                    mergedAt
                    additions
                    deletions
                }
            }
        }
    }
`;

interface PullRequestNode {
    number: number;
    title: string;
    url: string;
    mergedAt: string;
    additions: number;
    deletions: number;
}

interface GraphQLResponse {
    data?: { search?: { issueCount: number; nodes: PullRequestNode[] } };
    errors?: Array<{ message: string }>;
}

interface ChangelogEntry {
    number: number;
    type: string | null;
    title: string;
    url: string;
    mergedAt: string;
    additions: number;
    deletions: number;
}

interface ChangelogPayload {
    total: number;
    entries: ChangelogEntry[];
}

let cache: { data: ChangelogPayload; expiresAt: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000;

export const changelogRoute = new Elysia({ prefix: "/api" }).get(
    "/changelog",
    async ({ request, set, server }) => {
        const ip = getClientIP(request, server?.requestIP(request)?.address);
        if (!rateLimiter.check(ip)) {
            set.status = 429;
            return { error: "RATE_LIMIT_EXCEEDED", total: 0, entries: [] };
        }

        if (!process.env.GITHUB_TOKEN) {
            console.error("GITHUB_TOKEN environment variable is not set");
            set.status = 500;
            return { error: "SERVER_CONFIGURATION_ERROR", total: 0, entries: [] };
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
                },
                body: JSON.stringify({ query: QUERY, variables: { search: SEARCH, first: LIMIT } }),
            });

            if (!response.ok) {
                throw new Error(`GitHub GraphQL API request failed (${response.status})`);
            }

            const json = (await response.json()) as GraphQLResponse;
            const search = json.data?.search;
            if (!search) {
                throw new Error(json.errors?.[0]?.message || "Invalid GraphQL response");
            }

            const entries = search.nodes
                .filter(node => typeof node?.number === "number" && node.mergedAt)
                .map(node => {
                    const { type, summary } = parsePrTitle(node.title);
                    return {
                        number: node.number,
                        type,
                        title: summary,
                        url: node.url,
                        mergedAt: node.mergedAt,
                        additions: node.additions,
                        deletions: node.deletions,
                    };
                })
                .sort((a, b) => b.mergedAt.localeCompare(a.mergedAt));

            const payload: ChangelogPayload = { total: search.issueCount, entries };
            cache = { data: payload, expiresAt: Date.now() + CACHE_TTL_MS };
            return payload;
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                console.error("GitHub GraphQL API request timed out");
            } else {
                console.error("Error fetching changelog:", error);
            }
            // Serve stale data rather than an error if GitHub is unavailable
            if (cache) return cache.data;
            set.status = 500;
            return { error: "FETCH_ERROR", total: 0, entries: [] };
        }
    },
    {
        response: t.Object({
            error: t.Optional(t.String()),
            total: t.Number(),
            entries: t.Array(
                t.Object({
                    number: t.Number(),
                    type: t.Union([t.String(), t.Null()]),
                    title: t.String(),
                    url: t.String(),
                    mergedAt: t.String(),
                    additions: t.Number(),
                    deletions: t.Number(),
                }),
            ),
        }),
    },
);
