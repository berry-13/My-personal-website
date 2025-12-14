import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { cn } from "~/utils";

interface ThemeToggleProps {
    disabled?: boolean;
}

type Theme = "light" | "dark";

const ThemeToggle = ({ disabled }: ThemeToggleProps) => {
    const [theme, setTheme] = useState<Theme | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const storedTheme = (localStorage.getItem("theme") as Theme) || "dark";
        setTheme(storedTheme);
        const html = document.querySelector("html");
        if (html) {
            html.setAttribute("lang", "en");
            if (storedTheme === "light") {
                html.classList.remove("dark");
            } else {
                html.classList.add("dark");
            }
        }
    }, []);

    const changeTheme = () => {
        if (disabled || !theme) return;

        const newTheme: Theme = theme === "light" ? "dark" : "light";
        const html = document.querySelector("html");

        localStorage.setItem("theme", newTheme);
        setTheme(newTheme);

        if (html) {
            if (newTheme === "light") {
                html.classList.remove("dark");
            } else {
                html.classList.add("dark");
            }
        }
    };

    if (!mounted) {
        return (
            <button
                className={cn(
                    "p-2 rounded-md bg-transparent",
                    disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                )}
                disabled={disabled}
                aria-label="Toggle theme"
            >
                <div className="w-6 h-6 xs:w-5 xs:h-5" />
            </button>
        );
    }

    return (
        <button
            className={cn(
                "p-2 rounded-md bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
            onClick={changeTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            disabled={disabled}
        >
            {theme === "light" && <FiSun className="text-black w-6 h-6 xs:w-5 xs:h-5" />}
            {theme === "dark" && <FiMoon className="text-white w-6 h-6 xs:w-5 xs:h-5" />}
        </button>
    );
};

export default ThemeToggle;
