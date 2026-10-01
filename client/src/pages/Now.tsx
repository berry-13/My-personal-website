const lastUpdated = "2026-10";

const WORKING_ON = [
    {
        lead: "LibreChat",
        href: "https://librechat.ai",
        text: "core contributor: the chat UI redesign, projects, accessibility, and the Agent Builder.",
    },
    { lead: "librechat.ai", href: "https://librechat.ai", text: "improving and maintaining the docs and website." },
    { lead: "LibreChat demo", text: "keeping the public live demo running." },
    {
        lead: "Railway template",
        href: "https://railway.com/deploy/librechat-official?referralCode=HI9hWz",
        text: "maintaining the one-click LibreChat deploy for self-hosters.",
    },
    {
        lead: "portainer-mcp",
        href: "https://github.com/berry-13/portainer-mcp",
        text: "an MCP server that lets AI assistants manage Portainer.",
    },
];

const Now = () => (
    <>
        <h1 className="text-[clamp(1.6rem,4.2vw,2.35rem)] leading-tight">What I&apos;m doing now</h1>
        <p className="mt-2 font-mono text-xs text-muted">
            updated {lastUpdated} &middot; a{" "}
            <a href="https://nownownow.com/about" target="_blank" rel="noreferrer" className="hover:text-ink underline">
                now page
            </a>
        </p>

        <h2 className="mt-14 mb-4 border-b border-rule pb-2 font-mono text-[13px] text-ink">working on</h2>
        <ul className="divide-y divide-rule/70">
            {WORKING_ON.map(item => (
                <li key={item.lead} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[11rem_1fr] sm:items-baseline">
                    {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer" className="link text-lg">
                            {item.lead}
                        </a>
                    ) : (
                        <span className="text-lg">{item.lead}</span>
                    )}
                    <span className="text-[17px] leading-snug text-ink/85">{item.text}</span>
                </li>
            ))}
        </ul>

        <h2 className="mt-14 mb-4 border-b border-rule pb-2 font-mono text-[13px] text-ink">reading</h2>
        <p className="text-[17px]">
            Whatever interesting drops on{" "}
            <a href="https://x.com/Berry13000" target="_blank" rel="noreferrer" className="link">
                X
            </a>
            .
        </p>
    </>
);

export default Now;
