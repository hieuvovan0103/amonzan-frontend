"use client";

import { X } from "lucide-react";
import AdminDisputeDetailPanel from "@/components/disputes/AdminDisputeDetailPanel";
import type { AdminDisputeDetail } from "@/types/dispute";

type Props = {
    isOpen: boolean;
    dispute: AdminDisputeDetail | null;
    isLoading: boolean;
    onClose: () => void;
};

export default function AdminDisputeDetailModal({ isOpen, dispute, isLoading, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
            <div
                className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[12px] bg-white shadow-xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-[#E6E6E6] px-5 py-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#222222]">Chi tiết tranh chấp</h2>
                        <p className="mt-1 text-[13px] text-[#565959]">
                            {dispute ? `#${dispute.disputeId.slice(0, 8)} • đơn #${dispute.orderId.slice(0, 8)}` : "Đang tải..."}
                        </p>
                    </div>
                    <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-[#F7F7F7]">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-5">
                    <AdminDisputeDetailPanel dispute={dispute} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

