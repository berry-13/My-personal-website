import { Elysia, t } from "elysia";
import { RateLimiter, getClientIP, fetchWithTimeout } from "../utils/rateLimit";
import { validateContactMessage } from "../utils/validation";

const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 requests per 15 minutes

export const sendRoute = new Elysia({ prefix: "/api" }).post(
    "/send",
    async ({ body, request, set }) => {
        if (!process.env.WEBHOOK_URL) {
            console.error("WEBHOOK_URL environment variable is not set");
            set.status = 500;
            return { result: "SERVER_CONFIGURATION_ERROR" };
        }

        const ip = getClientIP(request);

        if (!rateLimiter.check(ip)) {
            set.status = 429;
            return { result: "RATE_LIMIT_EXCEEDED" };
        }

        const allowedOrigin = process.env.ALLOWED_ORIGIN;
        if (allowedOrigin) {
            const origin = request.headers.get("origin");
            if (origin !== allowedOrigin) {
                set.status = 403;
                return { result: "FORBIDDEN_ORIGIN" };
            }
        }

        const { email, message } = body;

        const validation = validateContactMessage(email, message);
        if (!validation.isValid) {
            set.status = 400;
            return { result: validation.error! };
        }

        try {
            const response = await fetchWithTimeout(process.env.WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    allowed_mentions: {
                        parse: [],
                    },
                    embeds: [
                        {
                            color: 3108090,
                            title: email,
                            author: {
                                name: ip,
                            },
                            description: message,
                        },
                    ],
                }),
            });

            if (!response.ok) {
                console.error("Discord webhook returned non-OK status:", response.status);
                set.status = 500;
                return { result: "DISCORD_API_ERROR" };
            }

            return { result: "Success" };
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") {
                console.error("Discord webhook request timed out");
            } else {
                console.error("Discord webhook failed");
            }
            set.status = 500;
            return { result: "DISCORD_API_ERROR" };
        }
    },
    {
        body: t.Object({
            email: t.String({ minLength: 1, maxLength: 500 }),
            message: t.String({ minLength: 1, maxLength: 1000 }),
        }),
        response: t.Object({
            result: t.String(),
        }),
    }
);
