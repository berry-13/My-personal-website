import { describe, it, expect, mock, beforeEach } from "bun:test";
import { renderHook } from "@testing-library/react";

// Mock SWR before importing the hook
const mockUseSWR = mock(() => ({
    data: undefined,
    error: undefined,
    isLoading: true,
    isValidating: false,
    mutate: mock(() => {}),
}));

mock.module("swr", () => ({
    default: mockUseSWR,
}));

// Mock the github service
mock.module("~/services/github", () => ({
    fetchRepos: mock(() => {}),
}));

// Import after mocking
import { useRepos } from "./useRepo";

describe("useRepos hook", () => {
    beforeEach(() => {
        mockUseSWR.mockClear();
    });

    it("returns loading state initially", () => {
        mockUseSWR.mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
            isValidating: false,
            mutate: mock(() => {}),
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

        mockUseSWR.mockReturnValue({
            data: mockRepos,
            error: undefined,
            isLoading: false,
            isValidating: false,
            mutate: mock(() => {}),
        });

        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.repos).toEqual(mockRepos);
        expect(result.current.isError).toBe(false);
    });

    it("returns error state when fetch fails", () => {
        mockUseSWR.mockReturnValue({
            data: undefined,
            error: new Error("Fetch failed"),
            isLoading: false,
            isValidating: false,
            mutate: mock(() => {}),
        });

        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.repos).toBeUndefined();
        expect(result.current.isError).toBe(true);
    });

    it("calls useSWR with correct key", () => {
        mockUseSWR.mockReturnValue({
            data: undefined,
            error: undefined,
            isLoading: true,
            isValidating: false,
            mutate: mock(() => {}),
        });

        renderHook(() => useRepos());

        expect(mockUseSWR).toHaveBeenCalledWith("repos", expect.any(Function));
    });
});
