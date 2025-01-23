import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { IconType } from "react-icons";
import {
    SiTypescript,
    SiJavascript,
    SiNextdotjs,
    SiReact,
    SiOpenai,
    SiUnrealengine,
    SiCloudflare,
    SiMongodb,
    SiFirebase,
    SiDocker,
    SiDiscord,
    SiArduino,
    SiRaspberrypi,
    SiKalilinux,
    SiLinux,
    SiGnubash,
    SiBlender,
    SiGooglecloud,
    SiGit,
    SiNginx,
    SiPytorch,
    SiHomeassistant,
    SiGooglegemini,
    SiAnthropic,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";

interface TechItemProps {
    icon: IconType;
    name: string;
    description?: string;
    category: TechCategory;
    index: number;
}

type TechCategory = "languages" | "frameworks" | "tools" | "ai" | "cloud" | "other";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        scale: 0.9,
        rotateX: -15,
    },
    visible: (index: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15,
            mass: 1,
            delay: index * 0.04, // Staggered delay based on item index
        },
    }),
    hover: {
        scale: 1.05,
        y: -5,
        rotateX: 5,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
            mass: 0.8,
        },
    },
    tap: {
        scale: 0.97,
        rotateX: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 10,
        },
    },
};

const glowVariants = {
    idle: {
        opacity: 0,
        scale: 1,
    },
    hover: {
        opacity: [0, 0.5, 0.3],
        scale: 1.2,
        transition: {
            duration: 0.6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse" as const,
        },
    },
};

const techStack: Omit<TechItemProps, "index">[] = [
    {
        icon: SiTypescript,
        name: "TypeScript",
        category: "languages",
        description: "Typed JavaScript",
    },
    {
        icon: SiJavascript,
        name: "JavaScript",
        category: "languages",
        description: "Frontend/Backend development",
    },
    { icon: FaJava, name: "Java", category: "languages", description: "Android development" },
    { icon: SiReact, name: "React.js", category: "frameworks", description: "Frontend framework" },
    { icon: SiNextdotjs, name: "Next.js", category: "frameworks", description: "React framework" },
    { icon: SiOpenai, name: "OpenAI", category: "ai", description: "AI integration" },
    { icon: SiGooglegemini, name: "Google Gemini", category: "ai", description: "AI integration" },
    { icon: SiAnthropic, name: "Anthropic", category: "ai", description: "AI integration" },
    { icon: SiUnrealengine, name: "Unreal Engine", category: "tools", description: "3D development" },
    { icon: SiCloudflare, name: "Cloudflare", category: "cloud", description: "Edge computing" },
    { icon: SiMongodb, name: "MongoDB", category: "tools", description: "Database" },
    { icon: SiFirebase, name: "Firebase", category: "cloud", description: "Backend services" },
    { icon: SiDocker, name: "Docker", category: "tools", description: "Containerization" },
    { icon: SiDiscord, name: "Discord", category: "other", description: "Community building" },
    { icon: SiHomeassistant, name: "Home Assistant", category: "other", description: "Home automation" },
    { icon: SiArduino, name: "Arduino", category: "other", description: "IoT development" },
    { icon: SiRaspberrypi, name: "Raspberry Pi", category: "other", description: "Edge computing" },
    { icon: SiKalilinux, name: "Kali Linux", category: "tools", description: "Security testing" },
    { icon: SiLinux, name: "Linux", category: "tools", description: "Operating system" },
    { icon: SiGnubash, name: "Bash", category: "tools", description: "Shell scripting" },
    { icon: SiBlender, name: "Blender", category: "tools", description: "3D modeling" },
    { icon: SiGooglecloud, name: "Google Cloud", category: "cloud", description: "Cloud platform" },
    { icon: SiGit, name: "Git", category: "tools", description: "Version control" },
    { icon: SiNginx, name: "Nginx", category: "tools", description: "Web server" },
    { icon: SiPytorch, name: "PyTorch", category: "ai", description: "Machine learning" },
];

const TechItem = React.memo<TechItemProps>(({ icon: Icon, name, description, index }) => {
    const controls = useAnimation();
    const [isHovered, setIsHovered] = useState(false);

    const handleHoverStart = () => {
        setIsHovered(true);
        controls.start("hover");
    };

    const handleHoverEnd = () => {
        setIsHovered(false);
        controls.start("visible");
    };

    return (
        <motion.div
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileTap="tap"
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
            className="group relative flex flex-col items-center p-4 rounded-xl 
                     bg-white/5 backdrop-blur-sm border border-gray-200 
                     dark:border-gray-800 transition-all duration-300
                     hover:shadow-lg hover:shadow-violet-500/10"
            style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
            }}
        >
            <motion.div
                variants={glowVariants}
                initial="idle"
                animate={isHovered ? "hover" : "idle"}
                className="absolute inset-0 -z-10 bg-violet-500/20 rounded-xl blur-xl"
            />
            <motion.div className="relative flex flex-col items-center" style={{ transformStyle: "preserve-3d" }}>
                <Icon
                    className="w-8 h-8 mb-2 text-gray-700 dark:text-gray-300 
                             group-hover:text-violet-500 transition-colors duration-300"
                />
                <span
                    className="text-sm font-medium text-gray-800 dark:text-gray-200 
                             group-hover:text-violet-500 transition-colors duration-300 
                             text-center break-words"
                >
                    {name}
                </span>

                <AnimatePresence>
                    {description && isHovered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.9 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute top-full transform -translate-x-1/2 mt-8
                                       bg-black/90 dark:bg-white/90 text-white dark:text-black 
                                       text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10
                                       shadow-lg backdrop-blur-sm"
                        >
                            <div
                                className="absolute -top-1 left-1/2 transform -translate-x-1/2 
                                          border-l-[6px] border-r-[6px] border-b-[6px] 
                                          border-transparent border-b-black/90 dark:border-b-white/90"
                            />
                            {description}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
});

TechItem.displayName = "TechItem";

const TechIcons: React.FC = () => {
    // Memoize the grouped tech to avoid recalculating on every render
    const groupedTech = useMemo(() => {
        return techStack.reduce((acc, tech, globalIndex) => {
            if (!acc[tech.category]) {
                acc[tech.category] = [];
            }
            acc[tech.category].push({ ...tech, index: globalIndex });
            return acc;
        }, {} as Record<TechCategory, TechItemProps[]>);
    }, []);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={containerVariants}
            className="w-full space-y-8"
        >
            <AnimatePresence>
                {Object.entries(groupedTech).map(([category, items]) => (
                    <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-medium capitalize text-gray-800 dark:text-gray-200">{category}</h3>
                        <motion.div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {items.map(tech => (
                                <TechItem key={`${tech.name}-${tech.index}`} {...tech} />
                            ))}
                        </motion.div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

export default TechIcons;
