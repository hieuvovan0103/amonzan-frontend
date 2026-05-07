import { create } from "zustand";
import type { PaidOrder } from "@/lib/api/orders";

type ReturnComplaintModalStore = {
    isOpen: boolean;
    order: PaidOrder | null;
    open: (order: PaidOrder) => void;
    close: () => void;
};

export const useReturnComplaintModalStore = create<ReturnComplaintModalStore>((set) => ({
    isOpen: false,
    order: null,
    open: (order) => set({ isOpen: true, order }),
    close: () => set({ isOpen: false, order: null }),
}));
