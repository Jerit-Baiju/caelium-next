import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import Script from 'next/script';
import { handleeFont } from './font';
import './globals.css';
import ProvidersWrapper from './providers';
import Wrapper from './Wrapper';
import { Analytics } from '@vercel/analytics/next';

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
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0 user-scalable=no' />
      </head>
      <body className={`${handleeFont.className} dark:bg-neutral-950 bg-white dark:text-neutral-200 text-neutral-800`}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
          <ProvidersWrapper>
              <Wrapper>{children}</Wrapper>
          </ProvidersWrapper>
        </ThemeProvider>
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-RN3WVJ9FLK" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-RN3WVJ9FLK');
          `}
        </Script>
        <Analytics />
      </body>
    </html>
  );
}
