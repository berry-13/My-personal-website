import { describe, it, expect, beforeEach } from "bun:test";
import { render, fireEvent } from "@testing-library/react";
import ThemeToggle from "./ThemeToggle";

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
    });

    it("renders a button labelled with the theme it switches to", () => {
        const { getByRole } = render(<ThemeToggle />);
        expect(getByRole("button", { name: "Switch to dark theme" })).toBeInTheDocument();
    });

    it("shows the current theme", () => {
        document.documentElement.classList.add("dark");
        const { getByRole } = render(<ThemeToggle />);
        expect(getByRole("button").textContent).toBe("[dark]");
    });

    it("toggles the html class and persists the choice", () => {
        document.documentElement.classList.add("dark");
        const { getByRole } = render(<ThemeToggle />);
        const button = getByRole("button");

        fireEvent.click(button);
        expect(document.documentElement.classList.contains("dark")).toBe(false);
        expect(localStorageMock.getItem("theme")).toBe("light");
        expect(button.textContent).toBe("[light]");

        fireEvent.click(button);
        expect(document.documentElement.classList.contains("dark")).toBe(true);
        expect(localStorageMock.getItem("theme")).toBe("dark");
    });
});
