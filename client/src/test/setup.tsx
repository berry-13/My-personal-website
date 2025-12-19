import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterEach, mock } from "bun:test";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Register happy-dom globals (document, window, etc.)
GlobalRegistrator.register();

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock react-router-dom
mock.module("react-router-dom", () => ({
    useLocation: () => ({
        pathname: "/",
        search: "",
        hash: "",
        state: null,
        key: "default",
    }),
    useNavigate: () => mock(() => {}),
    Link: ({ to, children, ...props }: { to: string; children: React.ReactNode }) =>
        <a href={to} {...props}>{children}</a>,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock IntersectionObserver
globalThis.IntersectionObserver = class MockIntersectionObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
    }),
});

// Mock ResizeObserver
globalThis.ResizeObserver = class MockResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
} as unknown as typeof ResizeObserver;
