import { Elysia, t } from "elysia";

interface Repository {
    name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
}

interface RateLimitInfo {
    count: number;
    timestamp: number;
}

const rateLimits = new Map<string, RateLimitInfo>();
const MAX_REQUESTS_PER_IP = 30;
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute

function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    return forwarded?.split(",")[0] || "unknown";
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();

    // Clean up old entries
    rateLimits.forEach((value, key) => {
        if (now - value.timestamp > WINDOW_SIZE_MS) {
            rateLimits.delete(key);
        }
    });

    const rateLimitInfo = rateLimits.get(ip);
    if (rateLimitInfo) {
        if (now - rateLimitInfo.timestamp < WINDOW_SIZE_MS) {
            if (rateLimitInfo.count >= MAX_REQUESTS_PER_IP) {
                return false;
            }
            rateLimitInfo.count += 1;
        } else {
            rateLimitInfo.count = 1;
            rateLimitInfo.timestamp = now;
        }
    } else {
        rateLimits.set(ip, { count: 1, timestamp: now });
    }
    return true;
}

export const reposRoute = new Elysia({ prefix: "/api" }).get(
    "/repos",
    async ({ request, set }) => {
        const ip = getClientIP(request);

        if (!checkRateLimit(ip)) {
            set.status = 429;
            return {
                error: "RATE_LIMIT_EXCEEDED",
                libreChatRepos: [],
                berryRepos: [],
            };
        }

        if (!process.env.GITHUB_TOKEN) {
            console.error("GITHUB_TOKEN environment variable is not set");
            set.status = 500;
            return {
                error: "SERVER_CONFIGURATION_ERROR",
                libreChatRepos: [],
                berryRepos: [],
            };
        }

        const fetchOptions = {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        };

        try {
            const [dannyRepos, berryRepos] = await Promise.all([
                fetch("https://api.github.com/users/danny-avila/repos?type=owner&per_page=100", fetchOptions),
                fetch("https://api.github.com/users/berry-13/repos?type=owner&per_page=100", fetchOptions),
            ]);

            if (!dannyRepos.ok || !berryRepos.ok) {
                throw new Error("GitHub API request failed");
            }

            const [dannyData, berryData] = await Promise.all([
                dannyRepos.json() as Promise<Repository[]>,
                berryRepos.json() as Promise<Repository[]>,
            ]);

            if (!Array.isArray(dannyData) || !Array.isArray(berryData)) {
                throw new Error("Invalid response format from GitHub API");
            }

            const libreChatRepo = dannyData.filter(
                (repo) => repo.name.toLowerCase() === "librechat"
            );

            const topBerryRepos = berryData
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 3);

            return {
                libreChatRepos: libreChatRepo,
                berryRepos: topBerryRepos,
            };
        } catch (error) {
            console.error("Error fetching repos:", error);
            set.status = 500;
            return {
                error: "FETCH_ERROR",
                libreChatRepos: [],
                berryRepos: [],
            };
        }
    },
    {
        response: t.Object({
            error: t.Optional(t.String()),
            libreChatRepos: t.Array(t.Any()),
            berryRepos: t.Array(t.Any()),
        }),
    }
);
