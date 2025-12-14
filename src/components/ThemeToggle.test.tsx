import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        clear: () => {
            store = {};
        },
    };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("ThemeToggle", () => {
    beforeEach(() => {
        localStorageMock.clear();
        document.documentElement.classList.remove("dark");
        document.documentElement.removeAttribute("lang");
    });

    it("renders without crashing", () => {
        render(<ThemeToggle />);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("has correct aria-label for toggle button", () => {
        render(<ThemeToggle />);
        const button = screen.getByRole("button");
        expect(button).toHaveAttribute("aria-label");
    });

    it("respects disabled prop", () => {
        render(<ThemeToggle disabled />);
        const button = screen.getByRole("button");
        expect(button).toBeDisabled();
        expect(button).toHaveClass("cursor-not-allowed");
    });

    it("initializes with dark theme by default", () => {
        render(<ThemeToggle />);
        // The component defaults to dark theme and adds the dark class to html
        expect(document.documentElement.classList.contains("dark")).toBe(true);
    });

    it("toggles theme on click", () => {
        localStorageMock.setItem("theme", "dark");
        render(<ThemeToggle />);
        const button = screen.getByRole("button");

        fireEvent.click(button);
        expect(localStorageMock.getItem("theme")).toBe("light");

        fireEvent.click(button);
        expect(localStorageMock.getItem("theme")).toBe("dark");
    });

    it("does not toggle when disabled", () => {
        localStorageMock.setItem("theme", "dark");
        render(<ThemeToggle disabled />);
        const button = screen.getByRole("button");

        fireEvent.click(button);
        expect(localStorageMock.getItem("theme")).toBe("dark");
    });

    it("sets html lang attribute to en", () => {
        render(<ThemeToggle />);
        expect(document.documentElement.getAttribute("lang")).toBe("en");
    });
});
