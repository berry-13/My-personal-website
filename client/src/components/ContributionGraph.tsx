import { useCallback, type CSSProperties } from "react";
import { useContributions, type ContributionDay } from "~/hooks/useContributions";
import { useInView } from "~/hooks/useInView";

const CELL_SIZE = 11;
const CELL_GAP = 3;
const STEP = CELL_SIZE + CELL_GAP;

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const Cell = ({ day, x, y, col }: { day: ContributionDay; x: number; y: number; col: number }) => {
    const label =
        day.count === 0
            ? `No contributions on ${formatDate(day.date)}`
            : `${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`;
    return (
        <rect
            x={x}
            y={y}
            width={CELL_SIZE}
            height={CELL_SIZE}
            rx={0}
            ry={0}
            fill={`var(--cgraph-${day.level})`}
            style={{ "--col": col } as CSSProperties}
        >
            <title>{label}</title>
        </rect>
    );
};

const ContributionGraph = () => {
    const { data, isLoading, isError } = useContributions();
    const [ref, inView] = useInView<HTMLElement>();
    // On narrow screens the graph scrolls sideways at full size; start at the most recent weeks
    const scrollToLatest = useCallback((el: HTMLDivElement | null) => {
        if (el) el.scrollLeft = el.scrollWidth;
    }, []);

    if (isError) {
        return <p className="font-mono text-[13px] text-muted">Couldn't load contributions right now.</p>;
    }

    if (isLoading || !data) {
        return (
            <div role="status" aria-label="Loading contributions">
                <div className="aspect-[742/98] min-h-[86px] w-full bg-rule/40 motion-safe:animate-pulse" />
                <div className="mt-3 h-[18px]" />
            </div>
        );
    }

    const weeks = data.weeks;
    const width = weeks.length * STEP;
    const height = 7 * STEP;

    return (
        <figure ref={ref} data-in={inView} className="heatmap w-full">
            <div
                ref={scrollToLatest}
                tabIndex={0}
                aria-label="Contribution heatmap, scrollable"
                className="overflow-x-auto overscroll-x-contain"
            >
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    width="100%"
                    preserveAspectRatio="xMinYMin meet"
                    className="block h-auto min-w-[640px] sm:min-w-0"
                    role="img"
                    aria-label={`Contribution heatmap: ${data.total.toLocaleString()} contributions in the last year`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {weeks.map((week, weekIdx) =>
                        week.map((day, dayIdx) => (
                            <Cell key={day.date} day={day} x={weekIdx * STEP} y={dayIdx * STEP} col={weekIdx} />
                        )),
                    )}
                </svg>
            </div>
            <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 font-mono text-xs text-muted">
                <span>{data.total.toLocaleString()} contributions in the last year</span>
                <span className="flex items-center gap-1.5">
                    <span>less</span>
                    {[0, 1, 2, 3, 4].map(level => (
                        <span
                            key={level}
                            className="inline-block size-2.5"
                            style={{ background: `var(--cgraph-${level})` }}
                            aria-hidden="true"
                        />
                    ))}
                    <span>more</span>
                </span>
            </figcaption>
        </figure>
    );
};

export default ContributionGraph;
