"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: api.conversations.list,
    refetchInterval: 10_000,
  });
}

export function useConversation(id: string) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => api.conversations.get(id),
    enabled: !!id,
    refetchInterval: 10_000,
  });
}

export function useCreateConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.conversations.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useMarkConversationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.conversations.markRead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      conversationId,
      ...data
    }: {
      conversationId: string;
      content: string;
      senderId: string;
      senderName: string;
      senderRole: string;
    }) => api.conversations.sendMessage(conversationId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["conversations"] });
      qc.invalidateQueries({
        queryKey: ["conversations", variables.conversationId],
      });
    },
  });
}
