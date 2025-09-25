import { NextRequest, NextResponse } from "next/server";
import { REFRESH_TOKEN_COOKIE_NAME } from "@/constants/authConstants";
import { ROUTES } from "@/constants/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  const isAuthenticated = !!refreshToken;

  // Skip middleware for API routes - they should not have CSP restrictions
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Public routes that don't need authentication - check this first
  const publicRoutes = [
    ROUTES.PUBLIC.FEATURES,
    ROUTES.PUBLIC.PRICING,
    ROUTES.PUBLIC.PRODUCT,
    ROUTES.PUBLIC.TERMS,
    ROUTES.PUBLIC.PRIVACY,
    ROUTES.PUBLIC.HOME,
  ] as const;
  if (publicRoutes.includes(pathname as any)) {
    // Allow access to public routes regardless of authentication status
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (pathname.startsWith("/app")) {
    // debugger;
    if (!isAuthenticated) {
      const loginUrl = new URL(ROUTES.AUTH.LOGIN, request.url);
      loginUrl.searchParams.set("redirect", pathname);
      console.log("Middleware redirect - pathname:", pathname);
      console.log("Middleware redirect - loginUrl:", loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }
  }

  // Auth routes - redirect authenticated users away
  if (pathname.startsWith("/auth")) {
    if (isAuthenticated) {
      // Redirect to dashboard if user is already logged in
      return NextResponse.redirect(new URL(ROUTES.APP.DASHBOARD, request.url));
    }
  }

  // Create response with security headers
  const response = NextResponse.next();

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set("X-DNS-Prefetch-Control", "off");

  // Add CSP header for additional security
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' http: https: ws: wss:;"
  );

  return response;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     * - _vercel (Vercel internal routes)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|_vercel|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
