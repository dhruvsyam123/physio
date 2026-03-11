"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AIMessage } from "@/types";

interface ChatMessageProps {
  message: AIMessage;
}

function renderMarkdown(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${elements.length}`} className="list-disc pl-4 space-y-0.5 my-1">
          {listItems.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  }

  function renderInline(text: string): React.ReactNode {
    // Parse **bold** text
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={`h3-${i}`} className="font-semibold text-sm mt-2 mb-1">
          {renderInline(line.slice(4))}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      listItems.push(line.slice(2));
    } else {
      flushList();
      if (line.trim() === "") {
        elements.push(<br key={`br-${i}`} />);
      } else {
        elements.push(
          <span key={`line-${i}`} className="block">
            {renderInline(line)}
          </span>
        );
      }
    }
  }
  flushList();

  return <>{elements}</>;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn("flex group", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 relative",
          isUser
            ? "rounded-br-md bg-teal-600 text-white dark:bg-teal-700"
            : "rounded-bl-md bg-muted text-foreground"
        )}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {isUser ? message.content : renderMarkdown(message.content)}
        </div>
        <p
          className={cn(
            "mt-1 text-[10px]",
            isUser
              ? "text-teal-200 dark:text-teal-300"
              : "text-muted-foreground"
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>

        {/* Copy button for assistant messages */}
        {!isUser && message.content && (
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleCopy}
            className="absolute -bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-500" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
