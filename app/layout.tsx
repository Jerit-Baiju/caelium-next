import { AuthProvider } from '@/contexts/AuthContext';
import { NavbarProvider } from '@/contexts/NavContext';
import type { Metadata } from 'next';
import Script from 'next/script';
import { handleeFont } from './font';
import './globals.css';

export const metadata: Metadata = {
  title: 'Caelium',
  description: 'Caelium: Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.',
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['Caelium'],
  authors: [
    { name: 'Jerit Baiju' },
    {
      name: 'Jerit Baiju',
      url: 'https://jerit.in',
    },
  ],
  icons: [
    { rel: 'apple-touch-icon', url: 'logos/logo.png' },
    { rel: 'icon', url: 'logos/logo.png' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, interactive-widget=resizes-content'></meta>
      </head>
      <body className={`${handleeFont.className} dark:bg-neutral-950 bg-white dark:text-neutral-200 text-neutral-800`}>
        <NavbarProvider>
          <AuthProvider>{children}</AuthProvider>
        </NavbarProvider>
        <Script src='https://kit.fontawesome.com/c75f557ffd.js' crossOrigin='anonymous'></Script>
      </body>
    </html>
  );
}
