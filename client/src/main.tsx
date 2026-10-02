import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import "./globals.css";

// The hero waits for the web fonts so the headline never reflows. This lives in the hashed bundle,
// not in an un-hashed public script, so a stale cached copy can never leave the headline hidden.
const markFontsReady = () => document.documentElement.classList.add("fonts-ready");
if (document.fonts?.load) {
    Promise.all([document.fonts.load("400 1em Newsreader"), document.fonts.load("400 1em 'JetBrains Mono'")]).then(
        markFontsReady,
        markFontsReady,
    );
    setTimeout(markFontsReady, 1200);
} else {
    markFontsReady();
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>
);
