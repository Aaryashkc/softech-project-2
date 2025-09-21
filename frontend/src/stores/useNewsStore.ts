import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// News Article Type
export interface NewsArticle {
  _id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  featured: boolean;
  image: string;
  source: string;
  link: string;
  createdAt?: string;
  updatedAt?: string;
}

export type NewsInput = Omit<NewsArticle, "_id" | "createdAt" | "updatedAt">;

// Error type
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
interface NewsState {
  news: NewsArticle[];
  isLoading: boolean;
  createNews: (data: NewsInput) => Promise<void>;
  fetchNews: () => Promise<void>;
  fetchNewsById: (id: string) => Promise<NewsArticle | null>;
  updateNews: (id: string, data: NewsInput) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  news: [],
  isLoading: false,

  // Create
  createNews: async (data: NewsInput) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/news", data);
      set({ news: [response.data, ...get().news] });
      toast.success("News article created");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to create news");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Read All
  fetchNews: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/news");
      set({ news: response.data });
    } catch (error) {
      toast.error("Failed to fetch news");
    } finally {
      set({ isLoading: false });
    }
  },

  // Read One
  fetchNewsById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/news/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch news article");
      return null;
    }
  },

  // Update
  updateNews: async (id: string, data: NewsInput) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/news/${id}`, data);
      set({
        news: get().news.map((n) => (n._id === id ? response.data : n)),
      });
      toast.success("News article updated");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to update news");
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete
  deleteNews: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/news/${id}`);
      set({ news: get().news.filter((n) => n._id !== id) });
      toast.success("News article deleted");
    } catch (error) {
      toast.error("Failed to delete news");
    } finally {
      set({ isLoading: false });
    }
  },
}));
