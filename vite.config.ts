import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    plugins: [react()],
    root: "client",
    resolve: {
        alias: {
            "~": path.resolve(__dirname, "./client/src"),
        },
    },
    build: {
        outDir: "../dist",
        emptyOutDir: true,
        target: "es2022",
        sourcemap: "hidden",
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes("/node_modules/")) return;
                    if (/\/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id))
                        return "react-vendor";
                    if (id.includes("/node_modules/framer-motion/") || id.includes("/node_modules/motion-"))
                        return "framer-motion";
                    if (id.includes("/node_modules/ogl/")) return "ogl";
                    if (id.includes("/node_modules/@tsparticles/")) return "tsparticles";
                    if (id.includes("/node_modules/@radix-ui/")) return "radix";
                },
            },
        },
    },
    server: {
        port: 3001,
        proxy: {
            "/api": {
                target: process.env.VITE_API_TARGET || "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
});
