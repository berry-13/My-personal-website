import { useLocalStatus } from "~/hooks/useLocalStatus";

const LINKS = [
    { href: "https://github.com/berry-13", label: "github" },
    { href: "https://x.com/Berry13000", label: "x" },
    { href: "https://linkedin.com/in/marco-beretta-berry", label: "linkedin" },
    { href: "mailto:berry@librechat.ai", label: "email" },
];

/** The header hides the status line on small screens, so it lives here instead */
const MobileStatus = () => {
    const { time, awake, doNotDisturb } = useLocalStatus();
    if (awake === null) return null;
    return (
        <p className="md:hidden">
            Rome {time} &middot; {awake ? (doNotDisturb ? "do not disturb" : "awake") : "asleep"}
        </p>
    );
};

const Footer = () => (
    <footer className="stage font-mono text-[13px] leading-6 text-muted">
        <div className="border-t border-rule pt-5 pb-8">
            <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-2">
                <ul className="flex flex-wrap gap-x-5">
                    {LINKS.map(link => (
                        <li key={link.label}>
                            <a
                                href={link.href}
                                {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                                className="-my-3 inline-flex py-3 transition-colors hover:text-ink"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <MobileStatus />
            </div>
            <p className="mt-2">
                &copy; {new Date().getFullYear()} Marco Beretta. Set in Newsreader and JetBrains Mono.
            </p>
        </div>
    </footer>
);

export default Footer;
