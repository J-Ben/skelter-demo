import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  metadataBase: new URL('https://demo.skelter.dev'),
  title: 'skelter demo · zero skeleton loaders',
  description: 'Live demo of react-zero-skeleton: 7 real API cards, 4 animations, zero skeletons written by hand. Edit the source live in the browser.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'skelter demo · zero skeleton loaders',
    description: 'Live demo of react-zero-skeleton: 7 real API cards, 4 animations, zero skeletons written by hand.',
    url: 'https://demo.skelter.dev',
    siteName: 'skelter demo',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'skelter demo',
    description: 'Live demo of react-zero-skeleton. Zero skeletons written by hand.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
