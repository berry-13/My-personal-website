const LINKS = [
    { href: "https://github.com/berry-13", label: "github" },
    { href: "https://x.com/Berry13000", label: "x" },
    { href: "https://linkedin.com/in/marco-beretta-berry", label: "linkedin" },
    { href: "mailto:berry@librechat.ai", label: "email" },
];

const Footer = () => (
    <footer className="mt-24 border-t border-rule pt-4 pb-16 font-mono text-[13px] leading-6 text-muted">
        <ul className="flex flex-wrap gap-x-5">
            {LINKS.map(link => (
                <li key={link.label}>
                    <a
                        href={link.href}
                        {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="hover:text-ink"
                    >
                        {link.label}
                    </a>
                </li>
            ))}
        </ul>
        <p className="mt-2">&copy; {new Date().getFullYear()} Marco Beretta. Set in Newsreader and JetBrains Mono.</p>
    </footer>
);

export default Footer;
