import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Protected routes configuration
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // Admin-only routes
    if (pathname.startsWith("/admin")) {
      if (!token || !["ADMIN", "MODERATOR"].includes(token.role as string)) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Theology debate 7-day restriction
    if (pathname.startsWith("/forum/new") && pathname.includes("theology")) {
      if (token) {
        const accountAge = Date.now() - new Date(token.createdAt as string).getTime();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        
        if (accountAge < sevenDays) {
          return NextResponse.redirect(new URL("/forum", req.url));
        }
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // Allow public access to these routes without authentication
        const publicPaths = ["/", "/auth/signin", "/auth/signup", "/statement-of-faith", "/community-guidelines", "/teaching", "/prayer", "/missionaries", "/forum"];
        
        if (publicPaths.some(path => req.nextUrl.pathname === path || req.nextUrl.pathname.startsWith(path + "/"))) {
          return true;
        }

        // Require auth for protected routes
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token !== null && ["ADMIN", "MODERATOR"].includes(token?.role as string);
        }

        return token !== null;
      },
    },
  }
);

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/posts/:path*",
    "/api/threads/:path*",
    "/api/prayers/:path*",
    "/api/missionaries/:path*",
    "/forum/new",
    "/prayer/new",
    "/teaching/new",
  ],
};
