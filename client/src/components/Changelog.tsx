import { useRef, useState } from "react";
import { useChangelog } from "~/hooks/useChangelog";
import { isoDate } from "~/utils";
import DiffStat from "./DiffStat";
import Reveal from "./motion/Reveal";

const INITIAL = 12;
const ALL_PRS_URL = "https://github.com/LibreChat-AI/LibreChat/pulls?q=is%3Apr+author%3Aberry-13+is%3Amerged";

const Changelog = () => {
    const { data, isLoading, isError } = useChangelog();
    const [expanded, setExpanded] = useState(false);
    const listRef = useRef<HTMLOListElement>(null);

    const toggle = () => {
        if (expanded) {
            // Collapsing removes ~28 rows; keep the reader at the list instead of stranding them below it
            listRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
        }
        setExpanded(e => !e);
    };

    if (isError) {
        return (
            <p className="font-mono text-[13px] text-muted">
                Couldn&apos;t reach GitHub just now.{" "}
                <a href={ALL_PRS_URL} target="_blank" rel="noreferrer" className="link">
                    See the pull requests on GitHub
                </a>
                .
            </p>
        );
    }

    if (isLoading || !data) {
        return (
            <ol role="status" aria-label="Loading pull requests" className="divide-y divide-rule/70">
                {Array.from({ length: INITIAL }, (_, i) => (
                    <li
                        key={i}
                        className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-2 py-4 sm:grid-cols-[7rem_4.5rem_1fr_auto]"
                    >
                        <span className="h-3 w-20 bg-rule/60 motion-safe:animate-pulse" />
                        <span className="h-3 w-12 bg-rule/60 motion-safe:animate-pulse" />
                        <span className="col-span-2 h-5 w-full max-w-[30rem] bg-rule/60 motion-safe:animate-pulse sm:col-span-1" />
                        <span className="col-span-2 h-3 w-24 bg-rule/40 motion-safe:animate-pulse sm:col-span-1" />
                    </li>
                ))}
            </ol>
        );
    }

    const entries = expanded ? data.entries : data.entries.slice(0, INITIAL);

    return (
        <div>
            <ol ref={listRef} className="scroll-mt-24 divide-y divide-rule/70">
                {entries.map((entry, i) => (
                    <Reveal
                        as="li"
                        lite
                        key={entry.number}
                        index={i}
                        className="group grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 py-4 sm:grid-cols-[7rem_4.5rem_1fr_auto] sm:items-baseline"
                    >
                        <time dateTime={entry.mergedAt} className="font-mono text-xs text-muted tabular-nums">
                            {isoDate(entry.mergedAt)}
                        </time>
                        <span className="font-mono text-xs text-muted tabular-nums">#{entry.number}</span>
                        <a
                            href={entry.url}
                            target="_blank"
                            rel="noreferrer"
                            className="col-span-2 min-w-0 text-lg leading-snug break-words transition-colors duration-300 group-hover:text-accent sm:col-span-1 lg:text-xl"
                        >
                            {entry.type && (
                                <span className="mr-2 font-mono text-xs text-muted">{entry.type}</span>
                            )}
                            {entry.title}
                        </a>
                        <span className="col-span-2 sm:col-span-1">
                            <DiffStat additions={entry.additions} deletions={entry.deletions} />
                        </span>
                    </Reveal>
                ))}
            </ol>
            <p className="mt-4 flex flex-wrap gap-x-5 font-mono text-[13px] text-muted">
                {data.entries.length > INITIAL && (
                    <button
                        type="button"
                        onClick={toggle}
                        aria-expanded={expanded}
                        className="-my-3 cursor-pointer py-3 transition-colors hover:text-ink"
                    >
                        {expanded ? "show less" : `show ${data.entries.length - INITIAL} more`}
                    </button>
                )}
                <a href={ALL_PRS_URL} target="_blank" rel="noreferrer" className="-my-3 py-3 transition-colors hover:text-ink">
                    all {data.total} merged on GitHub &rarr;
                </a>
            </p>
        </div>
    );
};

export default Changelog;
