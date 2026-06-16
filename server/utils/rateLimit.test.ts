import { describe, expect, it } from "bun:test";
import { getClientIP, RateLimiter } from "./rateLimit";

describe("RateLimiter", () => {
    it("caps tracked entries to prevent unbounded growth", () => {
        const limiter = new RateLimiter(5, 60_000, 2);

        expect(limiter.check("1.1.1.1")).toBe(true);
        expect(limiter.check("2.2.2.2")).toBe(true);
        expect(limiter.check("3.3.3.3")).toBe(true);

        // first key should have been evicted when the third key was inserted
        expect(limiter.check("1.1.1.1")).toBe(true);
    });
});

describe("getClientIP", () => {
    it("uses trusted proxy headers only when TRUSTED_PROXY=true", () => {
        process.env.TRUSTED_PROXY = "true";
        const request = new Request("https://example.com", {
            headers: { "x-forwarded-for": "203.0.113.10, 10.0.0.1" },
        });

        expect(getClientIP(request)).toBe("203.0.113.10");
    });

    it("ignores spoofable proxy headers when not trusted", () => {
        process.env.TRUSTED_PROXY = "false";
        const request = new Request("https://example.com", {
            headers: { "x-forwarded-for": "203.0.113.10" },
        });

        expect(getClientIP(request)).toBe("unknown");
    });

    it("falls back to the direct TCP peer address when not trusted", () => {
        process.env.TRUSTED_PROXY = "false";
        const request = new Request("https://example.com", {
            // spoofed header must be ignored in favour of the real peer address
            headers: { "x-forwarded-for": "203.0.113.10" },
        });

        expect(getClientIP(request, "198.51.100.7")).toBe("198.51.100.7");
    });

    it("rejects invalid or oversized header values", () => {
        process.env.TRUSTED_PROXY = "true";
        const request = new Request("https://example.com", {
            headers: { "x-forwarded-for": `${"1".repeat(100)}.2.3.4` },
        });

        expect(getClientIP(request)).toBe("unknown");
    });
});
