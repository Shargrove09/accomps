import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const { pathname } = request.nextUrl;

  // Skip authentication check for login page and public API routes
  if (
    pathname === "/login" ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/cron") ||
    pathname.startsWith("/api/resend") ||
    pathname.startsWith("/api/twilio") || // TODO: Not using Twilio currently
    pathname.startsWith("/api/webhooks")
  ) {
    return NextResponse.next();
  }

  // Check for authentication cookie
  const authCookie = request.cookies.get("auth-session");

  // If no auth cookie or invalid value, redirect to login
  if (
    !authCookie?.value ||
    authCookie.value !== process.env.AUTH_SESSION_SECRET
  ) {
    const loginUrl = new URL("/login", request.url);
    // Add the attempted URL as a query param to redirect back after login
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, allow the request
  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  // Protect all routes except:
  // - /api/auth/* (auth endpoints)
  // - /login (login page)
  // - /_next/* (Next.js internals)
  // - /favicon.ico and other static files
  matcher: ["/((?!api/auth|login|_next/static|_next/image|favicon.ico).*)"],
};
