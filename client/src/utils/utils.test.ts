import { describe, it, expect } from "bun:test";
import { cleanDescription, formatNumber } from "./utils";

describe("formatNumber", () => {
    it("formats whole numbers with commas", () => {
        expect(formatNumber(1000)).toBe("1,000");
        expect(formatNumber(1000000)).toBe("1,000,000");
    });

    it("handles small numbers without formatting", () => {
        expect(formatNumber(0)).toBe("0");
        expect(formatNumber(1)).toBe("1");
        expect(formatNumber(999)).toBe("999");
    });

    it("handles negative numbers", () => {
        expect(formatNumber(-1000)).toBe("-1,000");
        expect(formatNumber(-1000000)).toBe("-1,000,000");
    });

    it("handles decimal numbers", () => {
        expect(formatNumber(1234.56)).toBe("1,234.56");
    });
});

describe("cleanDescription", () => {
    it("strips a leading emoji and keeps the first sentence", () => {
        expect(cleanDescription("\u{1F682} Flush memory bloat from your Railway services. A tiny Go cron job.")).toBe(
            "Flush memory bloat from your Railway services.",
        );
    });

    it("truncates long sentences at a word boundary", () => {
        const long = "Enhanced ChatGPT Clone: Features Agents, MCP, Skills, DeepSeek, Anthropic, AWS, OpenAI, Responses API, Azure, Groq, o1, GPT-5, Mistral, OpenRouter";
        const result = cleanDescription(long, 60);
        expect(result.endsWith("…")).toBe(true);
        expect(result.length).toBeLessThanOrEqual(61);
    });

    it("handles missing descriptions", () => {
        expect(cleanDescription(null)).toBe("No description.");
    });
});
