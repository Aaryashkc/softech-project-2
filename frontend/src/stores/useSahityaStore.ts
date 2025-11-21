import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// TYPES
export interface Sahitya {
    _id: string;
    title: string;
    slug: string;
    category: "sahitya" | "sangit";
    type: "kavita" | "katha" | "geet" | "aalochana" | "note" | "article";
    content: string;
    tags: string[];
    authorName: string;
    coverImage: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export type SahityaInput = Omit<
    Sahitya,
    "_id" | "slug" | "createdAt" | "updatedAt"
>;

// error
interface ErrorResponse extends Error {
    response?: {
        status?: number;
        statusText?: string;
        data: { message: string };
    };
}

// STORE
interface SahityaState {
    items: Sahitya[];
    isLoading: boolean;

    createSahitya: (data: SahityaInput) => Promise<void>;
    fetchAll: () => Promise<void>;
    fetchById: (id: string) => Promise<Sahitya | null>;
    updateSahitya: (id: string, data: SahityaInput) => Promise<void>;
    deleteSahitya: (id: string) => Promise<void>;
}

export const useSahityaStore = create<SahityaState>((set, get) => ({
    items: [],
    isLoading: false,

    // CREATE
    createSahitya: async (data: SahityaInput) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post("/sahitya", data);
            set({ items: [res.data, ...get().items] });
            toast.success("Content created");
        } catch (error) {
            const err = error as ErrorResponse;
            toast.error(err.response?.data?.message || "Failed to create content");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // READ ALL
    fetchAll: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get("/sahitya");
            set({ items: res.data });
        } catch {
            toast.error("Failed to fetch content");
        } finally {
            set({ isLoading: false });
        }
    },

    // READ ONE
    fetchById: async (id: string) => {
        try {
            const res = await axiosInstance.get(`/sahitya/${id}`);
            return res.data;
        } catch {
            toast.error("Failed to fetch content");
            return null;
        }
    },

    // UPDATE
    updateSahitya: async (id: string, data: SahityaInput) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.put(`/sahitya/${id}`, data);
            set({
                items: get().items.map((item) =>
                    item._id === id ? res.data : item
                ),
            });
            toast.success("Content updated");
        } catch (error) {
            const err = error as ErrorResponse;
            toast.error(err.response?.data?.message || "Failed to update content");
        } finally {
            set({ isLoading: false });
        }
    },

    // DELETE
    deleteSahitya: async (id: string) => {
        set({ isLoading: true });
        try {
            await axiosInstance.delete(`/sahitya/${id}`);
            set({
                items: get().items.filter((item) => item._id !== id),
            });
            toast.success("Content deleted");
        } catch {
            toast.error("Failed to delete content");
        } finally {
            set({ isLoading: false });
        }
    },
}));
