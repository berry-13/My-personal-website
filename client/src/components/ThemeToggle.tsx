import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const CHANGE_EVENT = "theme-change";

function getTheme(): Theme {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function setTheme(theme: Theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
        localStorage.setItem("theme", theme);
    } catch {
        // Storage unavailable (private mode); the class change still applies for this visit
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback: () => void) {
    window.addEventListener(CHANGE_EVENT, callback);
    return () => window.removeEventListener(CHANGE_EVENT, callback);
}

const ThemeToggle = () => {
    const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
    const next: Theme = theme === "dark" ? "light" : "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(next)}
            aria-label={`Switch to ${next} theme`}
            className="cursor-pointer text-muted hover:text-ink transition-colors"
        >
            [{theme}]
        </button>
    );
};

export default ThemeToggle;
