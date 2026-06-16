interface RateLimitInfo {
    count: number;
    timestamp: number;
}

const MAX_TRACKED_IPS = 1_000;
const TRUST_PROXY = process.env.TRUSTED_PROXY === "true";

function normalizeIP(ip: string | null): string {
    if (!ip) return "unknown";

    const value = ip.trim();
    // Avoid unbounded attacker-controlled keys while keeping valid IPv4/IPv6 values.
    if (/^[0-9a-fA-F:.]{1,45}$/.test(value)) {
        return value;
    }

    return "unknown";
}

export class RateLimiter {
    private limits = new Map<string, RateLimitInfo>();

    constructor(
        private maxRequests: number,
        private windowMs: number,
    ) {}

    check(ip: string): boolean {
        const now = Date.now();
        this.cleanup(now);

        const key = normalizeIP(ip);

        if (!this.limits.has(key) && this.limits.size >= MAX_TRACKED_IPS) {
            return false;
        }

        const info = this.limits.get(key);
        if (!info) {
            this.limits.set(key, { count: 1, timestamp: now });
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
    if (TRUST_PROXY) {
        const forwarded = request.headers.get("x-forwarded-for");
        if (forwarded) return normalizeIP(forwarded.split(",")[0]);

        const cfIp = request.headers.get("cf-connecting-ip");
        if (cfIp) return normalizeIP(cfIp);

        const realIp = request.headers.get("x-real-ip");
        if (realIp) return normalizeIP(realIp);
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
