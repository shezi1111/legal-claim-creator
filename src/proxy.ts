import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/auth/session";

/**
 * Auth proxy — protects private routes by checking for a valid session cookie.
 * Unauthenticated users are redirected to /login.
 *
 * Note: The `middleware` file convention is deprecated in this version of Next.js
 * and has been renamed to `proxy`. The exported function must be named `proxy`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes and API routes without authentication
  const publicPaths = ["/", "/login", "/register", "/forgot-password", "/terms", "/privacy"];
  const isPublicPath = publicPaths.includes(pathname);
  const isApiRoute = pathname.startsWith("/api/");
  const isStaticAsset =
    pathname.startsWith("/_next/") || pathname.includes(".");

  if (isPublicPath || isApiRoute || isStaticAsset) {
    return NextResponse.next();
  }

  // Check for valid session
  const session = getSessionFromRequest(request);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
