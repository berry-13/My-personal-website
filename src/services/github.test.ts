import { describe, it, expect, mock, beforeEach } from "bun:test";
import { fetchRepos } from "./github";

describe("fetchRepos", () => {
    beforeEach(() => {
        // Reset fetch mock before each test
        globalThis.fetch = mock(() => Promise.resolve(new Response()));
    });

    it("fetches and returns repos successfully", async () => {
        const mockData = {
            libreChatRepos: [{ id: 1, name: "LibreChat" }],
            berryRepos: [{ id: 2, name: "repo1" }],
        };

        globalThis.fetch = mock(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockData),
            } as Response)
        );

        const result = await fetchRepos();

        expect(fetch).toHaveBeenCalledWith("/api/repos");
        expect(result).toEqual(mockData);
    });

    it("throws an error when response is not ok", async () => {
        globalThis.fetch = mock(() =>
            Promise.resolve({
                ok: false,
                status: 500,
            } as Response)
        );

        await expect(fetchRepos()).rejects.toThrow("Failed to fetch repos");
    });

    it("throws an error on network failure", async () => {
        globalThis.fetch = mock(() => Promise.reject(new Error("Network error")));

        await expect(fetchRepos()).rejects.toThrow("Network error");
    });
});
