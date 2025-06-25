import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axios";

// Define the shape of the user object
type User = {
  id: string;
  email: string;
  // Add other user properties as needed
};

// Define the shape of the auth store state
interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  checkAuth: () => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}

// Define the shape of the login data
type LoginData = {
  email: string;
  password: string;
};

// Define the shape of the error response
interface ErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check");
      set({ authUser: response.data });
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (loginData: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", loginData);
      set({ authUser: response.data });
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "An error occurred during login");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      const err = error as ErrorResponse;
      toast.error(err.response?.data?.message || "An error occurred during logout");
    }
  },
}));