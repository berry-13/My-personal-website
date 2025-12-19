import { Elysia, t } from "elysia";

interface RateLimitInfo {
    count: number;
    timestamp: number;
}

const rateLimits = new Map<string, RateLimitInfo>();
const globalRateLimit = { count: 0, timestamp: Date.now() };
const MAX_REQUESTS_PER_IP = 10;
const MAX_REQUESTS_GLOBAL = 1000;
const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes
const GLOBAL_WINDOW_SIZE_MS = 60 * 1000; // 1 minute

function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    return forwarded?.split(",")[0] || "unknown";
}

function checkGlobalRateLimit(): boolean {
    const now = Date.now();
    if (now - globalRateLimit.timestamp < GLOBAL_WINDOW_SIZE_MS) {
        if (globalRateLimit.count >= MAX_REQUESTS_GLOBAL) {
            return false;
        }
        globalRateLimit.count += 1;
    } else {
        globalRateLimit.count = 1;
        globalRateLimit.timestamp = now;
    }
    return true;
}

function checkIPRateLimit(ip: string): boolean {
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

export const awakeRoute = new Elysia({ prefix: "/api" }).get(
    "/awake",
    async ({ request, set }) => {
        // Validate required environment variables
        const { AWAKE_BASE_URL, AWAKE_TOKEN, DEVICE, SENSOR_AWAKE } = process.env;
        if (!AWAKE_BASE_URL || !AWAKE_TOKEN || !DEVICE || !SENSOR_AWAKE) {
            console.error("Missing required environment variables for awake API");
            set.status = 500;
            return { result: "SERVER_CONFIGURATION_ERROR" };
        }

        // Global rate limiting
        if (!checkGlobalRateLimit()) {
            set.status = 429;
            return { result: "GLOBAL_RATE_LIMIT_EXCEEDED" };
        }

        // Per-IP rate limiting
        const ip = getClientIP(request);
        if (!checkIPRateLimit(ip)) {
            set.status = 429;
            return { result: "RATE_LIMIT_EXCEEDED" };
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${AWAKE_TOKEN}`,
                    "Content-Type": "application/json",
                },
            };

            const [responseDoNotDisturb, responseAwake] = await Promise.all([
                fetch(`${AWAKE_BASE_URL}/api/states/${DEVICE}`, config),
                fetch(`${AWAKE_BASE_URL}/api/states/${SENSOR_AWAKE}`, config),
            ]);

            if (!responseDoNotDisturb.ok || !responseAwake.ok) {
                set.status = 500;
                return { result: "API_ERROR" };
            }

            const [dndData, awakeData] = await Promise.all([
                responseDoNotDisturb.json() as Promise<{ state: string; err?: boolean }>,
                responseAwake.json() as Promise<{ state: string; err?: boolean }>,
            ]);

            if (dndData.err || awakeData.err) {
                set.status = 500;
                return { result: "API_ERROR" };
            }

            const isDoNotDisturb = dndData.state !== "off" && dndData.state !== "undefined";
            const isAwake = awakeData.state === "True";

            return { result: "Success", isDoNotDisturb, isAwake };
        } catch (error) {
            console.error("API call failed:", error);
            set.status = 500;
            return { result: "API_CALL_FAILED" };
        }
    },
    {
        response: t.Object({
            result: t.String(),
            isDoNotDisturb: t.Optional(t.Boolean()),
            isAwake: t.Optional(t.Boolean()),
        }),
    }
);
