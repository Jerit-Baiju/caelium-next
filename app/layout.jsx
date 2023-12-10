import NavBar from '@/components/NavBar';
import SideBar from '@/components/SideBar';
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
      <head>
        <meta name='mobile-web-app-capable' content='yes' />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
        />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.js'></script>
      </head>
      <body className={handlee.className}>
        {children}
      </body>
    </html>
  );
}
