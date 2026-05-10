import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider, ToastProvider } from "./providers";
import { ToastContainer } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Inventory — Control Your Stock, Grow Your Business",
  description: "Sistem manajemen inventaris cerdas untuk mengelola produk, stok, dan kategori dengan efisien.",
  keywords: ["inventory", "management", "stock", "products"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        <QueryProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
