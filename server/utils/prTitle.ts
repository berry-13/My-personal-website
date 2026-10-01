export interface ParsedTitle {
    type: string | null;
    summary: string;
}

// PR titles look like "🧰 feat: Redesign Agent Builder"; drop the leading emoji and split off the type
export function parsePrTitle(title: string): ParsedTitle {
    const stripped = title.replace(/^[^\p{L}\p{N}]+/u, "").trim();
    const match = stripped.match(/^([a-z0-9]+)(?:\([^)]*\))?!?:\s*(.+)$/i);
    if (!match) return { type: null, summary: stripped };
    return { type: match[1].toLowerCase(), summary: match[2].trim() };
}
