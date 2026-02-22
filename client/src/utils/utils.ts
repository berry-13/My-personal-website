export const formatNumber = (num: number): string => {
    if (!Number.isFinite(num)) return "0";
    return num.toLocaleString("en-US");
};
