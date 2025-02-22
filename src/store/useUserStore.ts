import { create } from "zustand";
import axios from "axios";
import { API_ROUTES } from "@/utils/api";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "SUPER_ADMIN";
  createdAt: string;
}

interface UserStore {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
}

const axiosInstance = axios.create({
  baseURL: API_ROUTES.USER,
  withCredentials: true,
});

export const useUserStore = create<UserStore>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/profile");
      set({ profile: response.data.user, isLoading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to fetch profile"
          : "Failed to fetch profile",
        isLoading: false,
      });
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch("/profile", data);
      set({ profile: response.data.user, isLoading: false });
    } catch (error) {
      set({
        error: axios.isAxiosError(error)
          ? error.response?.data?.error || "Failed to update profile"
          : "Failed to update profile",
        isLoading: false,
      });
    }
  },

  clearProfile: () => {
    set({ profile: null, error: null });
  },
}));
