import dynamic from "next/dynamic";
import React, { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { SectionProps, ExternalLinkProps, RepoGridProps, IndexProps } from "@/src/types/types";
import { getLanguageColor, formatNumber } from "~/utils";
import { useRepos } from "~/hooks/useRepo";

const TechIcons = dynamic(() => import("../components/TechIcons"), {
    ssr: false,
    loading: () => <div className="w-full h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md" />,
}) as React.ComponentType<{}>;

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
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

const Section: React.FC<SectionProps> = ({ title, children, emoji }) => {
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

const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children }) => (
    <a
        href={href}
        rel="noreferrer"
        className="inline-flex items-center font-semibold text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200"
        target="_blank"
    >
        {children}
        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeWidth="2" strokeLinecap="round" />
            <path d="M15 3h6v6" strokeWidth="2" strokeLinecap="round" />
            <path d="M10 14L21 3" strokeWidth="2" strokeLinecap="round" />
        </svg>
    </a>
);

const RepoGrid: React.FC<RepoGridProps> = ({ libreRepo, topRepos, isLoading, isError }) => {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 4].map(i => (
                    <div
                        key={i}
                        className="animate-pulse rounded-xl p-6 bg-gray-50 dark:bg-gray-800/50 border dark:border-transparent"
                    >
                        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div className="flex gap-4 mt-4">
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
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
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="group bg-gray-50 border dark:border-transparent dark:bg-gray-800/50 
                     dark:hover:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 
                     hover:shadow-lg transition-transform duration-300"
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
                        <span className="flex items-center gap-1">⭐ {formatNumber(repo.stargazers_count)}</span>
                        <span className="flex items-center gap-1">🔀 {formatNumber(repo.forks_count)}</span>
                        {repo.language && (
                            <span className="flex items-center gap-1">
                                <span
                                    className="w-3 h-3 rounded-full"
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

const Index: React.FC<IndexProps> = ({ topRepos, libreRepo }) => {
    const { repos, isLoading, isError } = useRepos();

    return (
<AnimatePresence>
    <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto px-6 py-24"
    >
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16"
        >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Hey, I'm Marco! 👋</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
                A core contributor to{" "}
                <ExternalLink href="https://librechat.ai">LibreChat</ExternalLink>, specializing in AI integration and full-stack development
            </p>
        </motion.div>

        <Section title="What I Do" emoji="💭">
            <p>
                As a core contributor to LibreChat with over 170 PRs, I've implemented critical features including speech-to-text/text-to-speech integration,
                accessibility improvements, and authentication systems. My work spans from user interface optimization to robust backend functionality, consistently
                pushing the boundaries of AI integration in web applications.
            </p>
        </Section>

        <Section title="Technical Expertise" emoji="🤖">
            <p className="mb-8">
                Proficient in TypeScript, JavaScript, React, and Next.js for frontend development, with strong capabilities in Python
                for AI integration. Experienced with Arduino for hardware projects and Bash for automation. My focus is on creating
                seamless, accessible, and performant applications that leverage cutting-edge AI technologies.
            </p>
            <Suspense
                fallback={<div className="w-full h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md" />}
            >
                <TechIcons />
            </Suspense>
        </Section>

        <Section title="Notable Projects" emoji="🛠️">
            <p>
                Created "Banfi Zombi" in Unreal Engine 5, featuring adaptive AI NPCs whose storylines dynamically evolve based on
                player interactions and choices, creating unique experiences for each user. Led the implementation of LibreChat's
                audio capabilities, integrating WebRTC and websockets for AI Speech-to-Speech conversations, seamlessly combining
                VAD-STT-LLM-TTS technologies for natural interactions.
            </p>
        </Section>

        <Section title="Featured Projects" emoji="✨">
            <RepoGrid
                libreRepo={repos?.libreChatRepos ?? []}
                topRepos={repos?.berryRepos ?? []}
                isLoading={isLoading}
                isError={isError}
            />
        </Section>

        <footer className="mt-24 text-center text-gray-600 dark:text-gray-400">
            <p>
                Built with ❤️ and inspiration from{" "}
                <ExternalLink href="https://cnrad.dev">cnrad.dev</ExternalLink>
            </p>
        </footer>
    </motion.main>
</AnimatePresence>
    );
};

export default Index;
