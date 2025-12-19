import { Elysia, t } from "elysia";
import { cors } from "@elysiajs/cors";
import { staticPlugin } from "@elysiajs/static";
import { reposRoute } from "./routes/repos";
import { sendRoute } from "./routes/send";
import { awakeRoute } from "./routes/awake";

const app = new Elysia()
    // CORS configuration
    .use(
        cors({
            origin: process.env.ALLOWED_ORIGIN || "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    )
    // Global middleware for security headers and rate limiting
    .onRequest(({ request, set }) => {
        // Add security headers
        set.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
        set.headers["X-Frame-Options"] = "DENY";
        set.headers["X-Content-Type-Options"] = "nosniff";
        set.headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        set.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";
        set.headers["X-XSS-Protection"] = "1; mode=block";
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
    // Serve static files from dist (built Vite app)
    .use(
        staticPlugin({
            assets: "dist",
            prefix: "/",
            indexHTML: true,
        })
    )
    .listen(process.env.PORT || 3000);

console.log(`Server running at http://localhost:${app.server?.port}`);

export type App = typeof app;
