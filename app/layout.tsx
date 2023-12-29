import { AuthProvider } from '@/contexts/AuthContext';
import type { Metadata } from 'next';
import { handleeFont } from './font';
import './globals.css';

export const metadata: Metadata = {
  title: 'Caelium',
  description: 'Caelium: Your all-in-one life planner for shared moments and organized events. Join now!',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0, interactive-widget=resizes-content'></meta>
        <link href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&display=optional' rel='stylesheet' />
      </head>
      <body className={handleeFont.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
