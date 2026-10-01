import { lazy, Suspense } from "react";
import Section from "~/components/Section";
import Changelog from "~/components/Changelog";
import { useRepos } from "~/hooks/useRepo";
import { cleanDescription, formatNumber } from "~/utils";

const ContributionGraph = lazy(() => import("~/components/ContributionGraph"));

const PR_BASE = "https://github.com/LibreChat-AI/LibreChat/pull/";

const selectedWork = [
    {
        date: "2026-07",
        title: "Agent Builder redesign",
        summary:
            "Rebuilt LibreChat's Agent Builder around a unified tools marketplace, skills, and multi-agent orchestration, so an agent is configured in one place instead of across scattered panels. Agent cards later gained an expandable detail view.",
        prs: [
            { number: 13952, label: "redesign" },
            { number: 15798, label: "detail dialog" },
        ],
    },
    {
        date: "2025-2026",
        title: "Accessibility",
        summary:
            "Over 30 merged pull requests focused on accessibility, including high-contrast light and dark modes, a full keyboard shortcut system, and an accessible rebuild of the MCP server UI.",
        prs: [
            { number: 15178, label: "high contrast" },
            { number: 12425, label: "keyboard shortcuts" },
            { number: 11118, label: "MCP UI" },
        ],
    },
    {
        date: "2026-08/09",
        title: "Design system and Tailwind v4",
        summary:
            "Moved the client onto the shared @librechat/client design system with semantic color tokens, upgraded it to Tailwind v4, and added lint rules that keep new code on the system.",
        prs: [
            { number: 13879, label: "design system" },
            { number: 15996, label: "Tailwind v4" },
            { number: 15981, label: "lint rules" },
        ],
    },
];

const STACK = [
    ["languages", "TypeScript, JavaScript, Java; learning Rust"],
    ["frontend", "React, Next.js, Tailwind"],
    ["backend", "Node.js, Bun, Elysia, MongoDB"],
    ["infra", "Docker, Nginx, Cloudflare, Linux"],
    ["hardware", "Arduino, Raspberry Pi, Home Assistant"],
];

const Projects = () => {
    const { repos, isLoading, isError } = useRepos();

    if (isError) {
        return <p className="font-mono text-[13px] text-muted">Couldn&apos;t load repositories just now.</p>;
    }
    if (isLoading || !repos) {
        return (
            <p role="status" className="font-mono text-[13px] text-muted">
                fetching repositories&hellip;
            </p>
        );
    }

    return (
        <ul className="divide-y divide-rule/70">
            {[...repos.libreChatRepos, ...repos.berryRepos].map(repo => (
                <li key={repo.name} className="grid gap-x-6 gap-y-1 py-4 sm:grid-cols-[11rem_1fr]">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="link self-baseline text-lg">
                        {repo.name}
                    </a>
                    <div>
                        <p className="leading-snug">{cleanDescription(repo.description)}</p>
                        <p className="mt-1 font-mono text-xs text-muted">
                            {repo.language && <span className="mr-4">{repo.language}</span>}
                            <span>
                                {formatNumber(repo.stargazers_count)} star{repo.stargazers_count === 1 ? "" : "s"}
                            </span>
                        </p>
                    </div>
                </li>
            ))}
        </ul>
    );
};

const Home = () => (
    <>
        <h1 className="sr-only">Marco Beretta, software engineer</h1>
        <p className="cursor max-w-[34rem] text-[clamp(1.6rem,4.2vw,2.35rem)] leading-[1.18] tracking-[-0.01em]">
            I build interfaces for AI tools. Since 2023 I&apos;ve merged 440+ pull requests into{" "}
            <a href="https://librechat.ai" target="_blank" rel="noreferrer" className="link">
                LibreChat
            </a>
            , mostly the parts people touch: the Agent Builder, the design system, accessibility, and audio.
        </p>

        <Section index="01" title="Selected work">
            <ol className="space-y-10">
                {selectedWork.map(work => (
                    <li key={work.title} className="grid gap-x-6 gap-y-2 sm:grid-cols-[6.5rem_1fr]">
                        <span className="font-mono text-xs text-muted tabular-nums sm:pt-1.5">{work.date}</span>
                        <article>
                            <h3 className="text-[22px] leading-tight">{work.title}</h3>
                            <p className="mt-2 max-w-[38rem] text-[17px] leading-relaxed text-ink/85">
                                {work.summary}
                            </p>
                            <p className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-xs text-muted">
                                {work.prs.map(pr => (
                                    <a
                                        key={pr.number}
                                        href={`${PR_BASE}${pr.number}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="hover:text-accent"
                                    >
                                        #{pr.number} {pr.label}
                                    </a>
                                ))}
                            </p>
                        </article>
                    </li>
                ))}
            </ol>
        </Section>

        <Section index="02" title="Log">
            <Changelog />
        </Section>

        <Section index="03" title="Activity">
            <Suspense fallback={<p className="h-[98px] font-mono text-[13px] text-muted">fetching activity&hellip;</p>}>
                <ContributionGraph />
            </Suspense>
        </Section>

        <Section index="04" title="Projects">
            <Projects />
        </Section>

        <Section index="05" title="Stack">
            <dl className="grid grid-cols-[6.5rem_1fr] gap-x-6 gap-y-2 text-[17px]">
                {STACK.map(([term, detail]) => (
                    <div key={term} className="contents">
                        <dt className="font-mono text-xs leading-[1.7rem] text-muted">{term}</dt>
                        <dd>{detail}</dd>
                    </div>
                ))}
            </dl>
        </Section>

        <Section index="06" title="Before LibreChat">
            <p className="max-w-[38rem] text-[17px] leading-relaxed">
                In early 2023, two months after ChatGPT launched, I built &ldquo;Banfi Zombi&rdquo; in Unreal Engine 5:
                a game whose AI-driven NPCs changed their behavior based on the player&apos;s choices, so no two
                playthroughs felt the same.
            </p>
        </Section>
    </>
);

export default Home;
