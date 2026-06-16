import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { writeFile } from "node:fs/promises";

const fontUrl = "https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf";
const fontBoldUrl = "https://fonts.gstatic.com/s/inter/v19/UcCO3FwrK3iLTeHuS_nVMrMxCp50ojIw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf";

const [interRegular, interBold] = await Promise.all([
    fetch(fontUrl).then(r => r.arrayBuffer()),
    fetch(fontBoldUrl).then(r => r.arrayBuffer()),
]);

const svg = await satori(
    {
        type: "div",
        props: {
            style: {
                width: "1200px",
                height: "630px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                padding: "80px",
                background: "linear-gradient(135deg, #0a0a14 0%, #1a1530 50%, #0f1024 100%)",
                color: "white",
                fontFamily: "Inter",
            },
            children: [
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            alignItems: "center",
                            gap: "16px",
                            marginBottom: "32px",
                            color: "#a78bfa",
                            fontSize: "24px",
                            fontWeight: 500,
                        },
                        children: [
                            {
                                type: "div",
                                props: {
                                    style: {
                                        width: "12px",
                                        height: "12px",
                                        borderRadius: "999px",
                                        background: "#a78bfa",
                                    },
                                },
                            },
                            "marcoberetta.com",
                        ],
                    },
                },
                {
                    type: "div",
                    props: {
                        style: {
                            fontSize: "104px",
                            fontWeight: 700,
                            lineHeight: 1,
                            letterSpacing: "-0.04em",
                            marginBottom: "24px",
                        },
                        children: "Marco Beretta",
                    },
                },
                {
                    type: "div",
                    props: {
                        style: {
                            fontSize: "40px",
                            color: "#cbd5e1",
                            fontWeight: 400,
                            lineHeight: 1.2,
                            maxWidth: "920px",
                        },
                        children: "Full-stack engineer · TypeScript, React, AI · Core contributor to LibreChat",
                    },
                },
                {
                    type: "div",
                    props: {
                        style: {
                            display: "flex",
                            marginTop: "auto",
                            paddingTop: "48px",
                            color: "#64748b",
                            fontSize: "22px",
                        },
                        children: "github.com/berry-13",
                    },
                },
            ],
        },
    },
    {
        width: 1200,
        height: 630,
        fonts: [
            { name: "Inter", data: interRegular, weight: 400, style: "normal" },
            { name: "Inter", data: interBold, weight: 700, style: "normal" },
        ],
    },
);

const png = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
await writeFile("client/public/og.png", png);
console.log("Generated client/public/og.png", `(${(png.length / 1024).toFixed(1)} KB)`);
