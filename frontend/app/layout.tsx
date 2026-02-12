// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import toast, { Toaster } from "react-hot-toast";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Argon Dashboard 2 PRO",
  description: "Modern dashboard with advanced features",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning
        className={`
          ${inter.variable}
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-background
          text-text-primary
          overflow-x-hidden
        `}
      >
        <ReactQueryProvider>
          {children}
        </ReactQueryProvider>
        
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
