import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// Interview type
export interface Interview {
  _id: string;
  title: string;
  excerpt: string;
  platform: string;
  featured: boolean;
  image: string;
  link: string;
  createdAt?: string;
  updatedAt?: string;
}

// Input type (excluding _id and timestamps)
export type InterviewInput = Omit<Interview, "_id" | "createdAt" | "updatedAt">;

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
interface InterviewState {
  interviews: Interview[];
  isLoading: boolean;
  createInterview: (data: InterviewInput) => Promise<void>;
  fetchInterviews: () => Promise<void>;
  fetchInterviewById: (id: string) => Promise<Interview | null>;
  updateInterview: (id: string, data: InterviewInput) => Promise<void>;
  deleteInterview: (id: string) => Promise<void>;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  interviews: [],
  isLoading: false,

  // CREATE
  createInterview: async (data: InterviewInput) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/interviews", data);
      set({ interviews: [response.data, ...get().interviews] });
      toast.success("Interview created successfully");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to create interview");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // READ ALL
  fetchInterviews: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/interviews");
      set({ interviews: response.data });
    } catch (error) {
      toast.error("Failed to fetch interviews");
    } finally {
      set({ isLoading: false });
    }
  },

  // READ ONE
  fetchInterviewById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/interviews/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch interview");
      return null;
    }
  },

  // UPDATE
  updateInterview: async (id: string, data: InterviewInput) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/interviews/${id}`, data);
      set({
        interviews: get().interviews.map((i) =>
          i._id === id ? response.data : i
        ),
      });
      toast.success("Interview updated successfully");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to update interview");
    } finally {
      set({ isLoading: false });
    }
  },

  // DELETE
  deleteInterview: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/interviews/${id}`);
      set({
        interviews: get().interviews.filter((i) => i._id !== id),
      });
      toast.success("Interview deleted successfully");
    } catch (error) {
      toast.error("Failed to delete interview");
    } finally {
      set({ isLoading: false });
    }
  },
}));
