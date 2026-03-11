"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { MainContentInner } from "@/components/layout/main-content";
import { AIAssistantPanel } from "@/components/ai/ai-assistant-panel";
import { AITrigger } from "@/components/ai/ai-trigger";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="relative flex min-h-screen">
      <AppSidebar />
      <MainContentInner>
        <Header />
        <main className="flex-1 overflow-auto pb-20 md:pb-0">
          {children}
        </main>
      </MainContentInner>
      <MobileNav />
      <AIAssistantPanel />
      <AITrigger />
    </div>
  );
}
