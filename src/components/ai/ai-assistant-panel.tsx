"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Plus,
  Bot,
  Loader2,
  Sparkles,
  FileText,
  Dumbbell,
  MessageSquare,
  Brain,
  ClipboardList,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useUIStore } from "@/stores/ui-store";
import { usePatientStore } from "@/stores/patient-store";
import { ChatMessage } from "./chat-message";
import { buildPatientContext } from "@/lib/ai-context";
import type { AIMessage } from "@/types";

const quickActionChips = [
  {
    label: "Summarize patient",
    icon: FileText,
    prompt:
      "Please provide a clinical summary of the current patient including their condition, progress, and recommendations.",
  },
  {
    label: "Suggest exercises",
    icon: Dumbbell,
    prompt:
      "Based on the current patient's condition and progress, suggest appropriate exercises for their next phase of rehabilitation.",
  },
  {
    label: "Draft follow-up",
    icon: MessageSquare,
    prompt:
      "Draft a follow-up message for the current patient regarding their treatment progress and upcoming appointment.",
  },
  {
    label: "Clinical reasoning",
    icon: Brain,
    prompt:
      "Help me with clinical reasoning for the current patient. What differential diagnoses should I consider and what assessment findings support the current diagnosis?",
  },
  {
    label: "Generate HEP",
    icon: ClipboardList,
    prompt:
      "Generate a home exercise programme (HEP) for the current patient based on their condition and current treatment phase.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AIAssistantPanel() {
  const aiPanelOpen = useUIStore((s) => s.aiPanelOpen);
  const toggleAiPanel = useUIStore((s) => s.toggleAiPanel);
  const activePage = useUIStore((s) => s.activePage);
  const selectedPatientId = useUIStore((s) => s.selectedPatientId);
  const getPatientById = usePatientStore((s) => s.getPatientById);

  const selectedPatient = selectedPatientId
    ? getPatientById(selectedPatientId)
    : undefined;

  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Cmd+J keyboard shortcut to toggle panel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault();
        toggleAiPanel();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleAiPanel]);

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
  };

  const handleSend = async (overrideMessage?: string) => {
    const trimmed = (overrideMessage ?? input).trim();
    if (!trimmed || streaming) return;

    const userMessage: AIMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setStreaming(true);

    // Build patient context if available
    const patientContext = selectedPatientId
      ? buildPatientContext(selectedPatientId)
      : undefined;

    // Create placeholder assistant message for streaming
    const assistantId = `msg-${Date.now()}-a`;
    const assistantMessage: AIMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          context: {
            page: activePage,
            patientId: selectedPatientId,
            patientName: selectedPatient
              ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
              : undefined,
            patientContext,
          },
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated } : m
            )
          );
        }
      } else {
        // Fallback for non-streaming or error responses
        const data = await res.json().catch(() => null);
        const fallbackContent =
          data?.message ||
          "I apologize, but I am unable to respond right now. Please try again.";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: fallbackContent } : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "I apologize, but there was an error connecting to the AI service. Please try again.",
              }
            : m
        )
      );
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    handleSend(prompt);
  };

  return (
    <Sheet open={aiPanelOpen} onOpenChange={toggleAiPanel}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-md">
        {/* Header */}
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100 dark:bg-teal-900">
                <Bot className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <SheetTitle className="text-sm">AI Assistant</SheetTitle>
                <SheetDescription className="text-[10px]">
                  Powered by AI
                </SheetDescription>
              </div>
            </div>
            <Button variant="ghost" size="icon-xs" onClick={handleNewChat}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Context badge */}
          <div className="flex items-center gap-2 pt-1">
            {selectedPatient && (
              <Badge variant="secondary" className="text-[10px]">
                Patient: {selectedPatient.firstName} {selectedPatient.lastName}
              </Badge>
            )}
            <Badge variant="outline" className="text-[10px]">
              {activePage || "dashboard"}
            </Badge>
          </div>
        </SheetHeader>

        {/* Patient context header */}
        {selectedPatient && (
          <div className="flex items-center gap-2 border-b px-4 py-2 bg-muted/30">
            <Avatar size="sm">
              <AvatarFallback className="text-[10px]">
                {getInitials(
                  `${selectedPatient.firstName} ${selectedPatient.lastName}`
                )}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {selectedPatient.condition}
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 py-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Bot className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">How can I help?</p>
                  <p className="text-xs text-muted-foreground">
                    Ask me about treatment plans, exercises, patient
                    management, or clinical reasoning.
                  </p>
                </div>

                {/* Quick Action Chips */}
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {quickActionChips.map((chip) => (
                    <button
                      key={chip.label}
                      onClick={() => handleQuickAction(chip.prompt)}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <chip.icon className="h-3 w-3" />
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {/* Typing indicator */}
            {streaming &&
              messages.length > 0 &&
              messages[messages.length - 1].content === "" && (
                <div className="flex justify-start">
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
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the AI assistant..."
              className="flex-1"
              disabled={streaming}
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || streaming}
            >
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
