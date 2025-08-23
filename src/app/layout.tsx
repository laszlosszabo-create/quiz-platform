import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools - Szabó Suti László',
  description: 'Ingyenes online eszközök és tesztek tudományos megalapozottsággal. ADHD gyorsteszt, személyiség felmérések és egyéb hasznos tools.',
  keywords: 'ADHD teszt, online felmérés, pszichológiai teszt, személyiség teszt, ingyenes tools',
  authors: [{ name: 'Szabó Suti László' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Tools - Szabó Suti László',
    description: 'Ingyenes online eszközök és tesztek tudományos megalapozottsággal.',
    type: 'website',
  url: 'https://tools.szabosutilaszlo.com/',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
