import { describe, it, expect } from "vitest";
import { isValidEmail, isValidContactData, validateContactMessage } from "./validation";

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

describe("isValidContactData", () => {
    it("returns true for valid contact data", () => {
        expect(isValidContactData({ email: "test@example.com", message: "Hello" })).toBe(true);
    });

    it("returns false for null", () => {
        expect(isValidContactData(null)).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isValidContactData(undefined)).toBe(false);
    });

    it("returns false for missing email", () => {
        expect(isValidContactData({ message: "Hello" })).toBe(false);
    });

    it("returns false for missing message", () => {
        expect(isValidContactData({ email: "test@example.com" })).toBe(false);
    });

    it("returns false for non-string email", () => {
        expect(isValidContactData({ email: 123, message: "Hello" })).toBe(false);
    });

    it("returns false for non-string message", () => {
        expect(isValidContactData({ email: "test@example.com", message: 123 })).toBe(false);
    });

    it("returns false for non-object types", () => {
        expect(isValidContactData("string")).toBe(false);
        expect(isValidContactData(123)).toBe(false);
        expect(isValidContactData([])).toBe(false);
    });
});

describe("validateContactMessage", () => {
    it("returns valid for correct data", () => {
        const result = validateContactMessage({
            email: "test@example.com",
            message: "Hello, this is a test message",
        });
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it("returns FIELD_EMPTY for empty email", () => {
        const result = validateContactMessage({
            email: "",
            message: "Hello",
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("FIELD_EMPTY");
    });

    it("returns FIELD_EMPTY for empty message", () => {
        const result = validateContactMessage({
            email: "test@example.com",
            message: "",
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("FIELD_EMPTY");
    });

    it("returns MESSAGE_TOO_LONG for message over 1000 chars", () => {
        const result = validateContactMessage({
            email: "test@example.com",
            message: "a".repeat(1001),
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("MESSAGE_TOO_LONG");
    });

    it("accepts message at exactly 1000 chars", () => {
        const result = validateContactMessage({
            email: "test@example.com",
            message: "a".repeat(1000),
        });
        expect(result.isValid).toBe(true);
    });

    it("returns INVALID_EMAIL for malformed email", () => {
        const result = validateContactMessage({
            email: "not-an-email",
            message: "Hello",
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("INVALID_EMAIL");
    });

    it("returns EMAIL_TOO_LONG for email over 500 chars", () => {
        const result = validateContactMessage({
            email: "a".repeat(490) + "@example.com",
            message: "Hello",
        });
        expect(result.isValid).toBe(false);
        expect(result.error).toBe("EMAIL_TOO_LONG");
    });
});
