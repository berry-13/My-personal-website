interface RateLimitInfo {
    count: number;
    timestamp: number;
}

const CLEANUP_INTERVAL = 256;

/**
 * In-memory token-bucket rate limiter, keyed by an arbitrary string (typically
 * a client IP). NOT distributed-safe: each replica has its own bucket, so
 * scaling horizontally requires moving to Redis or a CDN-level limiter.
 */
export class RateLimiter {
    private limits = new Map<string, RateLimitInfo>();
    private opCount = 0;

    constructor(
        private maxRequests: number,
        private windowMs: number,
        private maxEntries: number = 10_000,
    ) {}

    check(ip: string): boolean {
        const now = Date.now();
        if (++this.opCount >= CLEANUP_INTERVAL) {
            this.opCount = 0;
            this.cleanup(now);
        }

        const info = this.limits.get(ip);
        if (!info) {
            if (this.limits.size >= this.maxEntries) {
                this.evictOldestEntry();
            }
            this.limits.set(ip, { count: 1, timestamp: now });
            return true;
        }

        if (now - info.timestamp > this.windowMs) {
            info.count = 1;
            info.timestamp = now;
            return true;
        }

        if (info.count >= this.maxRequests) {
            return false;
        }

        info.count += 1;
        return true;
    }

    private cleanup(now: number) {
        for (const [key, val] of this.limits) {
            if (now - val.timestamp > this.windowMs) {
                this.limits.delete(key);
            }
        }
    }

    private evictOldestEntry() {
        let oldestKey: string | null = null;
        let oldestTimestamp = Infinity;

        for (const [key, value] of this.limits) {
            if (value.timestamp < oldestTimestamp) {
                oldestTimestamp = value.timestamp;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.limits.delete(oldestKey);
        }
    }
}

/**
 * Extract client IP from the request.
 * Trusts proxy headers only when TRUSTED_PROXY=true (i.e. behind nginx/Cloudflare).
 * Falls back to the server-provided header or "unknown".
 */
export function getClientIP(request: Request): string {
    const parseIp = (value: string | null): string | null => {
        if (!value) return null;

        const candidate = value.split(",")[0].trim();
        if (!candidate || candidate.length > 64) return null;

        return /^[0-9a-fA-F:.]+$/.test(candidate) ? candidate : null;
    };

    if (process.env.TRUSTED_PROXY === "true") {
        const forwardedIp = parseIp(request.headers.get("x-forwarded-for"));
        if (forwardedIp) return forwardedIp;

        const cfIp = parseIp(request.headers.get("cf-connecting-ip"));
        if (cfIp) return cfIp;

        const realIp = parseIp(request.headers.get("x-real-ip"));
        if (realIp) return realIp;
    }

    return "unknown";
}

const FETCH_TIMEOUT_MS = 10_000;

/**
 * Wrapper around fetch that enforces a timeout via AbortController.
 */
export async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = FETCH_TIMEOUT_MS,
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timeoutId);
    }
}
