import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface Data {
    email: string;
    message: string;
}

interface RateLimitInfo {
    count: number;
    timestamp: number;
}

const rateLimits = new Map<string, RateLimitInfo>();
const MAX_REQUESTS_PER_IP = 5;
const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes

function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email);
}

function isValidData(data: unknown): data is Data {
    return (
        typeof data === "object" &&
        data !== null &&
        "email" in data &&
        "message" in data &&
        typeof (data as Data).email === "string" &&
        typeof (data as Data).message === "string"
    );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Check HTTP method
    if (req.method !== "POST") {
        return res.status(405).json({ result: "METHOD_NOT_ALLOWED" });
    }

    // Validate webhook URL exists
    if (!process.env.WEBHOOK_URL) {
        console.error("WEBHOOK_URL environment variable is not set");
        return res.status(500).json({ result: "SERVER_CONFIGURATION_ERROR" });
    }

    // Rate limiting
    const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0] || req.socket.remoteAddress || "unknown";
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

    // Validate request body
    if (!isValidData(req.body)) {
        return res.status(400).json({ result: "INVALID_REQUEST_BODY" });
    }

    const data = req.body;

    if (data.email.length < 1 || data.message.length < 1) {
        return res.status(400).json({ result: "FIELD_EMPTY" });
    }
    if (data.message.length > 1000) {
        return res.status(400).json({ result: "MESSAGE_TOO_LONG" });
    }
    if (data.email.length > 500) {
        return res.status(400).json({ result: "EMAIL_TOO_LONG" });
    }
    if (!isValidEmail(data.email)) {
        return res.status(400).json({ result: "INVALID_EMAIL" });
    }

    try {
        const response = await axios.post(process.env.WEBHOOK_URL, {
            embeds: [
                {
                    color: 3108090,
                    title: data.email,
                    author: {
                        name: req.headers["x-forwarded-for"] ?? req.socket.remoteAddress ?? "unknown",
                    },
                    description: data.message,
                },
            ],
        });

        if (response.data.err) return res.status(500).json({ result: "DISCORD_API_ERROR" });
        return res.status(200).json({ result: "Success" });
    } catch (error) {
        return res.status(500).json({ result: "DISCORD_API_ERROR" });
    }
}
