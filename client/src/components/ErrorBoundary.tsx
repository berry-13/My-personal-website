import { Component } from "react";
import type { ReactNode, ErrorInfo } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(): State {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <main className="mx-auto max-w-[46rem] px-5 pt-16">
                    <h1 className="text-3xl">Something went wrong</h1>
                    <p className="mt-3 font-mono text-[13px] text-muted">An unexpected error occurred.</p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-8 cursor-pointer border border-ink px-5 py-2 font-mono text-[13px] hover:bg-ink hover:text-paper"
                    >
                        reload the page
                    </button>
                </main>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
