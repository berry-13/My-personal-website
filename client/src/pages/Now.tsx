import { motion } from "framer-motion";

const lastUpdated = "April 2026";

const Now = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto px-6 py-24"
            style={{ viewTransitionName: "page" }}
        >
            <header className="mb-12">
                <h1 className="text-5xl md:text-6xl font-bold mb-4">What I'm doing now</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last updated {lastUpdated} · Inspired by{" "}
                    <a
                        href="https://nownownow.com/about"
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-violet-500"
                    >
                        nownownow.com
                    </a>
                </p>
            </header>

            <section className="space-y-8 text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                <div>
                    <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Working on</h2>
                    <ul className="space-y-2 list-disc list-inside">
                        <li>
                            Continuing as a core contributor to{" "}
                            <a
                                href="https://librechat.ai"
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-violet-500/40 hover:decoration-violet-500"
                            >
                                LibreChat
                            </a>
                            — accessibility, audio features, agent builder UX.
                        </li>
                        <li>
                            Improving and maintaining the{" "}
                            <a
                                href="https://librechat.ai"
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-violet-500/40 hover:decoration-violet-500"
                            >
                                librechat.ai
                            </a>{" "}
                            website.
                        </li>
                        <li>Maintaining the LibreChat live demo.</li>
                        <li>
                            Maintaining the{" "}
                            <a
                                href="https://railway.com/deploy/librechat-official?referralCode=HI9hWz"
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-violet-500/40 hover:decoration-violet-500"
                            >
                                Railway LibreChat template
                            </a>{" "}
                            — one-click deploy for self-hosters.
                        </li>
                        <li>
                            Building{" "}
                            <a
                                href="https://github.com/berry-13/portainer-mcp"
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-violet-500/40 hover:decoration-violet-500"
                            >
                                portainer-mcp
                            </a>{" "}
                            — a genuinely useful MCP server for Portainer.
                        </li>
                        <li>
                            Created the{" "}
                            <a
                                href="https://breezy14.com"
                                target="_blank"
                                rel="noreferrer"
                                className="underline decoration-violet-500/40 hover:decoration-violet-500"
                            >
                                Breezy14.com
                            </a>{" "}
                            website.
                        </li>
                        <li>Modernizing this site (you're reading the result).</li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Reading</h2>
                    <p>
                        Whatever interesting drops on{" "}
                        <a
                            href="https://x.com/Berry13000"
                            target="_blank"
                            rel="noreferrer"
                            className="underline decoration-violet-500/40 hover:decoration-violet-500"
                        >
                            X
                        </a>
                        .
                    </p>
                </div>
            </section>
        </motion.div>
    );
};

export default Now;
