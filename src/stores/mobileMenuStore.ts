import { create } from "zustand";

type MobileMenuState = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
};

export const useMobileMenuStore = create<MobileMenuState>((set) => ({
  isOpen: false,
  openMenu: () => set({ isOpen: true }),
  closeMenu: () => set({ isOpen: false }),
  toggleMenu: () => set((state) => ({ isOpen: !state.isOpen })),
}));
