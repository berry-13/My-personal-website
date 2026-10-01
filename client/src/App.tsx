import { useEffect, useRef, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { isSoundEnabled } from "./components/SoundToggle";

const Home = lazy(() => import("./pages/Home"));
const Contact = lazy(() => import("./pages/Contact"));
const Now = lazy(() => import("./pages/Now"));
const NotFound = lazy(() => import("./pages/NotFound"));

const TITLES: Record<string, string> = {
    "/": "Marco Beretta, Software Engineer",
    "/now": "Now · Marco Beretta",
    "/contact": "Contact · Marco Beretta",
};

function App() {
    const location = useLocation();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const prevPathRef = useRef(location.pathname);

    useEffect(() => {
        const audio = new Audio("/pop.mp3");
        audio.preload = "auto";
        audio.volume = 0.4;
        audioRef.current = audio;
    }, []);

    useEffect(() => {
        document.title = TITLES[location.pathname] ?? "Not found · Marco Beretta";
        if (prevPathRef.current === location.pathname) return;
        prevPathRef.current = location.pathname;
        window.scrollTo(0, 0);
        if (isSoundEnabled() && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {
                // Autoplay restrictions; ignore
            });
        }
    }, [location.pathname]);

    return (
        <div className="mx-auto min-h-screen max-w-[46rem] px-5 pt-8 sm:pt-12">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-paper"
            >
                Skip to content
            </a>
            <Header />
            <main id="main-content" className="pt-16 sm:pt-20" style={{ viewTransitionName: "page" }}>
                <Suspense
                    fallback={
                        <p role="status" className="font-mono text-[13px] text-muted">
                            loading&hellip;
                        </p>
                    }
                >
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/now" element={<Now />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default App;
