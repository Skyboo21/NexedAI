// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Baca cookie session role (uns_session_role dengan fallback ke role)
  const sessionRoleCookie = request.cookies.get('uns_session_role') || request.cookies.get('role');
  const role = sessionRoleCookie?.value as 'mahasiswa' | 'dosen' | 'admin' | undefined;

  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Daftar kategori route
  const isMahasiswaPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/mahasiswa') ||
    pathname.startsWith('/belajar');

  const isDosenPath =
    pathname.startsWith('/dosen-dashboard') ||
    pathname.startsWith('/dosen');

  const isAdminPath =
    pathname.startsWith('/admin-dashboard') ||
    pathname.startsWith('/admin');

  const isSharedPrivatePath = pathname.startsWith('/profil');

  const isPrivateRoute = isMahasiswaPath || isDosenPath || isAdminPath || isSharedPrivatePath;

  // 2. Proteksi Akses: Jika belum login, redirect semua akses route privat ke /login
  if (isPrivateRoute && !role) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 3. Redirect user yang sudah login jika mengakses halaman login
  if (pathname === '/login' && role) {
    if (role === 'dosen') {
      url.pathname = '/dosen-dashboard';
    } else if (role === 'admin') {
      url.pathname = '/admin-dashboard';
    } else {
      url.pathname = '/dashboard';
    }
    return NextResponse.redirect(url);
  }

  // 4. Role-Based Access Control (RBAC) Guard
  if (role === 'mahasiswa') {
    // Mahasiswa dilarang mengakses path dosen atau admin -> kembalikan ke /dashboard
    if (isDosenPath || isAdminPath) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  } else if (role === 'dosen') {
    // Dosen dilarang mengakses path mahasiswa atau admin -> kembalikan ke /dosen-dashboard
    if (isMahasiswaPath || isAdminPath) {
      url.pathname = '/dosen-dashboard';
      return NextResponse.redirect(url);
    }
  } else if (role === 'admin') {
    // Admin memiliki hak akses khusus sistem admin
    if (isMahasiswaPath) {
      url.pathname = '/admin-dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/mahasiswa/:path*',
    '/dosen-dashboard/:path*',
    '/dosen/:path*',
    '/admin-dashboard/:path*',
    '/admin/:path*',
    '/belajar/:path*',
    '/profil/:path*',
  ],
};
