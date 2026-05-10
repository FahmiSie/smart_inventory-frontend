import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth data in cookies (we'll use a simple approach)
  // Since we use localStorage (client-side), middleware can't directly check it.
  // We'll handle route protection primarily on the client side.
  // This middleware handles basic redirects.

  // If accessing root, redirect to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/products/:path*', '/categories/:path*', '/inventory/:path*'],
};
