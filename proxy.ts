import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/auth/login": { max: 10, windowMs: 15 * 60 * 1000 },
  "/api/auth/register": { max: 5, windowMs: 60 * 60 * 1000 },
  "/api/admin/": { max: 100, windowMs: 60 * 1000 },
  "/api/checkout": { max: 20, windowMs: 60 * 1000 },
  default: { max: 200, windowMs: 60 * 1000 },
};

function getRateLimit(pathname: string) {
  for (const [prefix, limit] of Object.entries(RATE_LIMITS)) {
    if (prefix !== "default" && pathname.startsWith(prefix)) {
      return limit;
    }
  }
  return RATE_LIMITS.default;
}

function checkRateLimit(ip: string, pathname: string): boolean {
  const key = `${ip}:${pathname}`;
  const limit = getRateLimit(pathname);
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + limit.windowMs });
    return true;
  }

  if (record.count >= limit.max) return false;
  record.count++;
  return true;
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "kirukard-secret-change-in-production"
);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (pathname.startsWith("/api/")) {
    if (!checkRateLimit(ip, pathname)) {
      return NextResponse.json(
        { error: "Demasiadas peticiones. Intenta más tarde." },
        { status: 429 }
      );
    }
  }

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const session = request.cookies.get("session")?.value;
    if (!session) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "No autorizado." }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await jwtVerify(session, JWT_SECRET);
    } catch {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Sesión inválida." }, { status: 401 });
      }
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
