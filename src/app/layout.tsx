import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/providers";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MainContentInner } from "@/components/layout/main-content";
import { AIAssistantPanel } from "@/components/ai/ai-assistant-panel";
import { AITrigger } from "@/components/ai/ai-trigger";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PhysioAI - Smart Physiotherapy Practice Management",
  description:
    "AI-powered physiotherapy practice management system for modern healthcare providers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f766e" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="PhysioAI" />
      </head>
      <body
        className={`${inter.variable} ${dmSans.variable} font-sans antialiased`}
      >
        <Providers>
          <div className="relative flex min-h-screen">
            {/* Desktop sidebar */}
            <AppSidebar />

            {/* Main content area - offset by sidebar width */}
            <MainContentInner>
              {/* Top header */}
              <Header />

              {/* Page content */}
              <main className="flex-1 overflow-auto pb-20 md:pb-0">
                {children}
              </main>
            </MainContentInner>

            {/* Mobile bottom navigation */}
            <MobileNav />

            {/* AI Assistant */}
            <AIAssistantPanel />
            <AITrigger />
          </div>
        </Providers>
      </body>
    </html>
  );
}
