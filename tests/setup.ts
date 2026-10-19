// tests/setup.ts
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock next/navigation for client components rendered in jsdom
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Mock canvas if needed
if (typeof window !== "undefined") {
  window.HTMLCanvasElement.prototype.getContext = () => null;
}
