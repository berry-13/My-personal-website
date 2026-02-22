import { Elysia, t } from "elysia";
import { RateLimiter, getClientIP, fetchWithTimeout } from "../utils/rateLimit";

const ipRateLimiter = new RateLimiter(10, 15 * 60 * 1000); // 10 requests per 15 minutes
const globalRateLimiter = new RateLimiter(1000, 60 * 1000); // 1000 requests per 1 minute (global key)

const GLOBAL_KEY = "__global__";

export const awakeRoute = new Elysia({ prefix: "/api" }).get(
    "/awake",
    async ({ request, set }) => {
        const { AWAKE_BASE_URL, AWAKE_TOKEN, DEVICE, SENSOR_AWAKE } = process.env;
        if (!AWAKE_BASE_URL || !AWAKE_TOKEN || !DEVICE || !SENSOR_AWAKE) {
            console.error("Missing required environment variables for awake API");
            set.status = 500;
            return { result: "SERVER_CONFIGURATION_ERROR" };
        }

        if (!globalRateLimiter.check(GLOBAL_KEY)) {
            set.status = 429;
            return { result: "GLOBAL_RATE_LIMIT_EXCEEDED" };
        }

        const ip = getClientIP(request);
        if (!ipRateLimiter.check(ip)) {
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
                fetchWithTimeout(`${AWAKE_BASE_URL}/api/states/${DEVICE}`, config),
                fetchWithTimeout(`${AWAKE_BASE_URL}/api/states/${SENSOR_AWAKE}`, config),
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
            if (error instanceof DOMException && error.name === "AbortError") {
                console.error("Awake API request timed out");
            } else {
                console.error("Awake API call failed:", error);
            }
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
