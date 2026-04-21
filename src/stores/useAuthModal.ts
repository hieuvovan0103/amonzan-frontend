import { create } from "zustand";

type AuthModalState = {
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
};

export const useAuthModal = create<AuthModalState>((set) => ({
  isLoginOpen: false,
  openLogin: () => set({ isLoginOpen: true }),
  closeLogin: () => set({ isLoginOpen: false }),
}));