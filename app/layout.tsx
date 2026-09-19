import type React from "react";
import "../src/index.css";
import Providers from "./Providers";

export const metadata = {
  title: "NEXED AI - Learning Platform",
  description: "AI-Powered Learning Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
