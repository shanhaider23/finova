'use client';
import { Outfit } from "next/font/google";
import "./styles/globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";
import Header from "./_component/Header";
import SideNav from "./(routes)/dashboard/_component/SideNav";
import { store } from '../redux/store';
import { Provider } from 'react-redux';
import Footer from "./_component/Footer";
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Outfit({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Outfit({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <html lang="en">
          <Head>
            <link rel="manifest" href="/manifest.json" />
            <meta name="theme-color" content="#2c095d" />
            <link rel="apple-touch-icon" href="/icon-192x192.png" />
          </Head>
          <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <Toaster />
            <AppContent>{children}</AppContent> {/* 👈 Move logic into a child component */}
            <Analytics />

          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}

// Move state logic to a separate component inside <ClerkProvider>
function AppContent({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { isSignedIn } = useUser(); // ✅ Now it works inside ClerkProvider

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('sidebarExpanded');
      setIsSidebarExpanded(saved !== 'false');
    }
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 h-full text-white fixed left-0 top-0 bottom-0 hidden sm:block">
        <SideNav isSidebarExpanded={isSidebarExpanded} setIsSidebarExpanded={setIsSidebarExpanded} />
      </aside>

      {/* Main Content */}
      <main className={cn(
        "transition-all duration-300 flex flex-col w-full h-screen overflow-hidden",
        !isSignedIn ? "ml-0" : isSidebarExpanded ? "sm:ml-[255px]" : "sm:ml-[68px]", "ml-0"
      )}>
        <Header />
        <div className="flex-grow overflow-auto">
          <div className="w-full flex justify-center mx-auto h-full relative">
            <div className="w-full page-transition-container">
              {children}
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}
