import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { reposRoute } from "./routes/repos";
import { sendRoute } from "./routes/send";
import { awakeRoute } from "./routes/awake";

// Fail fast if critical env vars are missing
const requiredEnvVars = ["WEBHOOK_URL", "GITHUB_TOKEN"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}

const indexHtml = await Bun.file("dist/index.html").text();

const app = new Elysia()
    // CORS configuration
    .use(
        cors({
            origin: process.env.ALLOWED_ORIGIN || false,
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    )
    // Global middleware for security headers and rate limiting
    .onRequest(({ set }) => {
        // Add security headers
        set.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
        set.headers["X-Frame-Options"] = "DENY";
        set.headers["X-Content-Type-Options"] = "nosniff";
        set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        set.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
        set.headers["X-XSS-Protection"] = "1; mode=block";
        set.headers["Content-Security-Policy"] =
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.github.com; frame-ancestors 'none'";
        set.headers["X-Request-ID"] = crypto.randomUUID();
    })
    // API routes
    .use(reposRoute)
    .use(sendRoute)
    .use(awakeRoute)
    // Redirects
    .get("/github", ({ redirect }) => redirect("https://github.com/berry-13", 301))
    .get("/x", ({ redirect }) => redirect("https://x.com/Berry13000", 301))
    .get("/linkedin", ({ redirect }) => redirect("https://linkedin.com/in/marco-beretta-berry/", 301))
    // Serve static assets from dist (CSS, JS, images)
    .use(
        await staticPlugin({
            assets: "dist",
            prefix: "/",
            indexHTML: false,
            ignorePatterns: ["*.html"],
        })
    )
    // SPA fallback - serve index.html for all non-API routes
    .get("*", ({ set }) => {
        set.headers["Content-Type"] = "text/html; charset=utf-8";
        return indexHtml;
    })
    .listen(process.env.PORT || 3000);

console.log(`Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
