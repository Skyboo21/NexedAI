import React from 'react';
import '../src/index.css';
import Providers from './Providers';

export const metadata = {
  title: 'NEXED AI - Learning Platform',
  description: 'AI-Powered Learning Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
