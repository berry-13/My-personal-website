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
    ) {}

    check(ip: string): boolean {
        const now = Date.now();
        if (++this.opCount >= CLEANUP_INTERVAL) {
            this.opCount = 0;
            this.cleanup(now);
        }

        const info = this.limits.get(ip);
        if (!info) {
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
}

/**
 * Extract client IP from the request.
 * Trusts proxy headers only when TRUSTED_PROXY=true (i.e. behind nginx/Cloudflare).
 * Falls back to the server-provided header or "unknown".
 */
export function getClientIP(request: Request): string {
    if (process.env.TRUSTED_PROXY === "true") {
        const forwarded = request.headers.get("x-forwarded-for");
        if (forwarded) return forwarded.split(",")[0].trim();
    }

    // Cloudflare
    const cfIp = request.headers.get("cf-connecting-ip");
    if (cfIp) return cfIp.trim();

    // nginx
    const realIp = request.headers.get("x-real-ip");
    if (realIp) return realIp.trim();

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
