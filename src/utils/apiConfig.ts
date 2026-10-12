// src/utils/apiConfig.ts

/**
 * Menentukan base URL API secara cerdas dan adaptif.
 * Di lingkungan browser produksi (seperti Vercel, domain publik non-localhost),
 * jika NEXT_PUBLIC_API_URL tidak diisi atau masih mengarah ke localhost/127.0.0.1,
 * kita gunakan relative path ("") agar panggilan langsung mengarah ke internal Next.js API routes
 * TANPA delay socket timeout 15-30 detik menghubung ke localhost:8000.
 */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

    if (!isLocalhost) {
      // Jika di production (Vercel) dan NEXT_PUBLIC_API_URL belum diset ke URL backend publik nyata:
      if (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1")) {
        return "";
      }
    }
  }

  return envUrl || "http://localhost:8000";
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

  // Jika baseUrl kosong (Vercel production tanpa external backend), langsung panggil Next.js internal route dengan zero delay
  if (!baseUrl) {
    return fetch(cleanEndpoint, init);
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
    return res;
  } catch {
    clearTimeout(timer);
    // Hanya fallback ke Next.js internal route jika terjadi network failure (offline, timeout, refused)
    return fetch(cleanEndpoint, init);
  }
}
