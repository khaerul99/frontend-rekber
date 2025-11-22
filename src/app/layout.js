// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <--- IMPORT INI

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Rekber App",
  description: "Platform Rekber Terpercaya",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster /> {/* <--- PASANG INI DI SINI */}
      </body>
    </html>
  );
}