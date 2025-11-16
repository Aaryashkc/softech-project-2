import { create } from 'zustand';
import { axiosInstance } from '../libs/axios';

export interface ContactInfoItem {
  title: string;
  description: string;
  icon: string;
}

export interface ResponseTime {
  label: string;
  duration: string;
}

export interface ContactData {
  hero: {
    title: string;
    subtitle: string;
  };
  contactInfo: {
    sectionTitle?: string;
    items: ContactInfoItem[];
  };
  additionalInfo: {
    publicEngagement: {
      title: string;
      description: string;
      items: string[];
      icon: string;
    };
    responseTime: {
      title: string;
      description: string;
      icon: string;
      times: ResponseTime[];
    };
    scheduleMeeting: {
      title: string;
      description: string;
      note: string;
      icon: string;
    };
  };
}

interface ContactPageState {
  contactData: ContactData | null;
  isLoading: boolean;
  error: string | null;
  fetchContact: () => Promise<void>;
  updateContact: (data: Partial<ContactData>) => Promise<void>;
}

export const useContactPageStore = create<ContactPageState>((set) => ({
  contactData: null,
  isLoading: false,
  error: null,
  fetchContact: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get('/contact');
      set({ contactData: res.data, isLoading: false });
    } catch (err: any) {
      set({ 
        error: err?.response?.data?.message || 'Failed to fetch contact data', 
        isLoading: false 
      });
    }
  },
  updateContact: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put('/contact', data);
      set({ contactData: res.data, isLoading: false });
    } catch (err: any) {
      set({ 
        error: err?.response?.data?.message || 'Failed to update contact data', 
        isLoading: false 
      });
      throw err;
    }
  },
}));

