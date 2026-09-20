// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySessionToken } from './src/lib/server/sessionToken';

export async function middleware(request: NextRequest) {
  // 1. Baca cookie nexed_session_token (HttpOnly) dan verifikasi tanda tangan kriptografis HMAC-SHA256
  const sessionToken = request.cookies.get('nexed_session_token')?.value;
  const verifiedSession = await verifySessionToken(sessionToken);

  // Fallback untuk backward compatibility hanya jika token belum diset (misal transisi sesi)
  const legacyRoleCookie = request.cookies.get('nexed_session_role')?.value;
  const role = verifiedSession?.role || (verifiedSession ? (legacyRoleCookie as 'mahasiswa' | 'dosen' | 'admin' | undefined) : undefined);

  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Daftar kategori route resmi
  const isMahasiswaPath =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/modul');

  const isDosenPath =
    pathname.startsWith('/dosen-dashboard');

  const isAdminPath =
    pathname.startsWith('/admin-dashboard');

  const isSharedPrivatePath = pathname.startsWith('/profil');

  const isPrivateRoute = isMahasiswaPath || isDosenPath || isAdminPath || isSharedPrivatePath;

  // 2. Proteksi Akses: Jika belum login, redirect semua akses route privat ke /login
  if (isPrivateRoute && !role) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 3. Redirect user yang sudah login jika mengakses halaman auth (/login atau /register)
  if ((pathname === '/login' || pathname === '/register') && role) {
    if (role === 'dosen') {
      url.pathname = '/dosen-dashboard';
    } else if (role === 'admin') {
      url.pathname = '/admin-dashboard';
    } else {
      url.pathname = '/dashboard';
    }
    return NextResponse.redirect(url);
  }

  // 3b. Redirect root '/' ke dashboard peran aktif atau ke /login jika belum ada sesi
  if (pathname === '/') {
    if (role === 'dosen') {
      url.pathname = '/dosen-dashboard';
    } else if (role === 'admin') {
      url.pathname = '/admin-dashboard';
    } else if (role === 'mahasiswa') {
      url.pathname = '/dashboard';
    } else {
      url.pathname = '/login';
    }
    return NextResponse.redirect(url);
  }

  // 4. Role-Based Access Control (RBAC) Guard - Isolasi Ketat
  if (role === 'mahasiswa') {
    // Mahasiswa dilarang mengakses area Dosen atau Admin -> kembalikan ke /dashboard
    if (isDosenPath || isAdminPath) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  } else if (role === 'dosen') {
    // Dosen dilarang mengakses area Mahasiswa atau Admin -> kembalikan ke /dosen-dashboard
    if (isMahasiswaPath || isAdminPath) {
      url.pathname = '/dosen-dashboard';
      return NextResponse.redirect(url);
    }
  } else if (role === 'admin') {
    // Admin diarahkan ke dashboard admin jika mencoba mengakses rute mahasiswa atau dosen
    if (isMahasiswaPath || isDosenPath) {
      url.pathname = '/admin-dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/register',
    '/dashboard/:path*',
    '/modul/:path*',
    '/dosen-dashboard/:path*',
    '/admin-dashboard/:path*',
    '/profil/:path*',
  ],
};
