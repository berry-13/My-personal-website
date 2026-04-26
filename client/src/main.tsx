import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as Tooltip from "@radix-ui/react-tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import App from "./App";
import "./globals.css";
import "nprogress/nprogress.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <Tooltip.Provider delayDuration={200} skipDelayDuration={100}>
                    <App />
                </Tooltip.Provider>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>
);
