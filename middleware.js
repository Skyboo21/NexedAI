// @ts-nocheck
// middleware.ts - Server-Side Access Control & Route Guard (Next.js App Router)
export function middleware(request) {
    // Simulasi pemeriksaan cookie token autentikasi mahasiswa
    const authToken = request?.cookies?.get?.("uns_session")?.value || "mock_valid_token";
    const url = request?.url || "";
    // Jika rute yang diakses adalah rute privat dashboard dan token tidak ada:
    if (url.includes("/dashboard") && !authToken) {
        console.warn("Middleware Access Control: Token tidak ditemukan. Mengalihkan ke halaman login.");
        // Redirect otomatis ke halaman login
        return {
            status: 307,
            redirectUrl: "/login?auth_error=1"
        };
    }
    // Jika valid, izinkan request melanjutkan ke rute komponen
    return { status: 200, pass: true };
}
export const config = {
    matcher: ["/dashboard/:path*"],
};
