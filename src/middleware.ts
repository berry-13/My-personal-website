import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimit = new Map<string, { count: number; lastReset: number }>();

export async function middleware(request: NextRequest) {
    const startTime = Date.now();
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("remote-addr") || "anonymous";

    const rateLimitData = rateLimit.get(ip) || { count: 0, lastReset: Date.now() };
    if (Date.now() - rateLimitData.lastReset > 60000) {
        rateLimitData.count = 0;
        rateLimitData.lastReset = Date.now();
    }
    rateLimitData.count++;
    rateLimit.set(ip, rateLimitData);

    if (rateLimitData.count > 100) {
        return new NextResponse("Too Many Requests", { status: 429 });
    }

    const userAgent = request.headers.get("user-agent");
    if (!userAgent) {
        return new NextResponse("Invalid Request", { status: 400 });
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-request-id", crypto.randomUUID());
    requestHeaders.set("x-request-time", startTime.toString());

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.headers.set("X-XSS-Protection", "1; mode=block");

    response.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    const endTime = Date.now();
    response.headers.set("X-Response-Time", `${endTime - startTime}ms`);

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|favicon.ico).*)"],
};
