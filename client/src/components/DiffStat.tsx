interface DiffStatProps {
    additions: number;
    deletions: number;
}

const BAR_MAX = 48;
// Log scale so a 20k-line refactor and a 40-line fix are both readable
const width = (n: number) => (n <= 0 ? 0 : Math.max(2, Math.round((Math.log10(n + 1) / 5) * BAR_MAX)));

const DiffStat = ({ additions, deletions }: DiffStatProps) => (
    <span className="inline-flex items-center gap-2 font-mono text-xs tabular-nums">
        <span aria-hidden="true" className="text-add">+{additions.toLocaleString("en-US")}</span>
        <span aria-hidden="true" className="text-del">&minus;{deletions.toLocaleString("en-US")}</span>
        <span aria-hidden="true" className="hidden items-center gap-px sm:inline-flex">
            <span className="h-1.5 bg-add" style={{ width: width(additions) }} />
            <span className="h-1.5 bg-del" style={{ width: width(deletions) }} />
        </span>
        <span className="sr-only">
            {additions} lines added, {deletions} lines removed
        </span>
    </span>
);

export default DiffStat;
