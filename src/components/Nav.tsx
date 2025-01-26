import { useState, useEffect } from "react";
import Link from "next/link";
import { Tooltip } from "react-tippy";
import { FiMail } from "react-icons/fi";
import { useRouter } from "next/router";
import { BsTwitterX } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { cn } from "~/utils";

const navVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

interface ButtonProps {
    name: string;
    link: string;
    selected: boolean;
    onClick?: () => void;
}

const LandingButton = ({ name, link, selected }: ButtonProps) => {
    return (
        <motion.div variants={itemVariants}>
            <Link
                href={link}
                aria-current={selected ? "page" : undefined}
                className={cn(
                    "relative px-4 py-2 text-sm rounded-md transition-all duration-200",
                    "hover:text-black dark:hover:text-white",
                    selected
                        ? "text-black dark:text-white bg-black/10 dark:bg-white/10"
                        : "text-black/70 dark:text-white/70"
                )}
            >
                {name}
                {selected && (
                    <motion.div
                        layoutId="navIndicator"
                        className="absolute inset-0 rounded-md bg-black/10 dark:bg-white/10 -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                )}
            </Link>
        </motion.div>
    );
};

const MobileLandingButton = ({ name, link, selected, onClick }: ButtonProps) => {
    return (
        <Link
            href={link}
            aria-current={selected ? "page" : undefined}
            onClick={onClick}
            className={cn(
                "flex-grow flex justify-center items-center py-4 text-base transition-all duration-200",
                "border border-slate-800/30 hover:bg-black/5 dark:hover:bg-white/5",
                selected
                    ? "text-black dark:text-white bg-black/10 dark:bg-white/10"
                    : "text-black/70 dark:text-white/70"
            )}
        >
            {name}
        </Link>
    );
};

interface LinkButtonProps {
    title: string;
    href: string;
    icon: React.ReactNode;
}

const LinkButton = ({ title, icon, href }: LinkButtonProps) => {
    return (
        <motion.div variants={itemVariants}>
            <Tooltip
                title={title}
                position="top"
                trigger="mouseenter"
                animation="scale"
            >
                <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-full transition-all duration-200"
                >
                    <div className="text-gray-700 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50 transition-colors duration-200">
                        {icon}
                    </div>
                </a>
            </Tooltip>
        </motion.div>
    );
};

const Nav = () => {
    const router = useRouter();
    const [mobileMenuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    return (
        <>
            <motion.nav
                variants={navVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                    "hidden z-[999] fixed w-11/12 lg:w-[60rem] xs:flex items-center justify-between",
                    "px-4 mt-4 lg:mt-6 rounded-xl backdrop-blur-lg transition-all duration-300 h-16",
                    scrolled
                        ? "bg-white/80 dark:bg-[#12181d]/80 shadow-lg shadow-black/[0.03]"
                        : "bg-white/60 dark:bg-[#12181d]/60",
                    "border border-slate-800/50"
                )}
                role="navigation"
                aria-label="Main navigation"
            >
                <div className="flex items-center space-x-2">
                    <ThemeToggle />
                    <LandingButton name="Home" link="/" selected={router.pathname === "/"} />
                    <LandingButton name="Contact" link="/contact" selected={router.pathname === "/contact"} />
                </div>

                <div className="flex items-center space-x-4">
                    <LinkButton
                        title="GitHub"
                        href="https://github.com/berry-13"
                        icon={<SiGithub className="w-6 h-6" />}
                    />
                    <LinkButton
                        title="X (Twitter 🐦)"
                        aria-label="Twitter"
                        href="https://x.com/berry13000"
                        icon={<BsTwitterX className="w-6 h-6" />}
                    />
                    <LinkButton
                        title="LinkedIn"
                        href="https://linkedin.com/in/marco-beretta-berry"
                        icon={<SiLinkedin className="w-6 h-6" />}
                    />
                    <LinkButton title="Email" href="mailto:berry@librechat.ai" icon={<FiMail className="w-6 h-6 " />} />
                </div>
            </motion.nav>

            {/* Mobile Navigation */}
            <motion.nav
                initial={false}
                animate={scrolled ? "scrolled" : "top"}
                variants={{
                    scrolled: {
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(12px)",
                    },
                    top: {
                        backgroundColor: "rgba(255, 255, 255, 0.6)",
                        backdropFilter: "blur(8px)",
                    },
                }}
                className="xs:hidden z-[1001] fixed w-full flex items-center justify-between px-4 py-3 border-b border-slate-800/50 bg-white/80 dark:bg-[#12181d]/80 backdrop-blur-xl transition-all duration-300"
            >
                <ThemeToggle />
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleMenu}
                    className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
                    aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileMenuOpen}
                >
                    <motion.div animate={{ rotate: mobileMenuOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </motion.div>
                </motion.button>
            </motion.nav>

            <AnimatePresence>
                {mobileMenuOpen ? (
                    <div key="mobile-menu-container">
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-[1000] bg-black/30 dark:bg-black/50 backdrop-blur-sm"
                            onClick={() => setMenuOpen(false)}
                            aria-hidden="true"
                        />

                        <motion.div
                            key="mobile-menu"
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed z-[1002] w-full bg-white dark:bg-[#090c0f] border-b border-slate-800/30 shadow-lg shadow-black/[0.03]"
                        >
                            <div className="flex flex-col space-y-4 p-4 mt-14">
                                <div className="grid grid-cols-2 gap-2">
                                    <MobileLandingButton
                                        name="Home"
                                        link="/"
                                        selected={router.pathname === "/"}
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    <MobileLandingButton
                                        name="Contact"
                                        link="/contact"
                                        selected={router.pathname === "/contact"}
                                        onClick={() => setMenuOpen(false)}
                                    />
                                </div>

                                <div className="flex justify-center space-x-6 py-4 border-t border-slate-800/30">
                                    <LinkButton
                                        title="GitHub"
                                        href="https://github.com/berry-13"
                                        icon={<SiGithub className="w-6 h-6" />}
                                    />
                                    <LinkButton
                                        title="Twitter"
                                        href="https://x.com/Berry13000"
                                        icon={<BsTwitterX className="w-6 h-6" />}
                                    />
                                    <LinkButton
                                        title="LinkedIn"
                                        href="https://linkedin.com/in/marco-beretta-berry/"
                                        icon={<SiLinkedin className="w-6 h-6" />}
                                    />
                                    <LinkButton
                                        title="Email"
                                        href="mailto:berry@librechat.ai"
                                        icon={<FiMail className="w-6 h-6" />}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ) : null}
            </AnimatePresence>
        </>
    );
};

export default Nav;
