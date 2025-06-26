import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// Gallery type
export interface GalleryType {
  _id: string;
  title: string;
  description: string;
  images: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Gallery input type (without _id or timestamps)
export type GalleryInput = Omit<GalleryType, "_id" | "createdAt" | "updatedAt">;

// Error response type
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
interface GalleryState {
  galleries: GalleryType[];
  isLoading: boolean;
  createGallery: (data: GalleryInput) => Promise<void>;
  fetchGalleries: () => Promise<void>;
  fetchGalleryById: (id: string) => Promise<GalleryType | null>;
  updateGallery: (id: string, data: GalleryInput) => Promise<void>;
  deleteGallery: (id: string) => Promise<void>;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  galleries: [],
  isLoading: false,

  // Create
  createGallery: async (data: GalleryInput) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/gallery/create", data);
      set({ galleries: [response.data, ...get().galleries] });
      toast.success("Gallery created successfully");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to create gallery");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Read all
  fetchGalleries: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/gallery/all");
      set({ galleries: response.data });
    } catch (error) {
      toast.error("Failed to fetch galleries");
    } finally {
      set({ isLoading: false });
    }
  },

  // Read one
  fetchGalleryById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/gallery/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch gallery");
      return null;
    }
  },

  // Update
  updateGallery: async (id: string, data: GalleryInput) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/gallery/${id}`, data);
      set({
        galleries: get().galleries.map((g) => (g._id === id ? response.data : g)),
      });
      toast.success("Gallery updated successfully");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to update gallery");
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete
  deleteGallery: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/gallery/${id}`);
      set({ galleries: get().galleries.filter((g) => g._id !== id) });
      toast.success("Gallery deleted successfully");
    } catch (error) {
      toast.error("Failed to delete gallery");
    } finally {
      set({ isLoading: false });
    }
  },
}));
