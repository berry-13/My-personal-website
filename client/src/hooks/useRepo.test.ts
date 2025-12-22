import { describe, it, expect, mock, beforeEach } from "bun:test";
import { renderHook } from "@testing-library/react";

// Test scenario flag that mock will check at call time
let testScenario: "loading" | "success" | "error" = "loading";

const mockRepos = {
    libreChatRepos: [{ id: 1, name: "LibreChat" }],
    berryRepos: [{ id: 2, name: "test-repo" }],
};

// Mock SWR before importing the hook - uses scenario flag for dynamic values
mock.module("swr", () => ({
    default: () => {
        switch (testScenario) {
            case "success":
                return {
                    data: mockRepos,
                    error: undefined,
                    isLoading: false,
                    isValidating: false,
                    mutate: () => {},
                };
            case "error":
                return {
                    data: undefined,
                    error: new Error("Fetch failed"),
                    isLoading: false,
                    isValidating: false,
                    mutate: () => {},
                };
            case "loading":
            default:
                return {
                    data: undefined,
                    error: undefined,
                    isLoading: true,
                    isValidating: false,
                    mutate: () => {},
                };
        }
    },
}));

// Mock the github service
mock.module("~/services/github", () => ({
    fetchRepos: () => {},
}));

// Import after mocking
import { useRepos } from "./useRepo";

describe("useRepos hook", () => {
    beforeEach(() => {
        testScenario = "loading";
    });

    it("returns loading state initially", () => {
        testScenario = "loading";
        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.repos).toBeUndefined();
        expect(result.current.isError).toBe(false);
    });

    it("returns repos when fetched successfully", () => {
        testScenario = "success";
        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.repos).toEqual(mockRepos);
        expect(result.current.isError).toBe(false);
    });

    it("returns error state when fetch fails", () => {
        testScenario = "error";
        const { result } = renderHook(() => useRepos());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.repos).toBeUndefined();
        expect(result.current.isError).toBe(true);
    });

    it("uses SWR with repos key", () => {
        const { result } = renderHook(() => useRepos());

        expect(result.current).toHaveProperty("repos");
        expect(result.current).toHaveProperty("isLoading");
        expect(result.current).toHaveProperty("isError");
    });
});
