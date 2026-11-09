// src/utils/apiConfig.ts

/**
 * Menentukan base URL API secara cerdas dan adaptif.
 * Di lingkungan browser produksi (seperti Vercel, domain publik non-localhost),
 * jika NEXT_PUBLIC_API_URL tidak diisi atau masih mengarah ke localhost/127.0.0.1,
 * kita gunakan relative path ("") agar panggilan langsung mengarah ke internal Next.js API routes
 * TANPA delay socket timeout 15-30 detik menghubung ke localhost:8000.
 */
export function getApiBaseUrl(): string {
  const envUrl = (
    process.env.NEXT_PUBLIC_FASTAPI_URL ||
    process.env.NEXT_PUBLIC_API_URL
  )?.trim();

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    if (!isLocalhost) {
      // Jika di production (Vercel) dan URL masih mengarah ke localhost/127.0.0.1:
      if (envUrl && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
        return "https://nexed-backend.vercel.app";
      }
    }
  }

  return (envUrl || "https://nexed-backend.vercel.app").replace(/\/+$/, "");
}

/**
 * Fetcher cerdas dengan timeout pendek untuk backend eksternal,
 * langsung fallback ke internal Next.js route jika backend tidak merespons,
 * mencegah UI menunggu browser socket timeout 30 detik di Vercel.
 */
export async function smartApiFetch(
  endpoint: string,
  init?: RequestInit,
  timeoutMs = 2500,
): Promise<Response> {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Endpoint internal BFF Next.js (/api/auth/*) selalu dipanggil langsung ke Next.js server
  // agar cookie HttpOnly (nexed_session_token) dan database Prisma Next.js bekerja dengan benar
  if (!baseUrl || cleanEndpoint.startsWith("/api/auth/")) {
    return fetch(cleanEndpoint, { ...init, credentials: "include" });
  }

  const primaryUrl = `${baseUrl}${cleanEndpoint}`;

  // Jika di localhost atau ada backend URL eksternal, gunakan AbortController timeout pendek
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(primaryUrl, {
      ...init,
      signal: controller.signal,
    });
    clearTimeout(timer);
    // Jika backend eksternal belum memiliki endpoint tersebut (404), otomatis fallback ke Next.js internal API route
    if (res.status === 404) {
      return fetch(cleanEndpoint, init);
    }
    return res;
  } catch {
    clearTimeout(timer);
    // Fallback ke Next.js internal route jika terjadi network failure (offline, timeout, refused)
    return fetch(cleanEndpoint, init);
  }
}
