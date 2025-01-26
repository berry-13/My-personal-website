import useSWR from "swr";
import { fetchRepos } from "~/services/github";

export function useRepos() {
    const { data, error, isValidating } = useSWR("repos", fetchRepos);

    return {
        repos: data,
        isLoading: isValidating,
        isError: error,
    };
}
