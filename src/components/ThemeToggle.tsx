import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
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
            className="p-2 rounded-md bg-transparent hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
            onClick={() => changeTheme(theme)}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
            {theme === "light" && <FiSun className="text-black w-6 h-6 xs:w-5 xs:h-5" />}
            {theme === "dark" && <FiMoon className="text-white w-6 h-6 xs:w-5 xs:h-5" />}
        </button>
    );
};

export default ThemeToggle;
