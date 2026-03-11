import { create } from 'zustand';
import type { Conversation, Message } from '@/types';
import { mockConversations } from '@/data/messages';

interface MessageStore {
  conversations: Conversation[];
  addConversation: (conversation: Conversation) => void;
  addMessage: (conversationId: string, message: Message) => void;
  markAsRead: (conversationId: string) => void;
  getConversationById: (conversationId: string) => Conversation | undefined;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  conversations: mockConversations,

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  addMessage: (conversationId, message) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              messages: [...conv.messages, message],
              lastMessage: message.content,
              lastMessageTime: message.timestamp,
              unreadCount:
                message.senderRole === 'patient'
                  ? conv.unreadCount + 1
                  : conv.unreadCount,
            }
          : conv
      ),
    })),

  markAsRead: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === conversationId
          ? {
              ...conv,
              unreadCount: 0,
              messages: conv.messages.map((m) => ({ ...m, read: true })),
            }
          : conv
      ),
    })),

  getConversationById: (conversationId) =>
    get().conversations.find((c) => c.id === conversationId),
}));
