import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface RateLimitInfo {
    count: number;
    timestamp: number;
}

interface AwakeResponse {
    result: string;
    isDoNotDisturb?: boolean;
    isAwake?: boolean;
}

const rateLimits = new Map<string, RateLimitInfo>();
const globalRateLimit = { count: 0, timestamp: Date.now() };
const MAX_REQUESTS_PER_IP = 10;
const MAX_REQUESTS_GLOBAL = 1000;
const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes
const GLOBAL_WINDOW_SIZE_MS = 60 * 1000; // 1 minute

export default async function awake(req: NextApiRequest, res: NextApiResponse<AwakeResponse>) {
    if (req.method !== "GET") {
        return res.status(405).json({ result: "METHOD_NOT_ALLOWED" });
    }

    // Validate required environment variables
    const { AWAKE_BASE_URL, AWAKE_TOKEN, DEVICE, SENSOR_AWAKE } = process.env;
    if (!AWAKE_BASE_URL || !AWAKE_TOKEN || !DEVICE || !SENSOR_AWAKE) {
        console.error("Missing required environment variables for awake API");
        return res.status(500).json({ result: "SERVER_CONFIGURATION_ERROR" });
    }

    const now = Date.now();

    // Global rate limiting
    if (now - globalRateLimit.timestamp < GLOBAL_WINDOW_SIZE_MS) {
        if (globalRateLimit.count >= MAX_REQUESTS_GLOBAL) {
            return res.status(429).json({ result: "GLOBAL_RATE_LIMIT_EXCEEDED" });
        }
        globalRateLimit.count += 1;
    } else {
        globalRateLimit.count = 1;
        globalRateLimit.timestamp = now;
    }

    // Per-IP rate limiting
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";

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
                return res.status(429).json({ result: "RATE_LIMIT_EXCEEDED" });
            }
            rateLimitInfo.count += 1;
        } else {
            rateLimitInfo.count = 1;
            rateLimitInfo.timestamp = now;
        }
    } else {
        rateLimits.set(ip, { count: 1, timestamp: now });
    }

    try {
        const config = {
            headers: {
                "Authorization": `Bearer ${AWAKE_TOKEN}`,
                "Content-Type": "application/json",
            },
        };

        const [responseDoNotDisturb, responseAwake] = await Promise.all([
            axios.get(`${AWAKE_BASE_URL}/api/states/${DEVICE}`, config),
            axios.get(`${AWAKE_BASE_URL}/api/states/${SENSOR_AWAKE}`, config),
        ]);

        if (responseDoNotDisturb.data.err || responseAwake.data.err) {
            return res.status(500).json({ result: "API_ERROR" });
        }

        const isDoNotDisturb = responseDoNotDisturb.data.state !== "off" &&
                               responseDoNotDisturb.data.state !== "undefined";
        const isAwake = responseAwake.data.state === "True";

        return res.status(200).json({ result: "Success", isDoNotDisturb, isAwake });
    } catch (error) {
        console.error("API call failed:", error);
        return res.status(500).json({ result: "API_CALL_FAILED" });
    }
}
