"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageThread } from "@/components/messages/message-thread";
import { useMessageStore } from "@/stores/message-store";

export default function MobileMessagePage() {
  const params = useParams();
  const conversationId = params.id as string;
  const conversation = useMessageStore((state) =>
    state.getConversationById(conversationId)
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Back header */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <Link href="/messages">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <span className="text-sm font-semibold">
          {conversation?.patientName || "Conversation"}
        </span>
      </div>

      {/* Thread */}
      <div className="flex-1 min-h-0">
        <MessageThread conversationId={conversationId} />
      </div>
    </div>
  );
}
