import { create } from "zustand";
import type { AdminDisputeDetail } from "@/types/dispute";

type AdminDisputeModalType = "resolve" | "requestEvidence" | null;

type AdminDisputeModalState = {
    modalType: AdminDisputeModalType;
    dispute: AdminDisputeDetail | null;
    openResolve: (dispute: AdminDisputeDetail) => void;
    openRequestEvidence: (dispute: AdminDisputeDetail) => void;
    close: () => void;
};

export const useAdminDisputeModalStore = create<AdminDisputeModalState>((set) => ({
    modalType: null,
    dispute: null,
    openResolve: (dispute) => set({ modalType: "resolve", dispute }),
    openRequestEvidence: (dispute) => set({ modalType: "requestEvidence", dispute }),
    close: () => set({ modalType: null, dispute: null }),
}));
