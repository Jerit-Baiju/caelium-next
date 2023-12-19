import type { Metadata } from "next";
import { handleeFont } from "./font";
import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import Wrapper from "./Wrapper";

export const metadata: Metadata = {
  title: "Caelium",
  description:
    "Caelium: Your all-in-one life planner for shared moments and organized events. Join now!",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.2.0/flowbite.min.js"></Script>
      </head>
      <body className={handleeFont.className}>
        <AuthProvider>
          <Wrapper>{children}</Wrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
