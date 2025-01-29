import { useState, useEffect } from "react";
import Link from "next/link";
import { Tooltip } from "react-tippy";
import { FiMail } from "react-icons/fi";
import { useRouter } from "next/router";
import { BsTwitterX } from "react-icons/bs";
import { HiMenu } from "react-icons/hi";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { cn } from "~/utils";

interface LandingButtonProps {
    name: string;
    link: string;
    selected: boolean;
}

interface MobileNavButtonProps extends LandingButtonProps {
    onClick: () => void;
}

interface LinkButtonProps {
    title: string;
    icon: React.ReactNode;
    href: string;
}

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

const LandingButton = ({ name, link, selected }: LandingButtonProps) => (
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

const MobileNavButton = ({ name, link, selected, onClick }: MobileNavButtonProps) => (
    <Link
        href={link}
        onClick={onClick}
        aria-current={selected ? "page" : undefined}
        className={cn(
            "w-full px-6 py-3 text-base rounded-lg transition-colors",
            "flex items-center justify-center",
            selected
                ? "text-black dark:text-white bg-black/10 dark:bg-white/10"
                : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5"
        )}
    >
        {name}
    </Link>
);

const LinkButton = ({ title, icon, href }: LinkButtonProps) => (
    <motion.div variants={itemVariants}>
        <Tooltip title={title} position="top" animation="scale">
            <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={title}
                className="p-2 rounded-full transition-colors"
            >
                <div className="text-gray-700 hover:text-gray-950 dark:text-gray-400 dark:hover:text-gray-50 transition-colors duration-200">
                    {icon}
                </div>
            </a>
        </Tooltip>
    </motion.div>
);

const Nav = () => {
    const router = useRouter();
    const isTelevomunicazioni = router.pathname === "/scuola/telecomunicazioni";
    const [mobileMenuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    const socialLinks = [
        { href: "https://github.com/berry-13", icon: <SiGithub className="w-6 h-6" />, title: "GitHub" },
        { href: "https://x.com/berry13000", icon: <BsTwitterX className="w-6 h-6" />, title: "X (Twitter)" },
        {
            href: "https://linkedin.com/in/marco-beretta-berry",
            icon: <SiLinkedin className="w-6 h-6" />,
            title: "LinkedIn",
        },
        { href: "mailto:berry@librechat.ai", icon: <FiMail className="w-6 h-6" />, title: "Email" },
    ];

    return (
        <>
            {/* Desktop Navigation */}
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
            >
                <div className="flex items-center space-x-2">
                    <ThemeToggle disabled={isTelevomunicazioni} />
                    <LandingButton name="Home" link="/" selected={router.pathname === "/"} />
                    <LandingButton name="Contact" link="/contact" selected={router.pathname === "/contact"} />
                </div>
                <div className="flex items-center space-x-4">
                    {socialLinks.map(link => (
                        <LinkButton key={link.title} {...link} />
                    ))}
                </div>
            </motion.nav>

            {/* Mobile Navigation */}
            <nav
                className={cn(
                    "xs:hidden fixed top-0 left-0 right-0 z-50",
                    "bg-white/90 dark:bg-[#12181d]/90",
                    "border-b border-slate-800/50"
                )}
            >
                <div className="flex items-center justify-between px-4 py-3">
                    <ThemeToggle />
                    <button
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        className="p-2 rounded-lg text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                        <HiMenu className="w-6 h-6" />
                    </button>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
                                onClick={() => setMenuOpen(false)}
                                aria-hidden="true"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute top-full left-0 right-0 bg-white dark:bg-[#12181d] border-b border-slate-800/50 p-4 shadow-lg z-50" // removed backdrop-blur-lg
                            >
                                <div className="space-y-2">
                                    <MobileNavButton
                                        name="Home"
                                        link="/"
                                        selected={router.pathname === "/"}
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    <MobileNavButton
                                        name="Contact"
                                        link="/contact"
                                        selected={router.pathname === "/contact"}
                                        onClick={() => setMenuOpen(false)}
                                    />
                                </div>
                                <div className="flex justify-center gap-8 mt-8 pt-6 border-t border-slate-800/30">
                                    {socialLinks.map(link => (
                                        <LinkButton key={link.title} {...link} />
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </nav>
        </>
    );
};

export default Nav;
