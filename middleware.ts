import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // ✅ Protected routes
  const protectedRoutes = ['/mybookings', '/photographers/dashboard', '/profile'];
  const { pathname } = request.nextUrl;
  
  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // Check for role in cookies or localStorage
    const role = request.cookies.get('role')?.value || null;
    
    // Agar koi role nahi hai to login page pe redirect
    if (!role) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/mybookings/:path*',
    '/photographers/:path*',
    '/profile/:path*',
  ],
}