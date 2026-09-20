// tests/setup.ts
import "@testing-library/jest-dom/vitest";

// Mock canvas if needed
if (typeof window !== "undefined") {
  window.HTMLCanvasElement.prototype.getContext = () => null;
}
