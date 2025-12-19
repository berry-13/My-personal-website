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
    | string;

const languageColorMap: Record<string, string> = {
    "JavaScript": "#f1e05a",
    "TypeScript": "#3178c6",
    "HTML": "#e34c26",
    "CSS": "#563d7c",
    "Vue": "#41b883",
    "C++": "#f34b7d",
    "C#": "#178600",
    "Rust": "#dea584",
    "Go": "#00ADD8",
    "Python": "#3572A5",
    "Java": "#b07219",
    "Ruby": "#701516",
    "PHP": "#4F5D95",
    "Swift": "#ffac45",
    "Kotlin": "#A97BFF",
    "Shell": "#89e051",
    "Jupyter Notebook": "#DA5B0B",
    "Dart": "#00B4AB",
    "default": "#949494",
};

export function getLanguageColor(language: ProgrammingLanguage): string {
    if (!language) return languageColorMap.default;
    const normalizedLanguage = language.trim();
    return languageColorMap[normalizedLanguage] || languageColorMap.default;
}

export function isLightColor(color: string): boolean {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
}

export function getContrastTextColor(backgroundColor: string): string {
    return isLightColor(backgroundColor) ? "#000000" : "#ffffff";
}
