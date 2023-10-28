import { motion } from "framer-motion";
import {
    SiVisualstudiocode,
    SiGit,
    SiDocker,
    SiTypescript,
    SiJavascript,
    SiReact,
    SiPython,
    SiCloudflare,
    SiUnrealengine,
    SiGcp,
    SiRust,
    SiArduino,
    SiRaspberrypi,
    SiBash,
    SiBlender,
    SiNginx,
    SiPytorch,
} from "react-icons/si";
import { TechItem } from "../components/TechItem";
import RepoItem from "../components/RepoItem";

interface AppProps {
    stats: Record<string, number>;
    topRepos: Record<any, any>;
}

const Index = ({ stats, topRepos }: AppProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease: "easeOut", duration: 0.15 }}
            className="mt-24 w-full mb-32"
        >
            <h1 className="mt-36 font-bold text-4xl md:text-5xl mb-4">Hello, I'm Berry! 👋</h1>
            <p className="text-gray-800 dark:text-gray-300 leading-6 tracking-wide mb-12">
                I'm a self-taught 15-year-old full-stack developer from Italy. I'm currently working on a project called LibreChat (https://github.com/danny-avila/LibreChat).
            </p>

            <h2 className="font-medium text-3xl mb-4">What I Do 💭</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-12">
                I'm passionate about artificial intelligence (AI) and enjoy working on projects related to this field.
            </p>

            <h2 className="font-medium text-3xl mb-4">AI 🤖</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-6">
                I have a strong passion for artificial intelligence and have developed skills in various AI-related technologies.
            </p>
            <div className="w-full flex flex-wrap flex-row justify-center p-1 border border-slate-800 rounded-md bg-white/10 dark:bg-black/10 mb-12">
                <TechItem icon={SiTypescript} name="TypeScript" />
                <TechItem icon={SiJavascript} name="JavaScript" />
                <TechItem icon={SiReact} name="React.js" />
                <TechItem icon={SiVisualstudiocode} name="VSCode" />
                <TechItem icon={SiDocker} name="Docker" />
                <TechItem icon={SiGit} name="Git" />
                <TechItem icon={SiPython} name="Python" />
                <TechItem icon={SiCloudflare} name="Cloudflare" />
                <TechItem icon={SiUnrealengine} name="Unreal Engine" />
                <TechItem icon={SiGcp} name="Google Cloud Platform" />
                <TechItem icon={SiRust} name="Rust" />
                <TechItem icon={SiArduino} name="Arduino" />
                <TechItem icon={SiRaspberrypi} name="Raspberry Pi" />
                <TechItem icon={SiBash} name="Bash" />
                <TechItem icon={SiBlender} name "Blender" />
                <TechItem icon={SiNginx} name="Nginx" />
                <TechItem icon={SiPytorch} name="PyTorch" />
            </div>

            <h2 className="font-medium text-3xl mb-4">Projects 🛠️</h2>
            <p className="text-gray-800 dark:text-gray-300 leading-6 font-light tracking-wide mb-6">
                In my free time, I enjoy creating open-source projects on GitHub (https://github.com/berry-13), so I can learn from others and share what I know. 
                
                Currently, I'm working on LibreChat, a project that immediately caught my attention.

                LibreChat allows the integration of multiple AI models and enhances original client features like conversation and message search, prompt templates, and plugins.

                Below are some of my most popular repositories.
            </p>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1 mb-12 gap-2">
                {topRepos.map((repo: Record<string, any>) => {
                    return (
                        <RepoItem
                            key={repo.name}
                            name={repo.name}
                            description={repo.description}
                            stars={repo.stargazers_count}
                            forks={repo.forks_count}
                            language={repo.language}
                        />
                    );
                })}
            </div>
        </motion.div>
    );
};

export async function getStaticProps() {
    const stats = await fetch(`https://api.github-star-counter.workers.dev/user/berry-13`).then(res => res.json());
    const repos = await fetch(`https://api.github.com/users/berry13/repos?type=owner&per_page=100`).then(res =>
        res.json()
    );

    const topRepos = repos
        .sort((a: Record<string, any>, b: Record<string, any>) => b.stargazers_count - a.stargazers_count)
        .slice(0, 4);

    return {
        props: { stats, topRepos },
        revalidate: 3600,
    };
}

export default Index;
