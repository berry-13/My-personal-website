import { useCallback, useEffect, useState } from "react";

/**
 * True once the element has scrolled into view (fires once, then disconnects).
 * Uses a callback ref so elements that mount later, after data loads, are still observed.
 */
export function useInView<T extends Element>(rootMargin = "0px 0px -5% 0px") {
    const [node, setNode] = useState<T | null>(null);
    const [inView, setInView] = useState(false);
    const ref = useCallback((el: T | null) => setNode(el), []);

    useEffect(() => {
        if (!node || inView) return;
        if (typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => {
                // Also count content above the viewport (restored scroll, back navigation) as seen
                if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [node, inView, rootMargin]);

    return [ref, inView] as const;
}
