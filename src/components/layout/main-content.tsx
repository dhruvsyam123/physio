"use client";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { usePathname } from "next/navigation";

export function MainContentInner({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex flex-1 flex-col transition-sidebar",
        // On desktop, offset by sidebar width
        sidebarCollapsed ? "md:ml-16" : "md:ml-60"
      )}
    >
      <div key={pathname} className="animate-fade-in-up flex flex-1 flex-col">
        {children}
      </div>
    </div>
  );
}
