import { describe, it, expect } from "bun:test";
import { isValidEmail, validateContactMessage } from "./validation";

describe("isValidEmail", () => {
    it("validates correct email formats", () => {
        expect(isValidEmail("test@example.com")).toBe(true);
        expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
        expect(isValidEmail("user+tag@example.org")).toBe(true);
        expect(isValidEmail("user123@test-domain.com")).toBe(true);
    });

    it("rejects invalid email formats", () => {
        expect(isValidEmail("")).toBe(false);
        expect(isValidEmail("notanemail")).toBe(false);
        expect(isValidEmail("@nodomain.com")).toBe(false);
        expect(isValidEmail("noat.com")).toBe(false);
        expect(isValidEmail("spaces in@email.com")).toBe(false);
        expect(isValidEmail("test@")).toBe(false);
    });

    it("handles edge cases", () => {
        expect(isValidEmail("a@b.co")).toBe(true);
        expect(isValidEmail("test@sub.domain.example.com")).toBe(true);
    });
});

describe("validateContactMessage", () => {
    it("returns valid for correct data", () => {
        const result = validateContactMessage("test@example.com", "Hello, this is a test message");
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it("returns FIELD_EMPTY for empty email", () => {
        const result = validateContactMessage("", "Hello");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("FIELD_EMPTY");
    });

    it("returns FIELD_EMPTY for empty message", () => {
        const result = validateContactMessage("test@example.com", "");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("FIELD_EMPTY");
    });

    it("returns MESSAGE_TOO_LONG for message over 1000 chars", () => {
        const result = validateContactMessage("test@example.com", "a".repeat(1001));
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("MESSAGE_TOO_LONG");
    });

    it("accepts message at exactly 1000 chars", () => {
        const result = validateContactMessage("test@example.com", "a".repeat(1000));
        expect(result.isValid).toBe(true);
    });

    it("returns INVALID_EMAIL for malformed email", () => {
        const result = validateContactMessage("not-an-email", "Hello");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("INVALID_EMAIL");
    });

    it("returns EMAIL_TOO_LONG for email over 500 chars", () => {
        const result = validateContactMessage("a".repeat(490) + "@example.com", "Hello");
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("EMAIL_TOO_LONG");
    });
});
