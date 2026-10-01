import { useEffect, useState } from "react";
import { useInView } from "~/hooks/useInView";

interface CountUpProps {
    value: number;
    suffix?: string;
    duration?: number;
}

// Exponential ease-out: fast start, long gentle settle, like a critically damped spring
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

const format = (n: number) => Math.round(n).toLocaleString("en-US");

/** Counts from 0 to value when it scrolls into view. Screen readers get the final value only. */
const CountUp = ({ value, suffix = "", duration = 1600 }: CountUpProps) => {
    const [ref, inView] = useInView<HTMLSpanElement>();
    const [shown, setShown] = useState(0);

    useEffect(() => {
        if (!inView) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setShown(value);
            return;
        }
        let frame = 0;
        const start = performance.now();
        const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            setShown(value * easeOutExpo(t));
            if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [inView, value, duration]);

    return (
        <span ref={ref}>
            <span aria-hidden="true" className="tabular-nums">
                {format(shown)}
                {suffix}
            </span>
            <span className="sr-only">
                {format(value)}
                {suffix}
            </span>
        </span>
    );
};

export default CountUp;
