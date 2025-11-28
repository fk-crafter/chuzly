import { create } from "zustand";

type AuthState = {
  token: string | null;
  userName: string | null;
  userPlan: string | null;

  setAuth: (data: {
    token: string;
    userName: string;
    userPlan: string;
  }) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  userName: null,
  userPlan: null,

  setAuth: ({ token, userName, userPlan }) =>
    set(() => ({
      token,
      userName,
      userPlan,
    })),

  logout: () =>
    set(() => ({
      token: null,
      userName: null,
      userPlan: null,
    })),
}));
