export type ProgrammingLanguage =
    | "JavaScript"
    | "TypeScript"
    | "Python"
    | "Java"
    | "C++"
    | "C#"
    | "Ruby"
    | "Go"
    | "Rust"
    | "PHP"
    | "Swift"
    | "Kotlin"
    | "HTML"
    | "CSS"
    | "Shell"
    | "Vue"
    | "Jupyter Notebook"
    | "Dart"
    | string; // Allow for other languages while maintaining type safety for known ones

const languageColorMap: Record<string, string> = {
    // Web Technologies
    "JavaScript": "#f1e05a",
    "TypeScript": "#3178c6",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "Vue": "#41b883",

    // Systems Programming
    "C++": "#f34b7d",
    "C#": "#178600",
    "Rust": "#dea584",
    "Go": "#00ADD8",

    // General Purpose
    "Python": "#3572A5",
    "Java": "#b07219",
    "Ruby": "#701516",
    "PHP": "#4F5D95",
    "Swift": "#ffac45",
    "Kotlin": "#A97BFF",

    // Other
    "Shell": "#89e051",
    "Jupyter Notebook": "#DA5B0B",
    "Dart": "#00B4AB",

    // Default color for unknown languages
    "default": "#949494",
};

/**
 * Gets the color associated with a programming language
 * @param language - The programming language to get the color for
 * @returns The hexadecimal color code for the language
 *
 * @example
 * ```typescript
 * const color = getLanguageColor('JavaScript'); // Returns '#f1e05a'
 * const unknownColor = getLanguageColor('UnknownLanguage'); // Returns '#949494'
 * ```
 */
export function getLanguageColor(language: ProgrammingLanguage): string {
    if (!language) return languageColorMap.default;

    const normalizedLanguage = language.trim();

    return languageColorMap[normalizedLanguage] || languageColorMap.default;
}

/**
 * Determines if a color is light or dark
 * @param color - The hexadecimal color code
 * @returns boolean indicating if the color is light
 */
export function isLightColor(color: string): boolean {
    const hex = color.replace("#", "");

    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Calculate relative luminance using the WCAG formula
    // See: https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    return luminance > 0.5;
}

/**
 * Gets the appropriate text color (black or white) for a background color
 * @param backgroundColor - The hexadecimal color code of the background
 * @returns The appropriate text color ('#000000' or '#ffffff')
 *
 * @example
 * ```typescript
 * const textColor = getContrastTextColor('#f1e05a'); // Returns '#000000'
 * ```
 */
export function getContrastTextColor(backgroundColor: string): string {
    return isLightColor(backgroundColor) ? "#000000" : "#ffffff";
}
