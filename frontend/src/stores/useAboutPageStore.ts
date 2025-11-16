import { create } from 'zustand';
import { axiosInstance } from '../libs/axios';

export interface CoreValueItem {
  title: string;
  description: string;
  icon: string;
}

export interface AboutData {
  hero: {
    title: string;
    subtitle: string;
  };
  biography: {
    title: string;
    image?: string;
    paragraphs: string[];
  };
  coreValues: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: CoreValueItem[];
  };
  vision: {
    title: string;
    quote: string;
    author: string;
  };
  philosophy: {
    title: string;
    paragraphs: string[];
    priorities: {
      title: string;
      items: string[];
    };
  };
}

interface AboutPageState {
  aboutData: AboutData | null;
  isLoading: boolean;
  error: string | null;
  fetchAbout: () => Promise<void>;
  updateAbout: (data: Partial<AboutData>) => Promise<void>;
}

export const useAboutPageStore = create<AboutPageState>((set) => ({
  aboutData: null,
  isLoading: false,
  error: null,
  fetchAbout: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get('/about');
      set({ aboutData: res.data, isLoading: false });
    } catch (err: any) {
      set({ 
        error: err?.response?.data?.message || 'Failed to fetch about data', 
        isLoading: false 
      });
    }
  },
  updateAbout: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put('/about', data);
      set({ aboutData: res.data, isLoading: false });
    } catch (err: any) {
      set({ 
        error: err?.response?.data?.message || 'Failed to update about data', 
        isLoading: false 
      });
      throw err;
    }
  },
}));

