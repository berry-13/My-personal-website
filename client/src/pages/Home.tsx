import { Fragment, type CSSProperties, type ReactNode } from "react";
import ContributionGraph from "~/components/ContributionGraph";
import Section from "~/components/Section";
import Changelog from "~/components/Changelog";
import Reveal from "~/components/motion/Reveal";
import CountUp from "~/components/motion/CountUp";
import { useChangelog } from "~/hooks/useChangelog";
import { useContributions } from "~/hooks/useContributions";
import { useRepos } from "~/hooks/useRepo";
import { cleanDescription, formatNumber } from "~/utils";



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

const HERO_WORDS = "I build interfaces for AI tools. Since 2023 I've merged 440+ pull requests into".split(" ");
const HERO_TAIL = "mostly the parts people touch.".split(" ");

/** Each word rises out of its own mask; --w staggers them */
const Word = ({ children, index }: { children: ReactNode; index: number }) => (
    <span className="word" style={{ "--w": index } as CSSProperties}>
        <span>{children}</span>
    </span>
);

const Hero = () => (
    <div className="hero hero-exit">
        <h1 id="page-title" tabIndex={-1} className="sr-only">
            Marco Beretta, software engineer
        </h1>
        <p className="max-w-[18ch] text-[clamp(2.6rem,7.2vw,6.75rem)] leading-[1.02] tracking-[-0.025em] sm:max-w-[20ch]">
            {HERO_WORDS.map((word, i) => (
                <Fragment key={i}>
                    <Word index={i}>{word}</Word>{" "}
                </Fragment>
            ))}
            <Word index={HERO_WORDS.length}>
                <a href="https://librechat.ai" target="_blank" rel="noreferrer" className="link">
                    LibreChat
                </a>
                ,
            </Word>
            {HERO_TAIL.map((word, i) => (
                <Fragment key={`t${i}`}>
                    {" "}
                    <Word index={HERO_WORDS.length + 1 + i}>{word}</Word>
                </Fragment>
            ))}
            <span className="cursor" aria-hidden="true" />
        </p>
        <p className="hero-sub mt-10 max-w-[40rem] font-mono text-[13px] leading-6 text-muted">
            Core contributor to LibreChat. Agent Builder, design system, accessibility, audio. Based in Italy.
        </p>
    </div>
);

const Stats = () => {
    const changelog = useChangelog();
    const repos = useRepos();
    const contributions = useContributions();

    const stats = [
        {
            value: changelog.data?.total,
            failed: changelog.isError,
            label: "pull requests merged into LibreChat",
        },
        {
            value: repos.repos?.libreChatRepos[0]?.stargazers_count,
            failed: repos.isError,
            label: "stars on the project I help build",
        },
        {
            value: contributions.data?.total,
            failed: contributions.isError,
            label: "contributions in the last year",
        },
    ];

    return (
        <div className="mt-28 grid gap-y-14 border-t border-rule pt-10 sm:grid-cols-3 sm:gap-x-10 lg:mt-40">
            {stats.map((stat, i) => (
                <Reveal key={stat.label} index={i}>
                    <p className="h-[1em] text-[clamp(3rem,7vw,6rem)] leading-none tracking-[-0.03em]">
                        {stat.value !== undefined && stat.value > 0 ? (
                            <CountUp value={stat.value} />
                        ) : stat.failed ? (
                            <span className="text-muted">n/a</span>
                        ) : (
                            <span className="block h-full w-[3ch] motion-safe:animate-pulse bg-rule/60" role="status">
                                <span className="sr-only">Loading</span>
                            </span>
                        )}
                    </p>
                    <p className="mt-3 max-w-[16rem] font-mono text-[13px] text-muted">{stat.label}</p>
                </Reveal>
            ))}
        </div>
    );
};

const Projects = () => {
    const { repos, isLoading, isError } = useRepos();

    if (isError) {
        return <p className="font-mono text-[13px] text-muted">Couldn&apos;t load repositories just now.</p>;
    }
    if (isLoading || !repos) {
        return (
            <ul role="status" aria-label="Loading repositories" className="divide-y divide-rule/70">
                {[0, 1, 2, 3].map(i => (
                    <li key={i} className="grid gap-x-10 gap-y-2 py-6 md:grid-cols-[14rem_1fr]">
                        <span className="h-7 w-32 motion-safe:animate-pulse bg-rule/60" />
                        <span className="space-y-2">
                            <span className="block h-5 w-full max-w-[34rem] motion-safe:animate-pulse bg-rule/60" />
                            <span className="block h-3 w-28 motion-safe:animate-pulse bg-rule/40" />
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <ul className="divide-y divide-rule/70">
            {[...repos.libreChatRepos, ...repos.berryRepos].map((repo, i) => (
                <Reveal as="li" lite key={repo.name} index={i} className="grid gap-x-10 gap-y-1 py-6 md:grid-cols-[14rem_1fr]">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="link min-w-0 self-baseline text-xl break-words lg:text-2xl">
                        {repo.name}
                    </a>
                    <div className="min-w-0">
                        <p className="text-lg leading-snug">{cleanDescription(repo.description)}</p>
                        <p className="mt-1 font-mono text-xs text-muted">
                            {repo.language && <span className="mr-4">{repo.language}</span>}
                            <span>
                                {formatNumber(repo.stargazers_count)} star{repo.stargazers_count === 1 ? "" : "s"}
                            </span>
                        </p>
                    </div>
                </Reveal>
            ))}
        </ul>
    );
};

const Home = () => (
    <>
        <Hero />
        <Stats />

        <Section index="01" title="Selected work">
            <ol className="space-y-16 lg:space-y-24">
                {selectedWork.map((work, i) => (
                    <Reveal as="li" key={work.title} index={i % 2}>
                        <article className="grid gap-x-10 gap-y-3 md:grid-cols-[7rem_1fr]">
                            <span className="font-mono text-xs text-muted tabular-nums md:pt-3">{work.date}</span>
                            <div>
                                <h3 className="text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.08] tracking-[-0.015em]">
                                    {work.title}
                                </h3>
                                <p className="mt-4 max-w-[46rem] text-lg leading-relaxed text-ink/85 lg:text-xl lg:leading-relaxed">
                                    {work.summary}
                                </p>
                                <p className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-1 font-mono text-xs text-muted">
                                    {work.prs.map(pr => (
                                        <a
                                            key={pr.number}
                                            href={`${PR_BASE}${pr.number}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="transition-colors hover:text-accent"
                                        >
                                            #{pr.number} {pr.label} &rarr;
                                        </a>
                                    ))}
                                </p>
                            </div>
                        </article>
                    </Reveal>
                ))}
            </ol>
        </Section>

        <Section index="02" title="Log">
            <Changelog />
        </Section>

        <Section index="03" title="Activity">
            <ContributionGraph />
        </Section>

        <Section index="04" title="Projects">
            <Projects />
        </Section>

        <Section index="05" title="Stack">
            <dl className="grid gap-y-5 text-lg sm:grid-cols-[7rem_1fr] sm:gap-x-10 sm:gap-y-4 lg:text-xl">
                {STACK.map(([term, detail], i) => (
                    <Reveal key={term} lite index={i} className="grid sm:col-span-2 sm:grid-cols-subgrid">
                        <dt className="font-mono text-xs leading-[1.9rem] text-muted">{term}</dt>
                        <dd>{detail}</dd>
                    </Reveal>
                ))}
            </dl>
        </Section>

        <Section index="06" title="Before LibreChat">
            <Reveal>
                <p className="max-w-[46rem] text-lg leading-relaxed lg:text-xl lg:leading-relaxed">
                    In early 2023, two months after ChatGPT launched, I built &ldquo;Banfi Zombi&rdquo; in Unreal
                    Engine 5: a game whose AI-driven NPCs changed their behavior based on the player&apos;s choices, so
                    no two playthroughs felt the same.
                </p>
            </Reveal>
        </Section>
    </>
);

export default Home;
