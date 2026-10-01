import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const CHANGE_EVENT = "theme-change";

function getTheme(): Theme {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function applyTheme(theme: Theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
        localStorage.setItem("theme", theme);
    } catch {
        // Storage unavailable (private mode); the class change still applies for this visit
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

// Cross-fade the whole page where the View Transitions API exists, so every color changes together
function setTheme(theme: Theme) {
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduceMotion) {
        applyTheme(theme);
        return;
    }
    document.startViewTransition(() => applyTheme(theme));
}

function subscribe(callback: () => void) {
    window.addEventListener(CHANGE_EVENT, callback);
    return () => window.removeEventListener(CHANGE_EVENT, callback);
}

const ThemeToggle = ({ className = "" }: { className?: string }) => {
    const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
    const isDark = theme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label="Dark theme"
            aria-pressed={isDark}
            className={`cursor-pointer text-muted transition-colors hover:text-ink ${className}`}
        >
            [{theme}]
        </button>
    );
};

export default ThemeToggle;
