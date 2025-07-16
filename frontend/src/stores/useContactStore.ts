import { create } from 'zustand';
import { axiosInstance } from '../libs/axios';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactStore {
  loading: boolean;
  error: string | null;
  success: string | null;
  sendContact: (data: ContactFormData) => Promise<void>;
  reset: () => void;
}

export const useContactStore = create<ContactStore>((set) => ({
  loading: false,
  error: null,
  success: null,
  sendContact: async (data) => {
    set({ loading: true, error: null, success: null });
    try {
      const res = await axiosInstance.post('/contact/submit', data);
      set({ success: res.data.message, loading: false });
    } catch (err: any) {
      set({ error: err?.response?.data?.message || 'Failed to send message', loading: false });
    }
  },
  reset: () => set({ loading: false, error: null, success: null }),
}));
