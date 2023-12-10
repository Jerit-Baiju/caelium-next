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
      <body className={handlee.className}>
        <link href='https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.css' rel='stylesheet' />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
        />
        <script src='https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.js'></script>
        <main className='min-h-screen'>
          <NavBar />
          <SideBar />
          <div class='p-4 sm:ml-64 pt-20'>
            <div class='p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700'>{children}</div>
          </div>
        </main>
      </body>
    </html>
  );
}
