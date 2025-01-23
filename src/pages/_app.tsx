import Head from "next/head";
import NProgress from "nprogress";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import type { AppProps } from "next/app";
import { AnimatePresence, motion } from "framer-motion";
import { ReactLenis } from "@studio-freight/react-lenis";
import { NextComponentType, NextPageContext } from "next";
import Footer from "../components/Footer";
import Nav from "../components/Nav";

import "../globals.css";
import "react-tippy/dist/tippy.css";
import "nprogress/nprogress.css";

type MyAppProps = AppProps & {
    Component: NextComponentType<NextPageContext, any, any>;
};

NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.08,
    easing: "ease",
    speed: 200,
});

const SEO = {
    title: "Marco Beretta - Software Engineer",
    description: "Full-stack software engineer specializing in TypeScript, React, and modern web technologies.",
    author: "Marco Beretta",
    keywords: [
        "berry",
        "Marco Beretta",
        "software engineer",
        "github",
        "typescript",
        "Berry-13",
        "full-stack",
        "developer",
    ].join(", "),
};

const pageVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

function MyApp({ Component, pageProps, router }: MyAppProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const routerRef = useRouter();

    // Handle route change events
    useEffect(() => {
        const handleStart = () => {
            NProgress.start();
        };

        const handleComplete = () => {
            NProgress.done();
            playNavigationSound();
        };

        const handleError = () => {
            NProgress.done();
        };

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleError);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleComplete);
            router.events.off("routeChangeError", handleError);
        };
    }, [router.events]);

    // Initialize audio
    useEffect(() => {
        if (typeof window !== "undefined") {
            audioRef.current = new Audio("/pop.mp3");
            audioRef.current.volume = 0.4;
        }
    }, []);

    // Play navigation sound
    const playNavigationSound = (): void => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch((): void => {});
        }
    };

    return (
        <ReactLenis
            root
            options={{
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
                infinite: false,
            }}
        >
            <Head>
                <meta charSet="utf-8" />
                <title>{SEO.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta name="description" content={SEO.description} />
                <meta name="keywords" content={SEO.keywords} />
                <meta name="author" content={SEO.author} />
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
                <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
            </Head>

            <div className="min-h-screen bg-gradient-to-bl from-white via-white to-gray-50 dark:from-black dark:via-[#0d131f] dark:to-[#0d131f] transition-colors duration-300">
                <div className="flex justify-center">
                    <Nav />
                </div>
                <main className="w-full flex justify-center px-4">
                    <div className="w-full max-w-4xl text-black dark:text-white">
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={routerRef.pathname}
                                variants={pageVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="py-24"
                            >
                                <Component {...pageProps} />
                            </motion.div>
                        </AnimatePresence>
                        <Footer />
                    </div>
                </main>

                <style jsx global>{`
                    #nprogress {
                        pointer-events: none;
                    }

                    #nprogress .bar {
                        background: linear-gradient(to right, #818cf8, #6366f1, #4f46e5);
                        position: fixed;
                        z-index: 1031;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 3px;
                        box-shadow: 0 0 10px rgba(99, 102, 241, 0.7);
                    }

                    #nprogress .peg {
                        display: block;
                        position: absolute;
                        right: 0px;
                        width: 100px;
                        height: 100%;
                        box-shadow: 0 0 10px #4f46e5, 0 0 5px #4f46e5;
                        opacity: 1;
                        transform: rotate(3deg) translate(0px, -4px);
                    }
                `}</style>
            </div>
        </ReactLenis>
    );
}

export default MyApp;
