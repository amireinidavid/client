import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const publicRoutes = ["/auth/register", "/auth/login"];
const superAdminRoutes = ["/super-admin", "/super-admin/:path*"];
const userRoutes = ["/"];

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Allow public routes without authentication
  if (publicRoutes.includes(pathname)) {
    if (!accessToken) {
      return NextResponse.next();
    }
  }

  if (accessToken) {
    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      const { role } = payload as { role: string };

      // If user is on public routes (login/register), redirect to appropriate dashboard
      if (publicRoutes.includes(pathname)) {
        return NextResponse.redirect(
          new URL(role === "SUPER_ADMIN" ? "/super-admin" : "/", request.url)
        );
      }

      // Handle role-based access
      if (role === "SUPER_ADMIN") {
        // Allow super admin to access their routes
        if (superAdminRoutes.some((route) => pathname.startsWith(route))) {
          return NextResponse.next();
        }
        // Redirect super admin away from user routes
        return NextResponse.redirect(new URL("/super-admin", request.url));
      } else {
        // Regular user
        if (superAdminRoutes.some((route) => pathname.startsWith(route))) {
          return NextResponse.redirect(new URL("/", request.url));
        }
        return NextResponse.next();
      }
    } catch (e) {
      console.error("Token verification failed", e);
      const refreshResponse = await fetch(
        "http://localhost:5000/api/auth/refresh-token",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        if (data.success) {
          const response = NextResponse.next();
          const cookies = refreshResponse.headers.get("set-cookie");
          if (cookies) {
            response.headers.set("set-cookie", cookies);
          }
          return response;
        }
      }

      // Refresh token failed - clear cookies and redirect to login
      const response = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      response.cookies.delete("accessToken");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  // No access token and not on public route - redirect to login
  if (!publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
