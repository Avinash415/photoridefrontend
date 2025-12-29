import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("role")?.value;
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

   // 🔐 Booking requires login
  if (pathname.startsWith("/booking")) {
    if (!role) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Protect authenticated routes
  if (
    pathname.startsWith("/customer") ||
    pathname.startsWith("/photographer") ||
    pathname.startsWith("/admin")
  ) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/photographer/:path*", "/admin/:path*"],
};
