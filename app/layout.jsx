import NavBar from '@/components/NavBar';
import { Handlee } from 'next/font/google';
import './globals.css';

const handlee = Handlee({ subsets: ['latin'], weight: '400' });

export const metadata = {
  title: 'Caelium',
  description: "Unite, Share, and Cherish: Your Family's Gateway to Timeless Bonds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={handlee.className}>
        <main className='min-h-screen'>
          <NavBar />
          <div className='pt-20'>{children}</div>
        </main>
      </body>
    </html>
  );
}
