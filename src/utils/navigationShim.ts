// src/utils/navigationShim.ts
// Universal navigation shim enabling Next.js page components to run smoothly under Vite

export function useRouter() {
  return {
    push: (url: string) => {
      if (typeof window !== "undefined") {
        window.location.hash = url;
      }
    },
    replace: (url: string) => {
      if (typeof window !== "undefined") {
        window.location.replace(url);
      }
    },
    back: () => {
      if (typeof window !== "undefined") {
        window.history.back();
      }
    },
  };
}

export function useSearchParams() {
  if (typeof window === "undefined") {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}
