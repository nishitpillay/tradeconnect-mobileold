import { apiClient } from './client';
import type { CustomerProfile, ProviderProfile, User } from '../types';

export const profilesAPI = {
  getMyProfile: async (): Promise<{ user: User; customer_profile?: CustomerProfile; provider_profile?: ProviderProfile }> => {
    return apiClient.get('/profile/me');
  },

  getProviderProfile: async (userId: string): Promise<{ profile: ProviderProfile }> => {
    return apiClient.get(`/profiles/provider/${userId}`);
  },

  updateUser: async (data: { full_name?: string; display_name?: string; timezone?: string }): Promise<{ user: User }> => {
    return apiClient.patch('/profile/user', data);
  },

  updateCustomerProfile: async (data: { suburb?: string; state?: string; postcode?: string }): Promise<{ profile: CustomerProfile }> => {
    return apiClient.patch('/profile/customer', data);
  },

  updateProviderProfile: async (data: {
    bio?: string;
    years_experience?: number;
    service_radius_km?: number;
    business_name?: string;
    abn?: string;
  }): Promise<{ profile: ProviderProfile }> => {
    return apiClient.patch('/profile/provider', data);
  },

  toggleAvailability: async (available: boolean): Promise<{ profile: ProviderProfile }> => {
    return apiClient.post('/profile/provider/availability', { available });
  },
};
