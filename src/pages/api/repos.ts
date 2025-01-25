import type { NextApiRequest, NextApiResponse } from "next";

interface Repository {
    name: string;
    stargazers_count: number;
    description: string;
    language: string;
    forks_count: number;
}

interface ReposResponse {
    libreChatRepos: Repository[];
    berryRepos: Repository[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ReposResponse>) {
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

        const dannyData = await dannyRepos.json();
        const berryData = await berryRepos.json();

        const libreChatRepo = dannyData.filter((repo: Repository) => repo.name.toLowerCase() === "librechat");

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
            libreChatRepos: [],
            berryRepos: [],
        });
    }
}
