"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessageStore } from "@/stores/message-store";
import { cn } from "@/lib/utils";

interface ConversationListProps {
  selectedId?: string;
  onSelect: (conversationId: string) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTime(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date("2026-03-11T12:00:00Z");
  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function ConversationList({ selectedId, onSelect }: ConversationListProps) {
  const conversations = useMessageStore((state) => state.conversations);
  const [search, setSearch] = useState("");

  const filtered = conversations.filter((c) =>
    c.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col border-r">
      {/* Search */}
      <div className="p-3 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Conversation List */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {filtered.length === 0 ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              No conversations found.
            </p>
          ) : (
            filtered
              .sort(
                (a, b) =>
                  new Date(b.lastMessageTime).getTime() -
                  new Date(a.lastMessageTime).getTime()
              )
              .map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => onSelect(conv.id)}
                  className={cn(
                    "flex items-start gap-3 px-3 py-3 text-left transition-colors hover:bg-muted/50 border-b",
                    selectedId === conv.id && "bg-muted"
                  )}
                >
                  <Avatar size="default">
                    {conv.patientAvatar && (
                      <AvatarImage src={conv.patientAvatar} />
                    )}
                    <AvatarFallback>
                      {getInitials(conv.patientName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-1 flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm truncate",
                          conv.unreadCount > 0
                            ? "font-semibold"
                            : "font-medium"
                        )}
                      >
                        {conv.patientName}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatTime(conv.lastMessageTime)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-xs truncate",
                          conv.unreadCount > 0
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        )}
                      >
                        {conv.lastMessage}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge className="shrink-0 bg-teal-600 text-white text-[10px] h-4 min-w-4 px-1 flex items-center justify-center">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
