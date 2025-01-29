import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { cn } from "~/utils";

interface ThemeToggleProps {
    disabled?: boolean;
}

const ThemeToggle = ({ disabled }: ThemeToggleProps) => {
    const [theme, setTheme] = useState<string>("dark");

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") || "light";
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

    const changeTheme = (theme: string) => {
        if (disabled) return;

        const newTheme = theme === "light" ? "dark" : "light";
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

    return (
        <button
            className={cn(
                "p-2 rounded-md bg-transparent hover:bg-black/5 dark:hover:bg-white/5",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
            )}
            onClick={() => !disabled && changeTheme(theme)}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            disabled={disabled}
        >
            {theme === "light" && <FiSun className="text-black w-6 h-6 xs:w-5 xs:h-5" />}
            {theme === "dark" && <FiMoon className="text-white w-6 h-6 xs:w-5 xs:h-5" />}
        </button>
    );
};

export default ThemeToggle;
