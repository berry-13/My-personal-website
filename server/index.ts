import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { resolve, sep } from "node:path";
import { reposRoute } from "./routes/repos";
import { sendRoute } from "./routes/send";
import { awakeRoute } from "./routes/awake";
import { contributionsRoute } from "./routes/contributions";
import { changelogRoute } from "./routes/changelog";

// Fail fast if critical env vars are missing
const requiredEnvVars = ["WEBHOOK_URL", "GITHUB_TOKEN"];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
}

const DIST_DIR = resolve("dist");

let cachedIndexHtml: string | null = null;
const getIndexHtml = async (): Promise<string> => {
    if (cachedIndexHtml === null) {
        cachedIndexHtml = await Bun.file(resolve(DIST_DIR, "index.html")).text();
    }
    return cachedIndexHtml;
};

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
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://api.github.com; frame-ancestors 'none'";
        set.headers["X-Request-ID"] = crypto.randomUUID();
    })
    // API routes
    .use(reposRoute)
    .use(sendRoute)
    .use(awakeRoute)
    .use(contributionsRoute)
    .use(changelogRoute)
    // Redirects
    .get("/github", ({ redirect }) => redirect("https://github.com/berry-13", 301))
    .get("/x", ({ redirect }) => redirect("https://x.com/Berry13000", 301))
    .get("/linkedin", ({ redirect }) => redirect("https://linkedin.com/in/marco-beretta-berry/", 301))
    // Static assets from dist, with an SPA fallback to index.html for client-side routes
    .get("/*", async ({ params, set }) => {
        const relativePath = params["*"] ?? "";
        const filePath = resolve(DIST_DIR, relativePath);

        if (relativePath && filePath.startsWith(DIST_DIR + sep) && !filePath.endsWith(".html")) {
            const file = Bun.file(filePath);
            if (await file.exists()) {
                // Hashed build assets never change; everything else must be revalidated so a deploy is seen at once
                set.headers["Cache-Control"] = relativePath.startsWith("assets/")
                    ? "public, max-age=31536000, immutable"
                    : "public, no-cache";
                return file;
            }
        }

        if (relativePath.startsWith("api/") || relativePath.startsWith("assets/")) {
            set.status = 404;
            return "Not found";
        }

        set.headers["Content-Type"] = "text/html; charset=utf-8";
        return await getIndexHtml();
    })
    .listen(process.env.PORT || 3000);

console.log(`Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
