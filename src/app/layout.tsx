import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Quiz Platform',
  description: 'Multi-language quiz platform with AI-powered results',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
