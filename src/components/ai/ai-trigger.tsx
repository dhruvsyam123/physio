"use client";

import { Bot } from "lucide-react";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

export function AITrigger() {
  const toggleAiPanel = useUIStore((s) => s.toggleAiPanel);
  const aiPanelOpen = useUIStore((s) => s.aiPanelOpen);

  return (
    <button
      onClick={toggleAiPanel}
      className={cn(
        "group fixed bottom-6 right-6 z-30 flex h-12 items-center justify-center rounded-full ai-gradient text-white shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 active:scale-95",
        "bottom-20 md:bottom-6",
        !aiPanelOpen && "animate-pulse-glow [animation-iteration-count:3]",
        "w-12 hover:w-auto hover:px-4 hover:gap-2 overflow-hidden"
      )}
      aria-label="Open AI Assistant (Cmd+J)"
    >
      <Bot className="h-5 w-5 shrink-0" />
      <span className="hidden text-sm font-medium whitespace-nowrap group-hover:inline">
        Ask AI
      </span>
      <kbd className="hidden text-[10px] font-normal opacity-70 whitespace-nowrap group-hover:inline">
        &#8984;J
      </kbd>
    </button>
  );
}
