import { describe, expect, it } from "bun:test";
import { parsePrTitle } from "./prTitle";

describe("parsePrTitle", () => {
    it("strips a leading emoji and splits the type", () => {
        expect(parsePrTitle("🧰 feat: Redesign Agent Builder")).toEqual({
            type: "feat",
            summary: "Redesign Agent Builder",
        });
    });

    it("handles multi-codepoint emoji and scopes", () => {
        expect(parsePrTitle("🏷️ fix(ui): Badge label ink")).toEqual({ type: "fix", summary: "Badge label ink" });
    });

    it("keeps titles without a conventional prefix", () => {
        expect(parsePrTitle("nav optimization ")).toEqual({ type: null, summary: "nav optimization" });
    });

    it("lowercases the type", () => {
        expect(parsePrTitle("Refactor: Prompts UI").type).toBe("refactor");
    });
});
