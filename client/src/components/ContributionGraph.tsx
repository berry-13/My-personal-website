import type { CSSProperties } from "react";
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

    if (isError) {
        return (
            <p className="font-mono text-[13px] text-muted">
                Couldn't load contributions right now.
            </p>
        );
    }

    if (isLoading || !data) {
        return (
            <p role="status" className="h-[98px] font-mono text-[13px] text-muted">
                fetching activity&hellip;
            </p>
        );
    }

    const weeks = data.weeks;
    const width = weeks.length * STEP;
    const height = 7 * STEP;

    return (
        <figure ref={ref} data-in={inView} className="heatmap w-full">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                width="100%"
                preserveAspectRatio="xMinYMin meet"
                className="block h-auto max-w-full"
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
            <figcaption className="mt-3 flex items-center justify-between font-mono text-xs text-muted">
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
