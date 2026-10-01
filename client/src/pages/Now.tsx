import Reveal from "~/components/motion/Reveal";

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
        <Reveal>
            <h1 className="text-[clamp(2.6rem,7.2vw,6.75rem)] leading-[1.02] tracking-[-0.025em]">What I&apos;m doing now</h1>
        </Reveal>
        <p className="mt-6 font-mono text-[13px] text-muted">
            updated {lastUpdated} &middot; a{" "}
            <a href="https://nownownow.com/about" target="_blank" rel="noreferrer" className="hover:text-ink underline">
                now page
            </a>
        </p>

        <h2 className="mt-24 mb-2 border-b border-rule pb-3 font-mono text-[13px] text-ink lg:mt-32">working on</h2>
        <ul className="divide-y divide-rule/70">
            {WORKING_ON.map((item, i) => (
                <Reveal
                    as="li"
                    key={item.lead}
                    index={i}
                    className="grid gap-x-10 gap-y-1 py-6 md:grid-cols-[16rem_1fr] md:items-baseline"
                >
                    {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer" className="link text-xl lg:text-2xl">
                            {item.lead}
                        </a>
                    ) : (
                        <span className="text-xl lg:text-2xl">{item.lead}</span>
                    )}
                    <span className="text-lg leading-snug text-ink/85 lg:text-xl">{item.text}</span>
                </Reveal>
            ))}
        </ul>

        <h2 className="mt-24 mb-6 border-b border-rule pb-3 font-mono text-[13px] text-ink lg:mt-32">reading</h2>
        <p className="text-lg lg:text-xl">
            Whatever interesting drops on{" "}
            <a href="https://x.com/Berry13000" target="_blank" rel="noreferrer" className="link">
                X
            </a>
            .
        </p>
    </>
);

export default Now;
