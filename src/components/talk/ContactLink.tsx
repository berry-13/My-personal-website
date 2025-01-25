import React from "react";
import { motion } from "framer-motion";
import { FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import { cn } from "~/utils";

interface ContactLinkProps {
    name: string;
    icon: React.ReactElement;
    link: string;
    borderColor?: string;
}

const ContactLink = ({ name, icon, link, borderColor }: ContactLinkProps) => {
    return (
        <Link href={link} legacyBehavior>
            <motion.a
                href={link}
                target="_blank"
                rel="noreferrer noopener"
                initial={{ scale: 1 }}
                whileHover={{
                    scale: 1.02,
                    rotateX: -2,
                    rotateY: 2,
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                    type: "tween",
                    duration: 0.1,
                }}
                className={cn(
                    "group flex items-center gap-3 p-4 mb-4",
                    "bg-white/50 dark:bg-white/5 backdrop-blur-sm",
                    "border border-zinc-800/50 rounded-xl",
                    "shadow-lg shadow-black/[0.02] hover:shadow-xl hover:shadow-black/[0.05]",
                    "transition-all duration-300 cursor-pointer",
                    borderColor || "hover:border-white/50"
                )}
            >
                <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-600 dark:text-gray-400 group-hover:text-violet-500 
                   dark:group-hover:text-violet-400 transition-colors duration-300"
                >
                    {icon}
                </motion.div>

                <span
                    className="flex-1 font-medium text-sm text-black/80 dark:text-slate-400 
                      group-hover:text-violet-500 dark:group-hover:text-violet-400 
                      transition-colors duration-300"
                >
                    {name}
                </span>

                <FiExternalLink
                    className="w-5 h-5 text-gray-600 group-hover:text-violet-500 
                                dark:group-hover:text-violet-400 transition-colors duration-300"
                />
            </motion.a>
        </Link>
    );
};

export default ContactLink;
