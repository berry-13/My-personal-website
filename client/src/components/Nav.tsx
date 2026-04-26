import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useBodyLock } from "~/hooks/useBodyLock";
import { FiMail, FiHome, FiActivity } from "react-icons/fi";
import { BsTwitterX } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import { RiContactsLine } from "react-icons/ri";
import { SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { Button } from "~/components/ui";
import ThemeToggle from "./ThemeToggle";
import { cn } from "~/utils";

interface LandingButtonProps {
    name: string;
    link: string;
    icon: React.ReactNode;
    selected: boolean;
}

interface MobileNavButtonProps extends LandingButtonProps {
    onClick: () => void;
    index: number;
}

const appleEase = [0.25, 0.1, 0.25, 1] as const;

const navVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 1,
            ease: appleEase,
            staggerChildren: 0.06,
            delayChildren: 0.15,
        },
    },
};

const itemVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.7,
            ease: appleEase,
        },
    },
};

const LandingButton = ({ name, link, icon, selected }: LandingButtonProps) => (
    <motion.div variants={itemVariants}>
        <Link
            to={link}
            viewTransition
            aria-current={selected ? "page" : undefined}
            className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl transition-all duration-300",
                "hover:text-black dark:hover:text-white",
                selected ? "text-black dark:text-white" : "text-black/60 dark:text-white/60"
            )}
        >
            <span className="relative z-10">{icon}</span>
            <span className="relative z-10">{name}</span>
            {selected && (
                <motion.div
                    layoutId="navPill"
                    className="absolute inset-0 rounded-xl bg-linear-to-r from-black/8 to-black/12 dark:from-white/8 dark:to-white/12 backdrop-blur-sm"
                    transition={{
                        type: "spring",
                        bounce: 0.25,
                        duration: 0.6,
                    }}
                />
            )}
        </Link>
    </motion.div>
);

const MobileNavButton = ({ name, link, icon, selected, onClick, index }: MobileNavButtonProps) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{
            delay: index * 0.05,
            duration: 0.3,
            ease: appleEase,
        }}
        whileTap={{ scale: 0.98 }}
    >
        <Link
            to={link}
            viewTransition
            onClick={onClick}
            aria-current={selected ? "page" : undefined}
            className={cn(
                "w-full px-6 py-4 text-base font-medium rounded-2xl transition-all duration-300",
                "flex items-center justify-center gap-2 backdrop-blur-sm",
                selected
                    ? "text-black dark:text-white bg-linear-to-r from-black/8 to-black/12 dark:from-white/8 dark:to-white/12"
                    : "text-black/60 dark:text-white/60 hover:bg-black/4 dark:hover:bg-white/4"
            )}
        >
            {icon}
            {name}
        </Link>
    </motion.div>
);

const Nav = () => {
    const location = useLocation();
    const isTelevomunicazioni = location.pathname === "/scuola/telecomunicazioni";
    const [mobileMenuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useBodyLock(mobileMenuOpen);

    const socialLinks = [
        { href: "https://github.com/berry-13", icon: <SiGithub className="w-5 h-5" />, title: "GitHub" },
        { href: "https://x.com/berry13000", icon: <BsTwitterX className="w-5 h-5" />, title: "X (Twitter)" },
        {
            href: "https://linkedin.com/in/marco-beretta-berry",
            icon: <FaLinkedin className="w-5 h-5" />,
            title: "LinkedIn",
        },
        { href: "mailto:berry@librechat.ai", icon: <FiMail className="w-5 h-5" />, title: "Email" },
    ];

    return (
        <>
            {/* Desktop Navigation */}
            <motion.nav
                aria-label="Desktop navigation"
                variants={navVariants}
                initial="hidden"
                animate="visible"
                className={cn(
                    "hidden z-999 fixed w-11/12 lg:w-240 xs:flex items-center justify-between",
                    "px-6 mt-4 lg:mt-6 rounded-2xl transition-all duration-500 h-18",
                    scrolled
                        ? "bg-white/70 dark:bg-[#12181d]/70 shadow-2xl shadow-black/8 backdrop-saturate-180"
                        : "bg-white/50 dark:bg-[#12181d]/50 backdrop-saturate-150",
                    "backdrop-blur-md",
                    "border border-black/15 dark:border-white/10",
                    "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-b before:from-white/20 before:to-transparent dark:before:from-white/5",
                    "after:absolute after:inset-0 after:rounded-2xl after:bg-gradient-to-t after:to-transparent dark:after:from-black/10"
                )}
            >
                <LayoutGroup>
                    <div className="flex items-center space-x-1 relative z-10">
                        <motion.div variants={itemVariants}>
                            <ThemeToggle disabled={isTelevomunicazioni} />
                        </motion.div>
                        <LandingButton name="Home" link="/" icon={<FiHome className="w-4 h-4" />} selected={location.pathname === "/"} />
                        <LandingButton name="Now" link="/now" icon={<FiActivity className="w-4 h-4" />} selected={location.pathname === "/now"} />
                        <LandingButton name="Contact" link="/contact" icon={<RiContactsLine className="w-4 h-4" />} selected={location.pathname === "/contact"} />
                    </div>
                </LayoutGroup>
                <div className="flex items-center space-x-2 relative z-10">
                    {socialLinks.map(link => (
                        <Button key={link.title} {...link} />
                    ))}
                </div>
            </motion.nav>

            {/* Mobile Navigation */}
            <motion.nav
                aria-label="Mobile navigation"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: appleEase }}
                className={cn(
                    "xs:hidden fixed top-0 left-0 right-0 z-50",
                    "bg-white/80 dark:bg-[#12181d]/80 backdrop-blur-xl backdrop-saturate-150",
                    "border-b border-white/20 dark:border-white/10"
                )}
            >
                <div className="flex items-center justify-between px-4 py-4">
                    <ThemeToggle />
                    <motion.button
                        onClick={() => setMenuOpen(prev => !prev)}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        className="p-2.5 rounded-xl text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <AnimatePresence mode="wait">
                            {mobileMenuOpen ? (
                                <motion.div
                                    key="close"
                                    initial={{ rotate: 0, opacity: 0 }}
                                    animate={{ rotate: 180, opacity: 1 }}
                                    exit={{ rotate: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <HiX className="w-6 h-6" />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="menu"
                                    initial={{ rotate: 0, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 180, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <HiMenu className="w-6 h-6" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 backdrop-blur-sm"
                                onClick={() => setMenuOpen(false)}
                                aria-hidden="true"
                            />
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                transition={{ duration: 0.3, ease: appleEase }}
                                className="absolute top-full left-4 right-4 mt-2 bg-white/95 dark:bg-[#12181d]/95 backdrop-blur-xl backdrop-saturate-150 rounded-2xl border border-white/20 dark:border-white/10 p-6 shadow-2xl z-50"
                                style={{
                                    boxShadow:
                                        "0 20px 40px -10px rgba(0, 0, 0, 0.2), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)",
                                }}
                            >
                                <div className="space-y-3">
                                    <MobileNavButton
                                        name="Home"
                                        link="/"
                                        icon={<FiHome className="w-5 h-5" />}
                                        selected={location.pathname === "/"}
                                        onClick={() => setMenuOpen(false)}
                                        index={0}
                                    />
                                    <MobileNavButton
                                        name="Now"
                                        link="/now"
                                        icon={<FiActivity className="w-5 h-5" />}
                                        selected={location.pathname === "/now"}
                                        onClick={() => setMenuOpen(false)}
                                        index={1}
                                    />
                                    <MobileNavButton
                                        name="Contact"
                                        link="/contact"
                                        icon={<RiContactsLine className="w-5 h-5" />}
                                        selected={location.pathname === "/contact"}
                                        onClick={() => setMenuOpen(false)}
                                        index={2}
                                    />
                                </div>
                                <motion.div
                                    className="flex justify-center gap-6 mt-8 pt-6 border-t border-black/10 dark:border-white/10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                >
                                    {socialLinks.map(link => (
                                        <Button key={link.title} {...link} />
                                    ))}
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.nav>
        </>
    );
};

export default Nav;
