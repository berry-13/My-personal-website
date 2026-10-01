import useSWR from "swr";

export interface ChangelogEntry {
    number: number;
    type: string | null;
    title: string;
    url: string;
    mergedAt: string;
    additions: number;
    deletions: number;
}

export interface ChangelogData {
    total: number;
    entries: ChangelogEntry[];
    error?: string;
}

const fetcher = async (url: string): Promise<ChangelogData> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch changelog");
    return response.json();
};

export function useChangelog() {
    const { data, error, isLoading } = useSWR<ChangelogData>("/api/changelog", fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10 * 60 * 1000,
    });

    return {
        data,
        isLoading,
        isError: !!error || !!data?.error,
    };
}
