import { AuthProvider } from '@/contexts/AuthContext';
import type { Metadata } from 'next';
import Script from 'next/script';
import { handleeFont } from './font';
import './globals.css';

export const metadata: Metadata = {
  title: 'Caelium',
  description: 'Caelium: Unveil Your World, Connect Your Dreams - Where Privacy Meets Possibility.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, interactive-widget=resizes-content'></meta>
      </head>
      <body className={`${handleeFont.className} bg-background`}>
        <AuthProvider>{children}</AuthProvider>
        <Script src='https://kit.fontawesome.com/c75f557ffd.js' crossOrigin='anonymous'></Script>
      </body>
    </html>
  );
}
