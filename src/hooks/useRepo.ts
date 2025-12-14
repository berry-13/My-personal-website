import useSWR from "swr";
import { fetchRepos } from "~/services/github";

export function useRepos() {
    const { data, error, isLoading } = useSWR("repos", fetchRepos);

    return {
        repos: data,
        isLoading,
        isError: !!error,
    };
}
