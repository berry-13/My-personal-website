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

// Generous hit area (44px tall on touch) without changing the visual rhythm of the 13px mono line
const hit = "-my-3 inline-flex py-3 whitespace-nowrap";

const Status = () => {
    const { time, awake, doNotDisturb } = useLocalStatus();
    const { data } = useChangelog();
    const lastMerge = data?.entries[0]?.mergedAt;
    const label = awake === null ? "" : awake ? (doNotDisturb ? "do not disturb" : "awake") : "asleep";

    return (
        // The label that changes width sits first: the line is right-aligned, so only the label itself moves
        <p className="hidden items-center gap-x-4 whitespace-nowrap md:flex">
            <span className="inline-flex items-center" aria-live="polite">
                <span
                    aria-hidden="true"
                    className={`mr-1.5 inline-block size-1.5 rounded-full transition-colors duration-500 ${
                        awake ? "bg-add" : awake === false ? "bg-faint" : "bg-rule"
                    }`}
                />
                {label}
            </span>
            <span className="tabular-nums">
                <span className="sr-only">Local time in </span>Rome {time}
            </span>
            {/* Reserved width so the line does not shift when the log loads */}
            <span className="hidden min-w-[21ch] xl:inline">{lastMerge && `last merge ${timeAgo(lastMerge)}`}</span>
        </p>
    );
};

const Header = () => (
    <header className="material sticky top-0 z-40 border-b border-rule/80 font-mono text-[12px] leading-6 text-muted sm:text-[13px]">
        <div className="stage flex h-12 items-center justify-between gap-x-4 sm:gap-x-6">
            <div className="flex items-center gap-x-8">
                <NavLink
                    to="/"
                    className="-my-3 hidden py-3 font-medium whitespace-nowrap text-ink transition-colors hover:text-accent sm:inline-flex"
                >
                    Marco Beretta
                </NavLink>
                <nav aria-label="Main">
                    <ul className="flex gap-x-4 sm:gap-x-5">
                        {NAV.map(item => (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    end
                                    className={({ isActive }) =>
                                        `${hit} relative transition-colors after:absolute after:inset-x-0 after:bottom-2.5 after:h-0.5 after:origin-left after:bg-accent after:transition-transform after:duration-500 after:ease-[cubic-bezier(0.22,1,0.36,1)] ${
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
            <div className="flex items-center gap-x-6">
                <Status />
                <span className="flex gap-x-3">
                    <ThemeToggle className={hit} />
                    <SoundToggle className={hit} />
                </span>
            </div>
        </div>
        <span aria-hidden="true" className="scroll-progress absolute inset-x-0 -bottom-px h-0.5 bg-accent" />
    </header>
);

export default Header;
