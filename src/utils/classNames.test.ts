import { describe, it, expect } from "vitest";
import { cn } from "./classNames";

describe("cn (classNames utility)", () => {
    it("merges multiple class names", () => {
        expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional class names", () => {
        expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
        expect(cn("foo", true && "bar", "baz")).toBe("foo bar baz");
    });

    it("handles undefined and null values", () => {
        expect(cn("foo", undefined, "bar")).toBe("foo bar");
        expect(cn("foo", null, "bar")).toBe("foo bar");
    });

    it("merges tailwind classes correctly", () => {
        expect(cn("px-2", "px-4")).toBe("px-4");
        expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("handles arrays of class names", () => {
        expect(cn(["foo", "bar"], "baz")).toBe("foo bar baz");
    });

    it("handles object syntax", () => {
        expect(cn({ foo: true, bar: false, baz: true })).toBe("foo baz");
    });

    it("returns empty string for no valid inputs", () => {
        expect(cn()).toBe("");
        expect(cn(false, undefined, null)).toBe("");
    });
});
