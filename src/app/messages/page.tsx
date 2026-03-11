"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { ConversationList } from "@/components/messages/conversation-list";
import { MessageThread } from "@/components/messages/message-thread";
import { useConversations, useCreateConversation } from "@/hooks/use-conversations";
import { usePatients } from "@/hooks/use-patients";

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesPageInner />
    </Suspense>
  );
}

function MessagesPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: conversations = [], isLoading } = useConversations();
  const createConversation = useCreateConversation();
  const { data: patients = [] } = usePatients();

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  // Set default selection when conversations load
  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, selectedId]);

  // Handle patientId query param — find or create conversation
  useEffect(() => {
    const patientId = searchParams.get("patientId");
    if (!patientId) return;

    // Check if conversation already exists for this patient
    const existing = conversations.find((c) => c.patientId === patientId);
    if (existing) {
      setSelectedId(existing.id);
      return;
    }

    // Create new conversation for this patient
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return;

    const newConv = {
      id: `conv-${Date.now()}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientAvatar: undefined,
      lastMessage: "",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: [],
    };
    createConversation.mutate(newConv, {
      onSuccess: () => setSelectedId(newConv.id),
    });
  }, [searchParams, conversations, patients, createConversation]);

  function handleSelect(conversationId: string) {
    // On mobile, navigate to dedicated page
    if (window.innerWidth < 768) {
      router.push(`/messages/${conversationId}`);
      return;
    }
    setSelectedId(conversationId);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-6 py-4">
        <div className="flex items-center justify-center rounded-lg bg-teal-100 p-2 dark:bg-teal-950">
          <MessageSquare className="h-5 w-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
          <p className="text-sm text-muted-foreground">
            Communicate with your patients securely.
          </p>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex flex-1 min-h-0">
        {/* Conversation List - always visible on desktop, hidden on mobile when thread is selected */}
        <div className="w-full md:w-1/3 md:max-w-sm md:block">
          <ConversationList
            selectedId={selectedId}
            onSelect={handleSelect}
          />
        </div>

        {/* Message Thread - hidden on mobile, visible on desktop */}
        <div className="hidden md:flex md:flex-1 border-l">
          {selectedId ? (
            <div className="flex-1">
              <MessageThread conversationId={selectedId} />
            </div>
          ) : (
            <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
              Select a conversation to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
