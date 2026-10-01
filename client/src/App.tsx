import { useEffect, useLayoutEffect, useRef } from "react";
import { Routes, Route, useLocation, useNavigationType } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { isSoundEnabled } from "./components/SoundToggle";
import Home from "./pages/Home";
import Now from "./pages/Now";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const TITLES: Record<string, string> = {
    "/": "Marco Beretta, Software Engineer",
    "/now": "Now · Marco Beretta",
    "/contact": "Contact · Marco Beretta",
};

const normalize = (path: string) => (path.length > 1 ? path.replace(/\/+$/, "") : path);

// The router restores scroll ourselves: top on new pages, saved position on back/forward
if (typeof window !== "undefined" && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}
const scrollPositions = new Map<string, number>();

function App() {
    const location = useLocation();
    const navigationType = useNavigationType();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isFirstRender = useRef(true);
    const path = normalize(location.pathname);

    // Track the last scroll position as it happens. By the time a navigation commits, the old page is already
    // gone from the DOM and window.scrollY has been clamped, so reading it then would always give 0.
    const lastScrollY = useRef(0);
    useEffect(() => {
        const track = () => {
            lastScrollY.current = window.scrollY;
        };
        window.addEventListener("scroll", track, { passive: true });
        return () => window.removeEventListener("scroll", track);
    }, []);

    useLayoutEffect(() => {
        const key = location.key;
        return () => {
            scrollPositions.set(key, lastScrollY.current);
        };
    }, [location.key]);

    // Before paint: reset or restore scroll, so the old position never flashes
    useLayoutEffect(() => {
        document.title = TITLES[path] ?? "Not found · Marco Beretta";
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        if (navigationType === "POP") {
            window.scrollTo(0, scrollPositions.get(location.key) ?? 0);
            return;
        }
        window.scrollTo(0, 0);
        // Move focus to the new page's heading so keyboard and screen reader users land on it
        document.getElementById("page-title")?.focus({ preventScroll: true });
    }, [location.key, navigationType, path]);

    // Navigation sound only for link clicks, never for back/forward or the first load
    useEffect(() => {
        if (navigationType !== "PUSH" || !isSoundEnabled()) return;
        if (!audioRef.current) {
            audioRef.current = new Audio("/pop.mp3");
            audioRef.current.volume = 0.4;
        }
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
            // Autoplay restrictions; ignore
        });
    }, [location.key, navigationType]);

    return (
        <div className="flex min-h-dvh flex-col">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:font-mono focus:text-sm focus:text-paper"
            >
                Skip to content
            </a>
            <Header />
            <main
                id="main-content"
                tabIndex={-1}
                className="stage flex-1 overflow-x-clip pt-12 pb-20 outline-none sm:pt-16 lg:pt-16 lg:pb-24"
            >
                <div key={location.key} className="page-enter">
                    <Routes location={location}>
                        <Route path="/" element={<Home />} />
                        <Route path="/now" element={<Now />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;
