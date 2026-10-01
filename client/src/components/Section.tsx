import type { ReactNode } from "react";

interface SectionProps {
    index: string;
    title: string;
    children: ReactNode;
}

/** Numbered section with a mono label, like a heading in a printed changelog */
const Section = ({ index, title, children }: SectionProps) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return (
        <section aria-labelledby={id} className="mt-20">
            <h2 id={id} className="mb-6 flex items-baseline gap-3 border-b border-rule pb-2 font-mono text-[13px] text-muted">
                <span aria-hidden="true" className="text-accent">
                    {index}
                </span>
                <span className="text-ink">{title}</span>
            </h2>
            {children}
        </section>
    );
};

export default Section;
