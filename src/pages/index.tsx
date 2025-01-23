import React, { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getLanguageColor, getContrastTextColor, formatNumber } from "@/src/util";
import dynamic from "next/dynamic";

interface Repository {
    name: string;
    stargazers_count: number;
    description: string;
    language: string;
    forks_count: number;
}

interface SectionProps {
    title: string;
    children: React.ReactNode;
    emoji?: string;
}

interface ExternalLinkProps {
    href: string;
    children: React.ReactNode;
}

interface RepoGridProps {
    libreRepo: Repository[];
    topRepos: Repository[];
}

interface IndexProps {
    topRepos: Repository[];
    libreRepo: Repository[];
}

const TechIcons = dynamic(() => import("../components/TechIcons"), {
    loading: () => <div className="w-full h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md" />,
});

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

const RepoGrid: React.FC<RepoGridProps> = ({ libreRepo, topRepos }) => (
    <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
        {[...libreRepo, ...topRepos].map(repo => (
            <motion.div
                key={repo.name}
                variants={fadeInUp}
                className="bg-gray-50 border dark:border-transparent dark:bg-gray-800/50 dark:hover:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
                <h3 className="text-xl font-semibold mb-2">{repo.name}</h3>
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
            </motion.div>
        ))}
    </motion.div>
);

const Index: React.FC<IndexProps> = ({ topRepos, libreRepo }) => {
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
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Hey, I'm Berry! 👋</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        A self-taught full-stack Software Engineer from Italy, currently working on{" "}
                        <ExternalLink href="https://librechat.ai">LibreChat</ExternalLink>.
                    </p>
                </motion.div>

                <Section title="What I Do" emoji="💭">
                    <p>
                        I'm passionate about creating open-source projects on{" "}
                        <ExternalLink href="https://github.com/berry-13">GitHub</ExternalLink>, learning from others and
                        sharing knowledge. Currently focused on LibreChat, integrating multiple AI models and enhancing
                        client features.
                    </p>
                </Section>

                <Section title="Technologies" emoji="🤖">
                    <p className="mb-8">Specialized in AI and full-stack development, with expertise in:</p>
                    <Suspense
                        fallback={<div className="w-full h-32 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md" />}
                    >
                        <TechIcons />
                    </Suspense>
                </Section>

                <Section title="My Journey" emoji="🚀">
                    <p>
                        Starting with Python and PyTorch in late 2021, I've evolved through various projects - from
                        Discord bots to AI integration. By 2022, I was working with OpenAI's APIs and creating
                        innovative solutions.
                    </p>
                </Section>

                <Section title="Featured Projects" emoji="✨">
                    <RepoGrid libreRepo={libreRepo} topRepos={topRepos} />
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

export async function getStaticProps() {
    const fetchOptions = {
        headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
        },
        next: { revalidate: 3600 },
    };

    try {
        const [libreChatRepo, berryRepos] = await Promise.all([
            fetch("https://api.github.com/users/danny-avila/repos?type=owner&per_page=100", fetchOptions).then(res =>
                res.json()
            ),
            fetch("https://api.github.com/users/berry-13/repos?type=owner&per_page=100", fetchOptions).then(res =>
                res.json()
            ),
        ]);

        const libreRepo = libreChatRepo.slice(0, 1);
        const topRepos = berryRepos.slice(0, 3);

        const filteredLibreChatRepos = libreRepo.filter(Boolean);
        const filteredBerryRepos = topRepos.filter(Boolean);

        const sortedLibreChatRepos = filteredLibreChatRepos.sort(
            (a: Repository, b: Repository) => b.stargazers_count - a.stargazers_count
        );
        const sortedBerryRepos = filteredBerryRepos.sort(
            (a: Repository, b: Repository) => b.stargazers_count - a.stargazers_count
        );

        return {
            props: { topRepos: sortedBerryRepos, libreRepo: sortedLibreChatRepos },
            revalidate: 3600,
        };
    } catch (error) {
        console.error("Error fetching repos:", error);
        return {
            props: { topRepos: [], libreRepo: [] },
            revalidate: 60,
        };
    }
}

export default Index;
