import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css"; // All animations are her
import Sidebar from "@/components/UI/Sidebar";
import { SidebarProvider } from "@/components/SidebarContext";
import Navbar from "@/components/UI/Navbar";


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
      <body
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
               <SidebarProvider>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Navbar />
              <main className="flex-1 overflow-auto p-4">
                {children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}