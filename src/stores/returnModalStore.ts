import { create } from "zustand";
import type { PaidOrder } from "@/lib/api/orders";

type ReturnModalStore = {
    isOpen: boolean;
    order: PaidOrder | null;
    open: (order: PaidOrder) => void;
    close: () => void;
};

export const useReturnModalStore = create<ReturnModalStore>((set) => ({
    isOpen: false,
    order: null,
    open: (order) => set({ isOpen: true, order }),
    close: () => set({ isOpen: false, order: null }),
}));
