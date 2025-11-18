import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// Popup Type
export interface PopupType {
  _id: string;
  title: string;
  message?: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Popup Input (no id)
export type PopupInput = Omit<PopupType, "_id" | "createdAt" | "updatedAt">;

interface ErrorResponse extends Error {
  response?: {
    status?: number;
    statusText?: string;
    data: {
      message: string;
    };
  };
}

interface PopupState {
  popups: PopupType[];
  isLoading: boolean;

  createPopup: (popupData: PopupInput) => Promise<void>;
  fetchPopups: () => Promise<void>;
  fetchPopupById: (id: string) => Promise<PopupType | null>;
  updatePopup: (id: string, popupData: PopupInput) => Promise<void>;
  deletePopup: (id: string) => Promise<void>;
  activatePopup: (id: string) => Promise<void>; // for turning ON/OFF popups
}

export const usePopupStore = create<PopupState>((set, get) => ({
  popups: [],
  isLoading: false,

  // Create Popup
  createPopup: async (popupData: PopupInput) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post("/popup", popupData);
      set({ popups: [response.data, ...get().popups] });
      toast.success("Popup created");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to create popup");
    } finally {
      set({ isLoading: false });
    }
  },

  // Get All Popups
  fetchPopups: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/popup");
      set({ popups: response.data });
    } catch (error) {
      toast.error("Failed to fetch popups");
    } finally {
      set({ isLoading: false });
    }
  },

  // Get Single Popup
  fetchPopupById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/popup/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch popup");
      return null;
    }
  },

  // Update
  updatePopup: async (id: string, popupData: PopupInput) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/popup/${id}`, popupData);
      set({
        popups: get().popups.map((p) =>
          p._id === id ? response.data : p
        ),
      });
      toast.success("Popup updated");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to update popup");
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete
  deletePopup: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/popup/${id}`);
      set({ popups: get().popups.filter((p) => p._id !== id) });
      toast.success("Popup deleted");
    } catch (error) {
      toast.error("Failed to delete popup");
    } finally {
      set({ isLoading: false });
    }
  },

  // Activate Popup (turn ON/OFF)
  activatePopup: async (id: string) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/popup/activate/${id}`);
      set({ popups: response.data }); 
      toast.success("Popup activation updated");
    } catch (error) {
      toast.error("Failed to activate popup");
    } finally {
      set({ isLoading: false });
    }
  },
}));
