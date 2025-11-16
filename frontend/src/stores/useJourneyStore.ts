import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// Journey data types
export interface JourneyHero {
  title: string;
  subtitle: string;
}

export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface Milestones {
  sectionTitle: string;
  sectionSubtitle: string;
  items: MilestoneItem[];
}

export interface LeadershipPhase {
  title: string;
  period: string;
  periodColor: string;
  icon: string;
  iconColor: string;
  dotColor: string;
  items: string[];
}

export interface LeadershipPhases {
  sectionTitle: string;
  sectionSubtitle: string;
  phases: LeadershipPhase[];
}

export interface InterviewInsight {
  source: string;
  quote: string;
  description: string;
  icon: string;
  iconColor: string;
  bgColor: string;
}

export interface InterviewInsights {
  sectionTitle: string;
  sectionSubtitle: string;
  items: InterviewInsight[];
}

export interface CurrentFocus {
  title: string;
  description: string;
  tags: string[];
}

export interface JourneyData {
  _id?: string;
  hero: JourneyHero;
  milestones: Milestones;
  leadershipPhases: LeadershipPhases;
  interviewInsights: InterviewInsights;
  currentFocus: CurrentFocus;
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
interface JourneyState {
  journeyData: JourneyData | null;
  isLoading: boolean;
  fetchJourney: () => Promise<void>;
  updateJourney: (journeyData: Partial<JourneyData>) => Promise<void>;
}

export const useJourneyStore = create<JourneyState>((set) => ({
  journeyData: null,
  isLoading: false,

  // Fetch journey data
  fetchJourney: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/journey");
      set({ journeyData: response.data });
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to fetch journey data");
    } finally {
      set({ isLoading: false });
    }
  },

  // Update journey data
  updateJourney: async (journeyData: Partial<JourneyData>) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put("/journey", journeyData);
      set({ journeyData: response.data });
      toast.success("Journey page updated successfully");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to update journey data");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

