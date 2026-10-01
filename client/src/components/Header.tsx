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
        <header className="material sticky top-0 z-40 border-b border-rule/80 font-mono text-[13px] leading-6 text-muted">
            <div className="stage flex flex-wrap items-center justify-between gap-x-8 gap-y-1 py-3">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
                    <NavLink to="/" viewTransition className="font-medium text-ink transition-colors hover:text-accent">
                        Marco Beretta
                    </NavLink>
                    <nav aria-label="Main">
                        <ul className="flex gap-x-5">
                            {NAV.map(item => (
                                <li key={item.to}>
                                    <NavLink
                                        to={item.to}
                                        end
                                        viewTransition
                                        className={({ isActive }) =>
                                            `relative transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-accent after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] ${
                                                isActive ? "text-ink after:scale-x-100" : "after:scale-x-0 hover:text-ink"
                                            }`
                                        }
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                    <p className="flex flex-wrap gap-x-4">
                        <span>
                            <span className="sr-only">Local time in </span>Rome {time}
                        </span>
                        <span>
                            <span
                                aria-hidden="true"
                                className={`mr-1.5 inline-block size-1.5 -translate-y-px rounded-full ${awake ? "bg-add motion-safe:animate-pulse" : "bg-faint"}`}
                            />
                            {awake ? (doNotDisturb ? "awake, do not disturb" : "awake") : "asleep"}
                        </span>
                        {lastMerge && <span className="hidden md:inline">last merge {timeAgo(lastMerge)}</span>}
                    </p>
                    <span className="flex gap-x-3">
                        <ThemeToggle />
                        <SoundToggle />
                    </span>
                </div>
            </div>
            <span aria-hidden="true" className="scroll-progress absolute inset-x-0 -bottom-px h-0.5 bg-accent" />
        </header>
    );
};

export default Header;
