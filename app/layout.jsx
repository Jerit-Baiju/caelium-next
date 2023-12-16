import { handleeFont } from "./font";
import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "Caelium",
  description: "Unite, Share, and Cherish: Your Family's Gateway to Timeless Bonds.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.js" ></Script>
      </head>
      <body className={handleeFont.className}>{children}</body>
    </html>
  );
}
