import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useRepos } from "./useRepo";

// Mock SWR
vi.mock("swr", () => ({
    default: vi.fn(),
}));

// Mock the github service
vi.mock("~/services/github", () => ({
    fetchRepos: vi.fn(),
}));

import useSWR from "swr";

describe("useRepos hook", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns loading state initially", () => {
        vi.mocked(useSWR).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
            isValidating: false,
            mutate: vi.fn(),
        });

        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.repos).toBeUndefined();
        expect(result.current.isError).toBe(false);
    });

    it("returns repos when fetched successfully", () => {
        const mockRepos = {
            libreChatRepos: [{ id: 1, name: "LibreChat" }],
            berryRepos: [{ id: 2, name: "test-repo" }],
        };

        vi.mocked(useSWR).mockReturnValue({
            data: mockRepos,
            error: undefined,
            isLoading: false,
            isValidating: false,
            mutate: vi.fn(),
        });

        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.repos).toEqual(mockRepos);
        expect(result.current.isError).toBe(false);
    });

    it("returns error state when fetch fails", () => {
        vi.mocked(useSWR).mockReturnValue({
            data: undefined,
            error: new Error("Fetch failed"),
            isLoading: false,
            isValidating: false,
            mutate: vi.fn(),
        });

        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.repos).toBeUndefined();
        expect(result.current.isError).toBe(true);
    });

    it("calls useSWR with correct key", () => {
        vi.mocked(useSWR).mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
            isValidating: false,
            mutate: vi.fn(),
        });

        renderHook(() => useRepos());

        expect(useSWR).toHaveBeenCalledWith("repos", expect.any(Function));
    });
});
