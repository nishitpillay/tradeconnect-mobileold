import { apiClient } from './client';
import type { Conversation, Message } from '../types';

export const messagingAPI = {
  getConversations: async (): Promise<{ conversations: Conversation[] }> => {
    return apiClient.get('/conversations');
  },

  getConversationById: async (id: string): Promise<{ conversation: Conversation }> => {
    return apiClient.get(`/conversations/${id}`);
  },

  getMessages: async (conversationId: string, cursor?: string): Promise<{ messages: Message[]; next_cursor: string | null }> => {
    const params = cursor ? `?cursor=${cursor}` : '';
    return apiClient.get(`/conversations/${conversationId}/messages${params}`);
  },

  sendMessage: async (conversationId: string, body: string): Promise<{ message: Message }> => {
    return apiClient.post(`/conversations/${conversationId}/messages`, { body, message_type: 'text' });
  },

  markAsRead: async (conversationId: string): Promise<void> => {
    return apiClient.post(`/conversations/${conversationId}/read`);
  },

  archiveConversation: async (id: string): Promise<void> => {
    return apiClient.post(`/conversations/${id}/archive`);
  },
};
