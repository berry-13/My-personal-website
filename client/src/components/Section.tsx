import type { ReactNode } from "react";
import Reveal from "./motion/Reveal";

interface SectionProps {
    index: string;
    title: string;
    children: ReactNode;
}

/** Numbered section. On wide screens the label pins in the left column while the content scrolls. */
const Section = ({ index, title, children }: SectionProps) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return (
        <section aria-labelledby={id} className="mt-28 border-t border-rule pt-6 lg:mt-44 lg:grid lg:grid-cols-12 lg:gap-x-10">
            <div className="lg:col-span-3">
                <Reveal className="lg:sticky lg:top-24">
                    <h2 id={id} className="flex items-baseline gap-3 font-mono text-[13px] text-muted">
                        <span aria-hidden="true" className="text-accent">
                            {index}
                        </span>
                        <span className="text-ink">{title}</span>
                    </h2>
                </Reveal>
            </div>
            <div className="mt-8 lg:col-span-9 lg:mt-0">{children}</div>
        </section>
    );
};

export default Section;
