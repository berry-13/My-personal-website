export const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US");
};

/** Repo descriptions for a plain-text listing: no leading emoji, cut at the first sentence or ~max chars */
export const cleanDescription = (text: string | null, max = 140): string => {
    if (!text) return "No description.";
    const stripped = text.replace(/^[^\p{L}\p{N}]+/u, "").trim();
    const sentence = stripped.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? stripped;
    if (sentence.length <= max) return sentence;
    const cut = sentence.slice(0, max);
    return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};
