import { Elysia, t } from "elysia";
import { RateLimiter, getClientIP, fetchWithTimeout } from "../utils/rateLimit";

interface Repository {
    name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
}

function isValidRepository(item: unknown): item is Repository {
    return (
        typeof item === "object" &&
        item !== null &&
        "name" in item &&
        typeof (item as Repository).name === "string" &&
        "html_url" in item &&
        typeof (item as Repository).html_url === "string" &&
        "stargazers_count" in item &&
        typeof (item as Repository).stargazers_count === "number" &&
        "forks_count" in item &&
        typeof (item as Repository).forks_count === "number"
    );
}

function validateRepositories(data: unknown): data is Repository[] {
    return Array.isArray(data) && data.every(isValidRepository);
}

const rateLimiter = new RateLimiter(30, 60 * 1000); // 30 requests per 1 minute

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
let cache: { data: { libreChatRepos: Repository[]; berryRepos: Repository[] }; expires: number } | null = null;

export const reposRoute = new Elysia({ prefix: "/api" }).get(
    "/repos",
    async ({ request, set, server }) => {
        const ip = getClientIP(request, server?.requestIP(request)?.address);

        if (!rateLimiter.check(ip)) {
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

        if (cache && cache.expires > Date.now()) {
            set.headers["Cache-Control"] = "public, max-age=300";
            return cache.data;
        }

        try {
            const [libreChatRes, berryRepos] = await Promise.all([
                fetchWithTimeout("https://api.github.com/repos/LibreChat-AI/LibreChat", fetchOptions),
                fetchWithTimeout("https://api.github.com/users/berry-13/repos?type=owner&per_page=100", fetchOptions),
            ]);

            if (!libreChatRes.ok || !berryRepos.ok) {
                throw new Error(`GitHub API request failed (${libreChatRes.status}, ${berryRepos.status})`);
            }

            const [libreChatData, berryData] = await Promise.all([
                libreChatRes.json(),
                berryRepos.json(),
            ]);

            if (!isValidRepository(libreChatData) || !validateRepositories(berryData)) {
                throw new Error("Invalid response format from GitHub API");
            }

            const featuredNames = ["railflush", "fiscapi", "verse-rag", "portainer-mcp"];
            const topBerryRepos = berryData.filter(
                (repo) => featuredNames.includes(repo.name.toLowerCase())
            );

            const data = {
                libreChatRepos: [libreChatData],
                berryRepos: topBerryRepos,
            };
            cache = { data, expires: Date.now() + CACHE_TTL };
            set.headers["Cache-Control"] = "public, max-age=300";
            return data;
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                console.error("GitHub API request timed out");
            } else {
                console.error("Error fetching repos:", error);
            }
            // Serve stale data rather than an error if GitHub is unavailable
            if (cache) {
                return cache.data;
            }
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
