import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const roleCookie = request.cookies.get('role');
  const role = roleCookie?.value;

  const url = request.nextUrl.clone();
  const path = url.pathname;

  // Protect Dashboard routes
  if (path.startsWith('/dosen') || path.startsWith('/mahasiswa') || path.startsWith('/profil')) {
    if (!role) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    // Simple role-based routing check
    if (path.startsWith('/dosen') && role !== 'dosen') {
      url.pathname = '/mahasiswa';
      return NextResponse.redirect(url);
    }
    
    if (path.startsWith('/mahasiswa') && role !== 'mahasiswa') {
      url.pathname = '/dosen';
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from login
  if (path === '/login' && role) {
    url.pathname = role === 'dosen' ? '/dosen' : '/mahasiswa';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dosen/:path*', '/mahasiswa/:path*', '/profil/:path*'],
};
