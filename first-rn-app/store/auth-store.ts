import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Plan = "FREE" | "TRIAL" | "PRO";

type AuthState = {
  token: string | null;
  userName: string | null;
  userPlan: Plan | null;
  avatarColor: string | null;
  isAdmin: boolean;
  hasOnboarded: boolean;

  setAuth: (data: {
    token?: string | null;
    userName?: string | null;
    userPlan?: Plan | null;
    avatarColor?: string | null;
    isAdmin?: boolean;
    hasOnboarded?: boolean;
  }) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      userPlan: null,
      avatarColor: null,
      isAdmin: false,
      hasOnboarded: false,

      setAuth: (data) =>
        set((state) => ({
          ...state,
          ...data,
        })),

      logout: () =>
        set({
          token: null,
          userName: null,
          userPlan: null,
          avatarColor: null,
          isAdmin: false,
          hasOnboarded: false,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
        userPlan: state.userPlan,
        avatarColor: state.avatarColor,
        isAdmin: state.isAdmin,
        hasOnboarded: state.hasOnboarded,
      }),
    }
  )
);
