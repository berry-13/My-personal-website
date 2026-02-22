import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { Button } from "~/components/ui";

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
        return <Button title="Toggle theme" icon={<div className="w-5 h-5" />} disabled={disabled} />;
    }

    return (
        <Button
            title={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}
            icon={
                theme === "light" ? <FiSun className="text-black w-5 h-5" /> : <FiMoon className="text-white w-5 h-5" />
            }
            onClick={changeTheme}
            disabled={disabled}
        />
    );
};

export default ThemeToggle;
