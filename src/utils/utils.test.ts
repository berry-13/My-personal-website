import { describe, it, expect } from "bun:test";
import { formatNumber } from "./utils";

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
