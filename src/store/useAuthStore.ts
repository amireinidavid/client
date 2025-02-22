import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
type User = {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "SUPER_ADMIN";
};

type AuthStore = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAccesToken?: () => Promise<Boolean>;
};

const axiosInstance = axios.create({
  baseURL: API_ROUTES.AUTH,
  withCredentials: true,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/register", {
            name,
            email,
            password,
          });
          set({ isLoading: false });
          return response.data.userId;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Registration failed"
              : "Registratio failed",
          });
          return null;
        }
      },
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await axiosInstance.post("/login", {
            email,
            password,
          });
          set({ isLoading: false, user: response.data.user });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error: axios.isAxiosError(error)
              ? error?.response?.data?.error || "Login failed"
              : "Login failed",
          });
          return false;
        }
      },
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await axios.post(
            `${API_ROUTES.AUTH}/logout`,
            {},
            { withCredentials: true }
          );

          // Clear the user state
          set({ user: null, isLoading: false });

          // Clear cookies from browser
          document.cookie =
            "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie =
            "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

          // Clear localStorage
          localStorage.removeItem("auth-storage");

          // Force page reload to clear all states
          window.location.href = "/auth/login";
        } catch (error) {
          set({
            isLoading: false,
            error: "Logout failed",
          });
          throw error;
        }
      },
      refreshAccesToken: async () => {
        try {
          const response = await axiosInstance.post("/refresh-token");
          if (response.data.success) {
            return true;
          }
          return false;
        } catch (e) {
          console.error(e);
          // If refresh fails, log out the user
          await get().logout();
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
