import { Repository } from "@/src/types/types";

export async function fetchRepos(): Promise<{
    libreChatRepos: Repository[];
    berryRepos: Repository[];
}> {
    const response = await fetch("/api/repos");
    if (!response.ok) {
        throw new Error("Failed to fetch repos");
    }
    return response.json();
}
