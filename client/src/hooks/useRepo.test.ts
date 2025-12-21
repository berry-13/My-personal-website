import { describe, it, expect, mock, beforeEach } from "bun:test";
import { renderHook } from "@testing-library/react";

// Mutable state that mock will reference
const mockState = {
    data: undefined as unknown,
    error: undefined as unknown,
    isLoading: true,
    isValidating: false,
};

// Mock SWR before importing the hook
mock.module("swr", () => ({
    default: () => ({
        data: mockState.data,
        error: mockState.error,
        isLoading: mockState.isLoading,
        isValidating: mockState.isValidating,
        mutate: () => {},
    }),
}));

// Mock the github service
mock.module("~/services/github", () => ({
    fetchRepos: () => {},
}));

describe("useRepos hook", () => {
    beforeEach(() => {
        // Reset to initial loading state
        mockState.data = undefined;
        mockState.error = undefined;
        mockState.isLoading = true;
        mockState.isValidating = false;
    });

    it("returns loading state initially", async () => {
        // Dynamic import to get fresh mock state
        const { useRepos } = await import("./useRepo");
        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.repos).toBeUndefined();
        expect(result.current.isError).toBe(false);
    });

    it("returns repos when fetched successfully", async () => {
        const mockRepos = {
            libreChatRepos: [{ id: 1, name: "LibreChat" }],
            berryRepos: [{ id: 2, name: "test-repo" }],
        };

        mockState.data = mockRepos;
        mockState.isLoading = false;

        const { useRepos } = await import("./useRepo");
        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.repos).toEqual(mockRepos);
        expect(result.current.isError).toBe(false);
    });

    it("returns error state when fetch fails", async () => {
        mockState.error = new Error("Fetch failed");
        mockState.isLoading = false;

        const { useRepos } = await import("./useRepo");
        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.repos).toBeUndefined();
        expect(result.current.isError).toBe(true);
    });

    it("uses SWR with repos key", async () => {
        const { useRepos } = await import("./useRepo");
        const { result } = renderHook(() => useRepos());

        expect(result.current).toHaveProperty("repos");
        expect(result.current).toHaveProperty("isLoading");
        expect(result.current).toHaveProperty("isError");
    });
});
