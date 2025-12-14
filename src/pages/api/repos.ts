import type { NextApiRequest, NextApiResponse } from "next";
import type { Repository } from "@/src/types/types";

interface ReposResponse {
    libreChatRepos: Repository[];
    berryRepos: Repository[];
}

interface ErrorResponse {
    error: string;
    libreChatRepos: Repository[];
    berryRepos: Repository[];
}

interface RateLimitInfo {
    count: number;
    timestamp: number;
}

const rateLimits = new Map<string, RateLimitInfo>();
const MAX_REQUESTS_PER_IP = 30;
const WINDOW_SIZE_MS = 60 * 1000; // 1 minute

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ReposResponse | ErrorResponse>
) {
    // Only allow GET requests
    if (req.method !== "GET") {
        return res.status(405).json({
            error: "METHOD_NOT_ALLOWED",
            libreChatRepos: [],
            berryRepos: [],
        });
    }

    // Rate limiting
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";
    const now = Date.now();

    rateLimits.forEach((value, key) => {
        if (now - value.timestamp > WINDOW_SIZE_MS) {
            rateLimits.delete(key);
        }
    });

    const rateLimitInfo = rateLimits.get(ip);
    if (rateLimitInfo) {
        if (now - rateLimitInfo.timestamp < WINDOW_SIZE_MS) {
            if (rateLimitInfo.count >= MAX_REQUESTS_PER_IP) {
                return res.status(429).json({
                    error: "RATE_LIMIT_EXCEEDED",
                    libreChatRepos: [],
                    berryRepos: [],
                });
            }
            rateLimitInfo.count += 1;
        } else {
            rateLimitInfo.count = 1;
            rateLimitInfo.timestamp = now;
        }
    } else {
        rateLimits.set(ip, { count: 1, timestamp: now });
    }

    // Validate GitHub token
    if (!process.env.GITHUB_TOKEN) {
        console.error("GITHUB_TOKEN environment variable is not set");
        return res.status(500).json({
            error: "SERVER_CONFIGURATION_ERROR",
            libreChatRepos: [],
            berryRepos: [],
        });
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
            dannyRepos.json(),
            berryRepos.json(),
        ]);

        if (!Array.isArray(dannyData) || !Array.isArray(berryData)) {
            throw new Error("Invalid response format from GitHub API");
        }

        const libreChatRepo = dannyData.filter(
            (repo: Repository) => repo.name.toLowerCase() === "librechat"
        );

        const topBerryRepos = berryData
            .sort((a: Repository, b: Repository) => b.stargazers_count - a.stargazers_count)
            .slice(0, 3);

        return res.status(200).json({
            libreChatRepos: libreChatRepo,
            berryRepos: topBerryRepos,
        });
    } catch (error) {
        console.error("Error fetching repos:", error);
        return res.status(500).json({
            error: "FETCH_ERROR",
            libreChatRepos: [],
            berryRepos: [],
        });
    }
}
