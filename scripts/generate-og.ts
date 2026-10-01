import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { writeFile } from "node:fs/promises";

// Old user agent makes Google Fonts serve TTF, which satori can read
async function loadFont(family: string): Promise<ArrayBuffer> {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=${family}`, {
        headers: { "User-Agent": "Mozilla/4.0" },
    }).then(r => r.text());
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) throw new Error(`No TTF found for ${family}`);
    return fetch(url).then(r => r.arrayBuffer());
}

const [newsreader, mono] = await Promise.all([
    loadFont("Newsreader:opsz,wght@72,400"),
    loadFont("JetBrains+Mono:wght@400"),
]);

const PAPER = "#f4f1ea";
const INK = "#1c1b18";
const MUTED = "#6a655b";
const RULE = "#ddd7ca";
const ACCENT = "#b4410e";

const monoText = (text: string, color = MUTED) => ({
    type: "div",
    props: { style: { fontFamily: "JetBrains Mono", fontSize: "24px", color }, children: text },
});

const svg = await satori(
    {
        type: "div",
        props: {
            style: {
                width: "1200px",
                height: "630px",
                display: "flex",
                flexDirection: "column",
                padding: "72px 80px",
                background: PAPER,
                color: INK,
                fontFamily: "Newsreader",
            },
            children: [
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            justifyContent: "space-between",
                            paddingBottom: "20px",
                            borderBottom: `2px solid ${RULE}`,
                        },
                        children: [monoText("Marco Beretta", INK), monoText("me.berry13.com")],
                    },
                },
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            marginTop: "64px",
                            fontSize: "64px",
                            lineHeight: 1.15,
                            letterSpacing: "-0.01em",
                            maxWidth: "980px",
                        },
                        children: "I build interfaces for AI tools. 440+ pull requests merged into LibreChat.",
                    },
                },
                {
                    type: "div",
                    props: {
                        style: { display: "flex", gap: "28px", marginTop: "auto", alignItems: "center" },
                        children: [
                            monoText("#13952", MUTED),
                            monoText("feat  Redesign Agent Builder", INK),
                            monoText("+10,645", "#2e7d32"),
                            monoText("\u22125,125", "#b42318"),
                            {
                                type: "div",
                                props: { style: { width: "14px", height: "28px", background: ACCENT } },
                            },
                        ],
                    },
                },
            ],
        },
    },
    {
        width: 1200,
        height: 630,
        fonts: [
            { name: "Newsreader", data: newsreader, weight: 400, style: "normal" },
            { name: "JetBrains Mono", data: mono, weight: 400, style: "normal" },
        ],
    },
);

const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
await writeFile("client/public/og.png", png);
console.log("Generated client/public/og.png", `(${(png.length / 1024).toFixed(1)} KB)`);
