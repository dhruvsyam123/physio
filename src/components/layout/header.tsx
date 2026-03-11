"use client";

import { useState } from "react";
import { Menu, Search, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUIStore } from "@/stores/ui-store";
import { NotificationCenter } from "./notification-center";
import { CommandPalette } from "./command-palette";

export function Header() {
  const { toggleSidebar, toggleAiPanel } = useUIStore();
  const [, setCommandOpen] = useState(false);

  function handleSearchClick() {
    // Trigger Cmd+K to open command palette
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-white/70 px-4 backdrop-blur-xl backdrop-saturate-150">
        {/* Sidebar toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0 text-muted-foreground hover:text-foreground md:flex"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Global search */}
        <div className="relative flex-1 max-w-md" onClick={handleSearchClick}>
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search patients, appointments..."
            className="pl-9 bg-muted/50 border-transparent focus-visible:border-ring focus-visible:bg-white cursor-pointer"
            readOnly
            onClick={handleSearchClick}
          />
          <kbd className="pointer-events-none hidden md:inline-flex absolute right-2.5 top-1/2 -translate-y-1/2 h-5 items-center gap-1 rounded border border-border/60 bg-muted/50 px-1.5 text-[10px] font-medium text-muted-foreground">&#8984;K</kbd>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Notifications */}
          <NotificationCenter />

          {/* AI Assistant trigger */}
          <Button
            onClick={toggleAiPanel}
            size="sm"
            className="gap-1.5 ai-gradient text-primary-foreground hover:opacity-90"
          >
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI Assistant</span>
          </Button>

          {/* User avatar */}
          <Avatar size="sm">
            <AvatarImage src="/avatar-therapist.jpg" alt="Dr. Sarah Chen" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Command Palette */}
      <CommandPalette />
    </>
  );
}
