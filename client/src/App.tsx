import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import NProgress from "nprogress";
import Lenis from "lenis";
import { AnimatePresence, motion } from "framer-motion";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

const DarkVeil = lazy(() => import("./components/DarkVeil"));
const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.08,
    easing: "ease",
    speed: 200,
});

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
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1] as const,
        },
    },
};

const PageLoader = () => (
    <div className="flex items-center justify-center min-h-[50vh]" role="status" aria-label="Loading page">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500" aria-hidden="true" />
        <span className="sr-only">Loading...</span>
    </div>
);

function App() {
    const location = useLocation();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const prevPathRef = useRef(location.pathname);

    useEffect(() => {
        const checkTheme = () => {
            setIsDarkMode(document.documentElement.classList.contains("dark"));
        };

        checkTheme();

        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
            infinite: false,
        });

        function raf(time: number) {
            lenis.raf(time);
            rafIdRef.current = requestAnimationFrame(raf);
        }

        rafIdRef.current = requestAnimationFrame(raf);

        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        const audio = new Audio("/pop.mp3");
        audio.preload = "auto";
        audio.volume = 0.4;
        audioRef.current = audio;
    }, []);

    const playNavigationSound = (): void => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
                // Audio playback failed - ignore (autoplay restrictions)
            });
        }
    };

    useEffect(() => {
        if (prevPathRef.current !== location.pathname) {
            NProgress.start();
            NProgress.done();
            playNavigationSound();
            prevPathRef.current = location.pathname;
        }
    }, [location.pathname]);

    return (
        <div className="min-h-screen transition-colors duration-300">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-violet-500 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium"
            >
                Skip to main content
            </a>
            <div className="fixed inset-0 z-0 h-screen pointer-events-none" aria-hidden="true">
                <Suspense fallback={null}>
                    <DarkVeil hueShift={isDarkMode ? 0 : 180} speed={0.5} scanlineFrequency={0.5} scrollSync lightMode={!isDarkMode} />
                </Suspense>
            </div>
            <div className="fixed top-0 left-0 right-0 z-50 flex justify-center">
                <Nav />
            </div>
            <main id="main-content" className="relative z-10 w-full flex justify-center px-4">
                <div className="w-full max-w-4xl text-black dark:text-white">
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                            key={location.pathname}
                            variants={pageVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="py-24"
                        >
                            <Suspense fallback={<PageLoader />}>
                                <Routes location={location}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="*" element={<NotFound />} />
                                </Routes>
                            </Suspense>
                        </motion.div>
                    </AnimatePresence>
                    <Footer />
                </div>
            </main>
        </div>
    );
}

export default App;
