import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface RateLimitInfo {
    count: number;
    timestamp: number;
}

const rateLimits = new Map<string, RateLimitInfo>();
const globalRateLimit = { count: 0, timestamp: Date.now() };
const maxRequestsPerIP = 10;
const maxRequestsGlobal = 1000;
const windowSizeInSeconds = 15 * 60;
const globalWindowSizeInMilliseconds = 60 * 1000;

export default async function awake(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).json({ result: "Method Not Allowed" });

    const now = Date.now();

    if (now - globalRateLimit.timestamp < globalWindowSizeInMilliseconds) {
        if (globalRateLimit.count >= maxRequestsGlobal) {
            return res.status(429).json({ result: "Global rate limit exceeded" });
        }
        globalRateLimit.count += 1;
    } else {
        globalRateLimit.count = 1;
        globalRateLimit.timestamp = now;
    }

    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    rateLimits.forEach((value, key) => {
        if (now - value.timestamp > windowSizeInSeconds * 1000) {
            rateLimits.delete(key);
        }
    });

    const rateLimitInfo = rateLimits.get(ip as string);
    if (rateLimitInfo) {
        if (now - rateLimitInfo.timestamp < windowSizeInSeconds * 1000) {
            if (rateLimitInfo.count >= maxRequestsPerIP) {
                return res.status(429).json({ result: "Rate limit exceeded, please don't DDoS me :)" });
            }
            rateLimitInfo.count += 1;
        } else {
            rateLimitInfo.count = 1;
            rateLimitInfo.timestamp = now;
        }
    } else {
        rateLimits.set(ip as string, { count: 1, timestamp: now });
    }

    try {
        const config = {
            headers: {
                "Authorization": `Bearer ${process.env.AWAKE_TOKEN}`,
                "Content-Type": "application/json",
            },
        };

        const responseDoNotDisturb = await axios.get(
            `${process.env.AWAKE_BASE_URL}/api/states/${process.env.DEVICE}`,
            config
        );
        const responseAwake = await axios.get(
            `${process.env.AWAKE_BASE_URL}/api/states/${process.env.SENSOR_AWAKE}`,
            config
        );

        if (responseDoNotDisturb.data.err || responseAwake.data.err)
            return res.status(500).json({ result: "API_ERROR" });

        const isDoNotDisturb =
            responseDoNotDisturb.data.state === "undefined" ? "false" : responseDoNotDisturb.data.state !== "off";
        const isAwake = responseAwake.data.state === "True" ? true : false;

        console.log(isAwake);

        return res.status(200).json({ result: "Success", isDoNotDisturb, isAwake: isAwake });
    } catch (error) {
        return res.status(500).json({ result: "API_CALL_FAILED", error: error as any });
    }
}
