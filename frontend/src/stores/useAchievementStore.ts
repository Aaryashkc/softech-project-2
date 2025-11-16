import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// Achievement data types
export interface AchievementHero {
  title: string;
  subtitle: string;
}

export interface AchievementStatDetails {
  title: string;
  description: string;
  highlights: string[];
}

export interface AchievementStat {
  number: string;
  label: string;
  icon: string;
  details: AchievementStatDetails;
}

export interface AchievementItem {
  title: string;
  description: string;
  impact: string;
}

export interface AchievementCategory {
  category: string;
  icon: string;
  color?: string;
  items: AchievementItem[];
}

export interface MediaRecognitionItem {
  outlet: string;
  outletColor?: string;
  title: string;
  description: string;
  year: string;
  link?: string;
}

export interface MediaRecognition {
  sectionTitle: string;
  sectionSubtitle: string;
  items: MediaRecognitionItem[];
}

export interface FutureGoals {
  title: string;
  description: string;
  immediate: {
    title?: string;
    items: string[];
  };
  longTerm: {
    title?: string;
    items: string[];
  };
}

export interface AchievementData {
  _id?: string;
  hero: AchievementHero;
  stats: AchievementStat[];
  achievements: AchievementCategory[];
  mediaRecognition: MediaRecognition;
  futureGoals: FutureGoals;
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
interface AchievementState {
  achievementData: AchievementData | null;
  isLoading: boolean;
  fetchAchievement: () => Promise<void>;
  updateAchievement: (achievementData: Partial<AchievementData>) => Promise<void>;
}

export const useAchievementStore = create<AchievementState>((set) => ({
  achievementData: null,
  isLoading: false,

  // Fetch achievement data
  fetchAchievement: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/achievement");
      set({ achievementData: response.data });
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to fetch achievement data");
    } finally {
      set({ isLoading: false });
    }
  },

  // Update achievement data
  updateAchievement: async (achievementData: Partial<AchievementData>) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put("/achievement", achievementData);
      set({ achievementData: response.data });
      toast.success("Achievement page updated successfully");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to update achievement data");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

