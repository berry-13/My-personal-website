import { NavLink } from "react-router-dom";
import { useLocalStatus } from "~/hooks/useLocalStatus";
import { useChangelog } from "~/hooks/useChangelog";
import { timeAgo } from "~/utils";
import ThemeToggle from "./ThemeToggle";
import SoundToggle from "./SoundToggle";

const NAV = [
    { to: "/", label: "index" },
    { to: "/now", label: "now" },
    { to: "/contact", label: "contact" },
];

const Header = () => {
    const { time, awake, doNotDisturb } = useLocalStatus();
    const { data } = useChangelog();
    const lastMerge = data?.entries[0]?.mergedAt;

    return (
        <header className="font-mono text-[13px] leading-6 text-muted">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-3">
                <p className="flex flex-wrap gap-x-3">
                    <NavLink to="/" viewTransition className="text-ink font-medium hover:text-accent">
                        Marco Beretta
                    </NavLink>
                    <span>
                        <span className="sr-only">Local time in </span>Rome {time}
                    </span>
                    <span>
                        <span
                            aria-hidden="true"
                            className={`mr-1.5 inline-block size-1.5 -translate-y-px rounded-full ${awake ? "bg-add" : "bg-faint"}`}
                        />
                        {awake ? (doNotDisturb ? "awake, do not disturb" : "awake") : "asleep"}
                    </span>
                    {lastMerge && <span className="hidden sm:inline">last merge {timeAgo(lastMerge)}</span>}
                </p>
                <div className="flex gap-x-3">
                    <ThemeToggle />
                    <SoundToggle />
                </div>
            </div>
            <nav aria-label="Main" className="pt-3">
                <ul className="flex gap-x-5">
                    {NAV.map(item => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                end
                                viewTransition
                                className={({ isActive }) =>
                                    isActive
                                        ? "text-ink underline decoration-accent decoration-2 underline-offset-4"
                                        : "hover:text-ink"
                                }
                            >
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
