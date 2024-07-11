import { motion } from "framer-motion";
import {
    SiVisualstudiocode,
    SiGit,
    SiDocker,
    SiTypescript,
    SiJavascript,
    SiReact,
    SiCloudflare,
    SiUnrealengine,
    SiArduino,
    SiRaspberrypi,
    SiBlender,
    SiNginx,
    SiPytorch,
    SiMongodb,
    SiOpenai,
    SiFirebase,
    SiDiscord,
    SiKalilinux,
    SiLinux,
    SiGnubash,
    SiGooglecloud,
} from "react-icons/si";
import { TechItem } from "../components/TechItem";
import RepoItem from "../components/RepoItem";

interface AppProps {
    topRepos: Record<string, any>[];
    libreRepo: Record<string, any>[];
}
const githubToken = process.env.GITHUB_TOKEN;

const Index = ({ topRepos, libreRepo }: AppProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease: "easeOut", duration: 0.15 }}
            className="mt-24 w-full mb-32"
        >
            <h1 className="mt-36 font-bold text-4xl md:text-5xl mb-4">Hey, I'm Berry! 👋</h1>
            <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                I'm a self-taught 15-year-old full-stack developer from Italy. I'm currently working on{" "}
                <a
                    href="https://librechat.ai"
                    rel="noreferrer"
                    className="font-semibold text-violet-500 hover:underline"
                >
                    LibreChat
                </a>
                .
            </p>
            <h2 className="font-medium text-3xl mb-4">What I Do 💭</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-12">
                In my free time, I enjoy creating open-source projects on {" "}
                <a
                    href="https://github.com/berry-13"
                    rel="noreferrer"
                    className="font-semibold text-violet-500 hover:underline"
                >
                    GitHub
                </a>
                , so I can learn from others and share what I know. Currently, I'm working on LibreChat, a project that
                immediately caught my attention. LibreChat allows the integration of multiple AI models and enhances
                original client features like conversation and message search, prompt templates, and plugins.
            </p>
            <h2 className="font-medium text-3xl mb-4">AI 🤖</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-6">
                I have a strong passion for artificial intelligence and have developed skills in various AI-related
                technologies.
            </p>
            <div className="w-full flex flex-wrap flex-row justify-center p-1 border border-slate-800 rounded-md bg-white/10 dark:bg-black/10 mb-12">
                <TechItem icon={SiTypescript} name="TypeScript" />
                <TechItem icon={SiJavascript} name="JavaScript" />
                <TechItem icon={SiReact} name="React.js" />
                <TechItem icon={SiVisualstudiocode} name="VSCode" />
                <TechItem icon={SiOpenai} name="OpenAI" />
                <TechItem icon={SiUnrealengine} name="Unreal Engine" />
                <TechItem icon={SiCloudflare} name="Cloudflare" />
                <TechItem icon={SiMongodb} name="MongoDB" />
                <TechItem icon={SiFirebase} name="Firebase" />
                <TechItem icon={SiDocker} name="Docker" />
                <TechItem icon={SiDiscord} name="Discord" />
                <TechItem icon={SiArduino} name="Arduino" />
                <TechItem icon={SiRaspberrypi} name="Raspberry Pi" />
                <TechItem icon={SiKalilinux} name="Kali Linux" />
                <TechItem icon={SiLinux} name="Linux" />
                <TechItem icon={SiGnubash} name="Bash" />
                <TechItem icon={SiBlender} name="Blender" />
                <TechItem icon={SiGooglecloud} name="Google Cloud" />
                <TechItem icon={SiGit} name="Git" />
                <TechItem icon={SiNginx} name="Nginx" />
                <TechItem icon={SiPytorch} name="PyTorch" />
            </div>
            <h2 className="font-medium text-3xl mb-4">Here's how I ventured into the realm of IT 😊</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-6">
                Towards the end of 2021, I started learning some Python and began to explore PyTorch, working on various
                simple projects. In June 2022, I created my first project, which was a Discord bot that searched for
                images on Google based on user input. In August 2022, I had my first experience with OpenAI's APIs, as
                the same Discord bot started generating images using the OpenAI API.
            </p>
            <h2 className="font-medium text-3xl mb-4">Projects 🛠️</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-6">
                From November to April 2023, I worked on a project in Unreal Engine 5 called "Banfi Zombi," where the
                goal was to recreate a school belonging to a friend from scratch. From June until now, I have been
                working on various projects related to LibreChat, continuously adding new features and creating several
                Discord bots for the LibreChat community. Below are some of my most popular repositories.
            </p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 mb-12 gap-2">
                {libreRepo.map((repo: Record<string, any>) => (
                    <RepoItem
                        key={repo.name}
                        name={repo.name}
                        description={
                            repo.description
                                ? repo.description.slice(0, 100) + (repo.description.length > 100 ? "..." : "")
                                : "No description available"
                        }
                        stars={repo.stargazers_count}
                        forks={repo.forks_count}
                        language={repo.language}
                    />
                ))}
                {topRepos.map((repo: Record<string, any>) => (
                    <RepoItem
                        key={repo.name}
                        name={repo.name}
                        description={
                            repo.description
                                ? repo.description.slice(0, 100) + (repo.description.length > 100 ? "..." : "")
                                : "No description available"
                        }
                        stars={repo.stargazers_count}
                        forks={repo.forks_count}
                        language={repo.language}
                    />
                ))}
            </div>
            <b>HUGE thanks</b> to <a href="https://cnrad.dev">cnrad.dev</a> for the open-source code!
        </motion.div>
    );
};

export async function getStaticProps() {
    let libreChatRepo;
    try {
        libreChatRepo = await fetch(`https://api.github.com/users/danny-avila/repos?type=owner&per_page=100`, {
            headers: {
                Authorization: `token ${githubToken}`,
            },
        }).then(res => res.json());
    } catch (error) {
        console.error("Failed to fetch repositories:", error);
        libreChatRepo = [];
    }

    if (!Array.isArray(libreChatRepo)) {
        console.error("Fetched data is not an array:", libreChatRepo);
        libreChatRepo = [];
    }

    let repos;
    try {
        repos = await fetch(`https://api.github.com/users/berry-13/repos?type=owner&per_page=100`, {
            headers: {
                Authorization: `token ${githubToken}`,
            },
        }).then(res => res.json());
    } catch (error) {
        console.error("Failed to fetch repositories:", error);
        repos = [];
    }

    if (!Array.isArray(libreChatRepo)) {
        console.error("Fetched data is not an array:", libreChatRepo);
        libreChatRepo = [];
    }

    if (!Array.isArray(repos)) {
        console.error("Fetched data is not an array:", repos);
        repos = [];
    }

    const topRepos = repos
        .sort((a: Record<string, any>, b: Record<string, any>) => b.stargazers_count - a.stargazers_count)
        .slice(0, 1);

    const libreRepo = libreChatRepo
        .sort((a: Record<string, any>, b: Record<string, any>) => b.stargazers_count - a.stargazers_count)
        .slice(0, 1);

    return {
        props: { topRepos, libreRepo },
        revalidate: 3600,
    };
}

export default Index;
