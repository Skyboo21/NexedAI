import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Konfigurasi Teroptimasi Vite 2026 (Bab 8: Build Tools Modern & Rolldown/Rust Toolchain)
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "next/navigation": fileURLToPath(new URL("./src/utils/navigationShim.ts", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true,
  },
  build: {
    target: "esnext",
    outDir: "dist",
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom")) {
            return "vendor";
          }
        },
      },
    },
  },
});
