"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  Dumbbell,
  FileInput,
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui-store";
import { useConversations } from "@/hooks/use-conversations";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patients", label: "Patients", icon: Users },
  { href: "/schedule", label: "Schedule", icon: Calendar },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/exercises", label: "Exercises", icon: Dumbbell },
  { href: "/referrals", label: "Referrals", icon: FileInput },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { data: conversations = [] } = useConversations();
  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 hidden h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] md:flex",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo / Brand */}
      <Link
        href="/dashboard"
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border px-3 transition-opacity hover:opacity-80",
          sidebarCollapsed ? "justify-center" : "gap-2.5"
        )}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ai-gradient text-primary-foreground">
          <Activity className="h-4.5 w-4.5" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
            PhysioAI
          </span>
        )}
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/8 text-primary before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-[3px] before:rounded-full before:bg-primary relative"
                  : "text-sidebar-foreground hover:bg-muted/50 hover:text-sidebar-accent-foreground",
                sidebarCollapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  isActive
                    ? "text-sidebar-primary"
                    : "text-muted-foreground"
                )}
              />
              {!sidebarCollapsed && <span>{item.label}</span>}
              {item.label === "Messages" && totalUnread > 0 && (
                <span className="ml-auto h-2 w-2 rounded-full bg-primary" />
              )}
            </Link>
          );

          if (sidebarCollapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger render={linkContent} />
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>

      {/* Pro badge */}
      {!sidebarCollapsed && (
        <div className="mx-3 mb-3 rounded-lg bg-gradient-to-r from-primary/10 to-violet-500/10 px-3 py-2 text-xs font-medium text-primary">PhysioAI Pro</div>
      )}

      {/* Collapse toggle */}
      <div className="border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          className={cn(
            "w-full text-muted-foreground hover:text-sidebar-foreground",
            sidebarCollapsed ? "justify-center" : "justify-end"
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </aside>
  );
}
