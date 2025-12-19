import { Elysia, t } from "elysia";

interface RateLimitInfo {
    count: number;
    timestamp: number;
}

const rateLimits = new Map<string, RateLimitInfo>();
const MAX_REQUESTS_PER_IP = 5;
const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes

function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    return forwarded?.split(",")[0] || "unknown";
}

function checkRateLimit(ip: string): boolean {
    const now = Date.now();

    // Clean up old entries
    rateLimits.forEach((value, key) => {
        if (now - value.timestamp > WINDOW_SIZE_MS) {
            rateLimits.delete(key);
        }
    });

    const rateLimitInfo = rateLimits.get(ip);
    if (rateLimitInfo) {
        if (now - rateLimitInfo.timestamp < WINDOW_SIZE_MS) {
            if (rateLimitInfo.count >= MAX_REQUESTS_PER_IP) {
                return false;
            }
            rateLimitInfo.count += 1;
        } else {
            rateLimitInfo.count = 1;
            rateLimitInfo.timestamp = now;
        }
    } else {
        rateLimits.set(ip, { count: 1, timestamp: now });
    }
    return true;
}

function isValidEmail(email: string): boolean {
    const emailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email);
}

export const sendRoute = new Elysia({ prefix: "/api" }).post(
    "/send",
    async ({ body, request, set }) => {
        // Validate webhook URL exists
        if (!process.env.WEBHOOK_URL) {
            console.error("WEBHOOK_URL environment variable is not set");
            set.status = 500;
            return { result: "SERVER_CONFIGURATION_ERROR" };
        }

        const ip = getClientIP(request);

        // Rate limiting
        if (!checkRateLimit(ip)) {
            set.status = 429;
            return { result: "RATE_LIMIT_EXCEEDED" };
        }

        const { email, message } = body;

        // Validation
        if (email.length < 1 || message.length < 1) {
            set.status = 400;
            return { result: "FIELD_EMPTY" };
        }
        if (message.length > 1000) {
            set.status = 400;
            return { result: "MESSAGE_TOO_LONG" };
        }
        if (!isValidEmail(email)) {
            set.status = 400;
            return { result: "INVALID_EMAIL" };
        }
        if (email.length > 500) {
            set.status = 400;
            return { result: "EMAIL_TOO_LONG" };
        }

        try {
            const response = await fetch(process.env.WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
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
                set.status = 500;
                return { result: "DISCORD_API_ERROR" };
            }

            return { result: "Success" };
        } catch (error) {
            console.error("Discord webhook error:", error);
            set.status = 500;
            return { result: "DISCORD_API_ERROR" };
        }
    },
    {
        body: t.Object({
            email: t.String(),
            message: t.String(),
        }),
        response: t.Object({
            result: t.String(),
        }),
    }
);
