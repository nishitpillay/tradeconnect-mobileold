import { apiClient } from './client';
import type { Quote, SubmitQuoteInput } from '../types';

export const quotesAPI = {
  getQuotesForJob: async (jobId: string): Promise<{ quotes: Quote[] }> => {
    return apiClient.get(`/jobs/${jobId}/quotes`);
  },

  getMyQuotes: async (status?: string): Promise<{ quotes: Quote[] }> => {
    const params = status ? `?status=${status}` : '';
    return apiClient.get(`/quotes/mine${params}`);
  },

  getQuoteById: async (id: string): Promise<{ quote: Quote }> => {
    return apiClient.get(`/quotes/${id}`);
  },

  submitQuote: async (jobId: string, data: SubmitQuoteInput): Promise<{ quote: Quote }> => {
    return apiClient.post(`/jobs/${jobId}/quotes`, data);
  },

  updateQuote: async (id: string, data: Partial<SubmitQuoteInput>): Promise<{ quote: Quote }> => {
    return apiClient.patch(`/quotes/${id}`, data);
  },

  withdrawQuote: async (id: string, reason?: string): Promise<{ quote: Quote }> => {
    return apiClient.post(`/quotes/${id}/withdraw`, { withdrawal_reason: reason });
  },

  markQuoteViewed: async (id: string): Promise<{ quote: Quote }> => {
    return apiClient.post(`/quotes/${id}/action`, { action: 'viewed' });
  },

  shortlistQuote: async (id: string): Promise<{ quote: Quote }> => {
    return apiClient.post(`/quotes/${id}/action`, { action: 'shortlisted' });
  },

  rejectQuote: async (id: string): Promise<{ quote: Quote }> => {
    return apiClient.post(`/quotes/${id}/action`, { action: 'rejected' });
  },
};
