import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// Home data types
export interface HomeButton {
  text: string;
  link: string;
  type: "primary" | "secondary";
}

export interface HomeHero {
  value: string;
  name: string;
  title: string;
  description: string;
  profileImage: string;
  buttons: HomeButton[];
}

export interface HighlightItem {
  icon: string;
  title: string;
  description: string;
}

export interface HomeHighlights {
  sectionTitle: string;
  sectionSubtitle: string;
  items: HighlightItem[];
}

export interface InitiativeItem {
  title: string;
  description: string;
  image: string;
  date: string;
  imageAlt?: string;
}

export interface HomeInitiatives {
  sectionTitle: string;
  sectionSubtitle: string;
  items: InitiativeItem[];
}

export interface HomeCTA {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export interface HomeData {
  _id?: string;
  hero: HomeHero;
  highlights: HomeHighlights;
  initiatives: HomeInitiatives;
  cta: HomeCTA;
  createdAt?: string;
  updatedAt?: string;
}

// Error shape
interface ErrorResponse extends Error {
  response?: {
    status?: number;
    statusText?: string;
    data: {
      message: string;
    };
  };
}

// Zustand store interface
interface HomeState {
  homeData: HomeData | null;
  isLoading: boolean;
  fetchHome: () => Promise<void>;
  updateHome: (homeData: Partial<HomeData>) => Promise<void>;
}

export const useHomeStore = create<HomeState>((set) => ({
  homeData: null,
  isLoading: false,

  // Fetch home data
  fetchHome: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/home");
      set({ homeData: response.data });
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to fetch home data");
    } finally {
      set({ isLoading: false });
    }
  },

  // Update home data
  updateHome: async (homeData: Partial<HomeData>) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put("/home", homeData);
      set({ homeData: response.data });
      toast.success("Home page updated successfully");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to update home data");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

