import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchRepos } from "./github";

describe("fetchRepos", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("fetches and returns repos successfully", async () => {
        const mockData = {
            libreChatRepos: [{ id: 1, name: "LibreChat" }],
            berryRepos: [{ id: 2, name: "repo1" }],
        };

        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        });

        const result = await fetchRepos();

        expect(fetch).toHaveBeenCalledWith("/api/repos");
        expect(result).toEqual(mockData);
    });

    it("throws an error when response is not ok", async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        await expect(fetchRepos()).rejects.toThrow("Failed to fetch repos");
    });

    it("throws an error on network failure", async () => {
        global.fetch = vi.fn().mockRejectedValueOnce(new Error("Network error"));

        await expect(fetchRepos()).rejects.toThrow("Network error");
    });
});
