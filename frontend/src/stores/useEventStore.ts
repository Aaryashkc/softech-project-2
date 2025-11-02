import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// Event type
export interface EventType {
  _id: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  image: string;
  isComingSoon: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Event creation or update data (no _id or timestamps)
export type EventInput = Omit<EventType, "_id" | "createdAt" | "updatedAt">;

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
interface EventState {
  events: EventType[];
  isLoading: boolean;
  createEvent: (eventData: EventInput) => Promise<void>;
  fetchEvents: () => Promise<void>;
  fetchEventById: (id: string) => Promise<EventType | null>;
  updateEvent: (id: string, eventData: EventInput) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  isLoading: false,

  // Create
  createEvent: async (eventData: EventInput) => {
    set({ isLoading: true });
    try {
      console.log('Sending request to /events/create with data:', eventData);
      const response = await axiosInstance.post("/events/create", eventData);
      console.log('Event created successfully:', response.data);
      set({ events: [response.data, ...get().events] });
      toast.success("Event created successfully");
      return response.data;
    } catch (error) {
      console.error('Error in createEvent:', error);
      const err = error as ErrorResponse;
      const errorMessage = err.response?.data?.message || "Failed to create event";
      console.error('Error details:', {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data
      });
      toast.error(errorMessage);
      throw error; // Re-throw to be handled by the component
    } finally {
      set({ isLoading: false });
    }
  },

  // Read All
  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("/events/all");
      set({ events: response.data });
    } catch (error) {
      toast.error("Failed to fetch events");
    } finally {
      set({ isLoading: false });
    }
  },

  // Read One
  fetchEventById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch event");
      return null;
    }
  },

  // Update
  updateEvent: async (id: string, eventData: EventInput) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(`/events/${id}`, eventData);
      set({
        events: get().events.map((e) => (e._id === id ? response.data : e)),
      });
      toast.success("Event updated successfully");
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "Failed to update event");
    } finally {
      set({ isLoading: false });
    }
  },

  // Delete
  deleteEvent: async (id: string) => {
    set({ isLoading: true });
    try {
      await axiosInstance.delete(`/events/${id}`);
      set({ events: get().events.filter((e) => e._id !== id) });
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    } finally {
      set({ isLoading: false });
    }
  },
}));