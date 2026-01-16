import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ... rest of your code remains the same

export function middleware(request: NextRequest) {
  // ✅ Protected routes
  const protectedRoutes = ['/mybookings', '/photographers/dashboard', '/profile'];
  const { pathname } = request.nextUrl;
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    const role = request.cookies.get('role')?.value || null;
    
    if (!role) {
      const loginUrl = new URL('/login', request.url);  // ← note: request.url (not Request.url)
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