import useSWR from "swr";

export interface ContributionDay {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionsData {
    total: number;
    weeks: ContributionDay[][];
    error?: string;
}

const fetcher = async (url: string): Promise<ContributionsData> => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch contributions");
    return response.json();
};

export function useContributions() {
    const { data, error, isLoading } = useSWR<ContributionsData>("/api/contributions", fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10 * 60 * 1000,
    });

    return {
        data,
        isLoading,
        isError: !!error || !!data?.error,
    };
}
