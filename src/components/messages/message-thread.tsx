"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessageStore } from "@/stores/message-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface MessageThreadProps {
  conversationId: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatMessageTime(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatMessageDate(timestamp: string) {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

const patientResponses = [
  "Thank you, I'll make sure to do the exercises.",
  "Got it, see you at my next appointment!",
  "Thanks for the update. I've been feeling much better lately.",
  "I appreciate the follow-up. Will do as advised.",
  "Thank you, Dr. Thompson. I'll keep you updated on my progress.",
];

export function MessageThread({ conversationId }: MessageThreadProps) {
  const conversation = useMessageStore((state) =>
    state.getConversationById(conversationId)
  );
  const addMessage = useMessageStore((state) => state.addMessage);
  const markAsRead = useMessageStore((state) => state.markAsRead);

  const [input, setInput] = useState("");
  const [aiDrafting, setAiDrafting] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages, typing]);

  useEffect(() => {
    if (conversation && conversation.unreadCount > 0) {
      markAsRead(conversationId);
    }
  }, [conversationId, conversation, markAsRead]);

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Select a conversation to start messaging.
      </div>
    );
  }

  async function handleAIDraft() {
    if (!conversation) return;
    setAiDrafting(true);
    try {
      const response = await fetch("/api/ai/draft-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          patientName: conversation.patientName,
          recentMessages: conversation.messages.slice(-5).map((m) => ({
            role: m.senderRole,
            content: m.content,
          })),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setInput(data.draft || "");
      }
    } catch {
      // Silently handle - user can retry
    } finally {
      setAiDrafting(false);
    }
  }

  function handleSend() {
    if (!input.trim()) return;

    const message = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: "therapist1",
      senderName: "Dr. Sarah Thompson",
      senderRole: "therapist" as const,
      content: input.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };

    addMessage(conversationId, message);
    setInput("");
    toast.success("Message sent");

    // Simulate patient typing and response
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const randomResponse =
        patientResponses[Math.floor(Math.random() * patientResponses.length)];
      const patientMessage = {
        id: `msg-${Date.now()}-p`,
        conversationId,
        senderId: conversation!.patientId,
        senderName: conversation!.patientName,
        senderRole: "patient" as const,
        content: randomResponse,
        timestamp: new Date().toISOString(),
        read: true,
      };
      addMessage(conversationId, patientMessage);
    }, 2000);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  // Group messages by date
  const messagesByDate: { date: string; messages: typeof conversation.messages }[] = [];
  let currentDate = "";
  for (const msg of conversation.messages) {
    const msgDate = formatMessageDate(msg.timestamp);
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      messagesByDate.push({ date: msgDate, messages: [msg] });
    } else {
      messagesByDate[messagesByDate.length - 1].messages.push(msg);
    }
  }

  // Find last therapist message for "Read" indicator
  const allMessages = conversation.messages;
  let lastTherapistMsgId: string | null = null;
  for (let i = allMessages.length - 1; i >= 0; i--) {
    if (allMessages[i].senderRole === "therapist") {
      lastTherapistMsgId = allMessages[i].id;
      break;
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Avatar size="default">
          <AvatarFallback>
            {getInitials(conversation.patientName)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-sm font-semibold">{conversation.patientName}</h2>
          <p className="text-xs text-muted-foreground">Patient</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-4 py-4">
          {messagesByDate.map((group) => (
            <div key={group.date} className="flex flex-col gap-3">
              {/* Date divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground shrink-0">
                  {group.date}
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              {group.messages.map((msg) => {
                const isTherapist = msg.senderRole === "therapist";
                const isLastTherapist = msg.id === lastTherapistMsgId;
                return (
                  <div key={msg.id}>
                    <div
                      className={cn(
                        "flex gap-2 max-w-[85%]",
                        isTherapist ? "ml-auto flex-row-reverse" : "mr-auto"
                      )}
                    >
                      <Avatar size="sm" className="shrink-0 mt-1">
                        <AvatarFallback className="text-[10px]">
                          {getInitials(msg.senderName)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          "flex flex-col gap-1",
                          isTherapist ? "items-end" : "items-start"
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                            isTherapist
                              ? "bg-teal-600 text-white rounded-br-md"
                              : "bg-muted text-foreground rounded-bl-md"
                          )}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground px-1">
                          {formatMessageTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                    {/* Read receipt */}
                    {isTherapist && isLastTherapist && (
                      <p className="text-[10px] text-muted-foreground/60 text-right mt-0.5 pr-8">
                        Read &#10003;
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex gap-2 max-w-[85%] mr-auto">
              <Avatar size="sm" className="shrink-0 mt-1">
                <AvatarFallback className="text-[10px]">
                  {getInitials(conversation.patientName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
                <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={handleAIDraft}
            disabled={aiDrafting}
            className="shrink-0 ai-gradient text-white hover:opacity-90 gap-1.5"
          >
            {aiDrafting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            AI Draft
          </Button>
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={!input.trim()}
            className="shrink-0 bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
