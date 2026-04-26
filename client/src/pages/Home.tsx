import { lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { FaStar, FaCodeBranch } from "react-icons/fa";
import type { SectionProps, ExternalLinkProps, RepoGridProps } from "~/types/types";
import { getLanguageColor, formatNumber } from "~/utils";
import { useRepos } from "~/hooks/useRepo";

const TechIcons = lazy(() => import("~/components/TechIcons"));
const ContributionGraph = lazy(() => import("~/components/ContributionGraph"));

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const Section = ({ title, children, emoji }: SectionProps) => {
    const [ref, inView] = useInView({
        threshold: 0.1,
        triggerOnce: true,
    });

    return (
        <motion.section
            ref={ref}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="mb-16"
        >
            <h2 className="font-medium text-3xl md:text-4xl mb-6 flex items-center gap-3">
                {title}
                <span className="text-2xl">{emoji}</span>
            </h2>
            <div className="text-gray-800 dark:text-gray-300 leading-7 tracking-wide">{children}</div>
        </motion.section>
    );
};

const ExternalLink = ({ href, children }: ExternalLinkProps) => (
    <a
        href={href}
        rel="noreferrer"
        className="inline-flex items-center font-semibold text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
        target="_blank"
    >
        {children}
        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 3h6v6" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 14L21 3" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </a>
);

const RepoGrid = ({ libreRepo, topRepos, isLoading, isError }: RepoGridProps) => {
    if (isError) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-xl p-6 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400"
            >
                Failed to load repositories. Please try again later.
            </motion.div>
        );
    }

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="status" aria-label="Loading repositories">
                <span className="sr-only">Loading repositories...</span>
                {[1, 2, 3, 4].map(i => (
                    <div
                        key={i}
                        aria-hidden="true"
                        className="rounded-xl p-6 bg-white/40 dark:bg-white/5 border border-black/10 dark:border-white/5"
                    >
                        <div className="h-6 w-1/3 loader-shimmer mb-4" />
                        <div className="space-y-2">
                            <div className="h-4 w-full loader-shimmer" />
                            <div className="h-4 w-2/3 loader-shimmer" />
                        </div>
                        <div className="flex gap-4 mt-4">
                            <div className="h-4 w-16 loader-shimmer" />
                            <div className="h-4 w-16 loader-shimmer" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
            {[...libreRepo, ...topRepos].map(repo => (
                <motion.a
                    key={repo.name}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.02, y: -2, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="group bg-gray-50 border border-black/15 dark:border-white/5 dark:bg-white/5
                     dark:hover:bg-white/10 backdrop-blur-lg rounded-xl p-6"
                >
                    <h3
                        className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100
                         group-hover:text-violet-500 dark:group-hover:text-violet-400
                         transition-colors duration-300"
                    >
                        {repo.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {repo.description
                            ? `${repo.description.slice(0, 100)}${repo.description.length > 100 ? "..." : ""}`
                            : "No description available"}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <FaStar aria-hidden="true" className="w-4 h-4" />
                            <span className="sr-only">Stars:</span> {formatNumber(repo.stargazers_count)}
                        </span>
                        <span className="flex items-center gap-1">
                            <FaCodeBranch aria-hidden="true" className="w-4 h-4" />
                            <span className="sr-only">Forks:</span> {formatNumber(repo.forks_count)}
                        </span>
                        {repo.language && (
                            <span className="flex items-center gap-1">
                                <span
                                    className="w-3 h-3 rounded-full"
                                    aria-hidden="true"
                                    style={{
                                        backgroundColor: getLanguageColor(repo.language),
                                    }}
                                />
                                {repo.language}
                            </span>
                        )}
                    </div>
                </motion.a>
            ))}
        </motion.div>
    );
};

const Home = () => {
    const { repos, isLoading, isError } = useRepos();

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-4xl mx-auto px-6 py-24"
            >
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
                    className="mb-16"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Hey, I'm Marco!</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        A core contributor to{" "}
                        <ExternalLink href="https://librechat.ai">LibreChat</ExternalLink>, specializing in AI
                        integration and full-stack development
                    </p>
                </motion.div>

                <Section title="What I Do" emoji={"\u{1F4BB}"}>
                    <p>
                        As a core contributor to LibreChat, I've shipped over 170 PRs working on everything from
                        speech-to-text and text-to-speech features to accessibility fixes and UI improvements. I enjoy
                        tackling problems across the full stack, whether it's refining the frontend experience or
                        building reliable backend systems and I'm passionate about making AI tools that actually work
                        well for people
                    </p>
                </Section>

                <Section title="Technical Expertise" emoji={"\u{1F6E0}\uFE0F"}>
                    <p className="mb-8">
                        Proficient in TypeScript, JavaScript, React, and Next.js for frontend development, with strong
                        capabilities in Java. Currently learning Rust for systems programming. Experienced with Arduino for
                        hardware projects. My focus is on creating seamless, accessible, and performant
                        applications that leverage cutting-edge AI technologies that actually works
                    </p>
                    <Suspense fallback={<div className="w-full h-32 loader-shimmer" />}>
                        <TechIcons />
                    </Suspense>
                </Section>

                <Section title="Notable Projects" emoji={"\u{1F680}"}>
                    <p className="mb-4">
                        In early 2023, just two months after ChatGPT's launch, I built "Banfi Zombi" in Unreal Engine 5
                        with adaptive AI NPCs whose behaviors shifted based on player choices, making each playthrough feel different.
                    </p>
                    <p>
                        Since then, I've been focused on improving LibreChat's day-to-day usability-adding audio features,
                        tweaking the UI to feel more intuitive, and making sure keyboard navigation and screen readers work properly.
                        I've worked on the Agent Builder and built most of the frontend components. My goal is to make sure LibreChat
                        actually feels good to use, not just powerful.
                    </p>
                </Section>

                <Section title="GitHub activity" emoji={"\u{1F4C8}"}>
                    <Suspense fallback={<div className="w-full h-[110px] loader-shimmer" />}>
                        <ContributionGraph />
                    </Suspense>
                </Section>

                <Section title="Featured Projects" emoji={"\u{2B50}"}>
                    <RepoGrid
                        libreRepo={repos?.libreChatRepos ?? []}
                        topRepos={repos?.berryRepos ?? []}
                        isLoading={isLoading}
                        isError={isError}
                    />
                </Section>

                <footer className="mt-24 text-center text-gray-600 dark:text-gray-400">
                    <p>
                        Built with inspiration from{" "}
                        <ExternalLink href="https://cnrad.dev">cnrad.dev</ExternalLink>
                    </p>
                </footer>
            </motion.div>
        </AnimatePresence>
    );
};

export default Home;
