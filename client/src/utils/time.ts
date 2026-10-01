const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto", style: "short" });

const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 365 * 24 * 3600],
    ["month", 30 * 24 * 3600],
    ["week", 7 * 24 * 3600],
    ["day", 24 * 3600],
    ["hour", 3600],
    ["minute", 60],
];

export function timeAgo(iso: string, now: Date = new Date()): string {
    const seconds = Math.round((new Date(iso).getTime() - now.getTime()) / 1000);
    for (const [unit, size] of UNITS) {
        if (Math.abs(seconds) >= size) return relative.format(Math.round(seconds / size), unit);
    }
    return "just now";
}

/** "2026-09-30" style date, the way a changelog prints it */
export function isoDate(iso: string): string {
    return iso.slice(0, 10);
}
