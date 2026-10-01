import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "~/hooks/useInView";

interface RevealProps {
    as?: ElementType;
    /** Position in a staggered group; each step delays the entrance a little */
    index?: number;
    className?: string;
    /** Skip the blur; for long lists where filters on every row get expensive */
    lite?: boolean;
    children: ReactNode;
}

/** Rises and sharpens into place the first time it scrolls into view. Styles live in globals.css (.reveal). */
const Reveal = ({ as: Tag = "div", index = 0, className = "", lite = false, children }: RevealProps) => {
    const [ref, inView] = useInView<HTMLElement>();
    return (
        <Tag
            ref={ref}
            data-in={inView}
            className={`reveal${lite ? " lite" : ""} ${className}`}
            style={{ "--i": index % 8 } as CSSProperties}
        >
            {children}
        </Tag>
    );
};

export default Reveal;
