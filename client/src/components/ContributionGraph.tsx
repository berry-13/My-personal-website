import { useContributions, type ContributionDay } from "~/hooks/useContributions";

const CELL_SIZE = 11;
const CELL_GAP = 3;
const STEP = CELL_SIZE + CELL_GAP;

const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const Cell = ({ day, x, y }: { day: ContributionDay; x: number; y: number }) => {
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
            rx={2}
            ry={2}
            fill={`var(--cgraph-${day.level})`}
            className="transition-colors"
        >
            <title>{label}</title>
        </rect>
    );
};

const ContributionGraph = () => {
    const { data, isLoading, isError } = useContributions();

    if (isError) {
        return (
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Couldn't load contributions right now.
            </p>
        );
    }

    if (isLoading || !data) {
        return (
            <div
                className="w-full h-[110px] loader-shimmer"
                role="status"
                aria-label="Loading contribution graph"
            />
        );
    }

    const weeks = data.weeks;
    const width = weeks.length * STEP;
    const height = 7 * STEP;

    return (
        <figure
            className="w-full overflow-x-auto"
            aria-label={`${data.total.toLocaleString()} GitHub contributions in the last year`}
        >
            <svg
                viewBox={`0 0 ${width} ${height}`}
                width={width}
                height={height}
                role="img"
                xmlns="http://www.w3.org/2000/svg"
            >
                {weeks.map((week, weekIdx) =>
                    week.map((day, dayIdx) => (
                        <Cell key={day.date} day={day} x={weekIdx * STEP} y={dayIdx * STEP} />
                    )),
                )}
            </svg>
            <figcaption className="mt-3 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{data.total.toLocaleString()} contributions in the last year</span>
                <span className="flex items-center gap-1.5">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map(level => (
                        <span
                            key={level}
                            className="inline-block w-2.5 h-2.5 rounded-[2px]"
                            style={{ background: `var(--cgraph-${level})` }}
                            aria-hidden="true"
                        />
                    ))}
                    <span>More</span>
                </span>
            </figcaption>
        </figure>
    );
};

export default ContributionGraph;
