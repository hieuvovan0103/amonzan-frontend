"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { resolveAdminDispute } from "@/lib/api/admin-disputes";
import type { AdminDisputeDecision } from "@/types/dispute";
import { useAdminDisputeModalStore } from "@/stores/adminDisputeModalStore";
import { useToastStore } from "@/stores/useToastStore";

const decisionOptions: Array<{ value: AdminDisputeDecision; label: string }> = [
    { value: "FULL_REFUND", label: "Hoàn tiền toàn phần" },
    { value: "PARTIAL_REFUND", label: "Hoàn tiền một phần" },
    { value: "NO_REFUND", label: "Không hoàn tiền" },
    { value: "RELEASE_TO_VENDOR", label: "Chuyển tiền cho vendor" },
    { value: "DEDUCT_DEPOSIT", label: "Trừ tiền cọc" },
    { value: "REFUND_DEPOSIT", label: "Hoàn lại tiền cọc" },
    { value: "SPLIT_AMOUNT", label: "Chia tiền giữa hai bên" },
];

type AdminResolveDisputeModalProps = {
    onResolved: () => Promise<void> | void;
};

export default function AdminResolveDisputeModal({ onResolved }: AdminResolveDisputeModalProps) {
    const { modalType, dispute, close } = useAdminDisputeModalStore();
    const showToast = useToastStore((state) => state.show);
    const [decision, setDecision] = useState<AdminDisputeDecision>("PARTIAL_REFUND");
    const [refundAmount, setRefundAmount] = useState("");
    const [damageFee, setDamageFee] = useState("");
    const [lateFee, setLateFee] = useState("");
    const [resolution, setResolution] = useState("");
    const [adminNote, setAdminNote] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!dispute || modalType !== "resolve") return;

        setDecision((dispute.decision as AdminDisputeDecision | null) ?? "PARTIAL_REFUND");
        setRefundAmount(dispute.refundAmount ? String(dispute.refundAmount) : "");
        setDamageFee(String(dispute.resolvedDamageFee ?? dispute.order.damageFee ?? 0));
        setLateFee(String(dispute.resolvedLateFee ?? dispute.order.lateFee ?? 0));
        setResolution(dispute.resolution ?? "");
        setAdminNote(dispute.adminNote ?? "");
    }, [dispute, modalType]);

    if (modalType !== "resolve" || !dispute) return null;

    const submit = async () => {
        if (resolution.trim().length < 5) {
            showToast("Vui lòng nhập kết luận xử lý ít nhất 5 ký tự.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            await resolveAdminDispute(dispute.disputeId, {
                decision,
                refundAmount: refundAmount === "" ? undefined : Number(refundAmount),
                damageFee: damageFee === "" ? undefined : Number(damageFee),
                lateFee: lateFee === "" ? undefined : Number(lateFee),
                resolution: resolution.trim(),
                adminNote: adminNote.trim() || undefined,
            });
            showToast("Đã xử lý tranh chấp.", "success");
            close();
            await onResolved();
        } catch (err: any) {
            showToast(err.message || "Không thể xử lý tranh chấp.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[12px] bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-[#E6E6E6] px-5 py-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#222222]">Xử lý tranh chấp</h2>
                        <p className="mt-1 text-[13px] text-[#565959]">Đơn #{dispute.orderId.slice(0, 8)}</p>
                    </div>
                    <button type="button" onClick={close} className="rounded-full p-2 hover:bg-[#F7F7F7]">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    <label className="block">
                        <span className="mb-1 block text-[13px] font-bold text-[#222222]">Quyết định</span>
                        <select
                            value={decision}
                            onChange={(event) => setDecision(event.target.value as AdminDisputeDecision)}
                            className="w-full rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185]"
                        >
                            {decisionOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        <label className="block">
                            <span className="mb-1 block text-[13px] font-bold text-[#222222]">Tiền hoàn</span>
                            <input
                                type="number"
                                min="0"
                                value={refundAmount}
                                onChange={(event) => setRefundAmount(event.target.value)}
                                className="w-full rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185]"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-1 block text-[13px] font-bold text-[#222222]">Phí hư hỏng</span>
                            <input
                                type="number"
                                min="0"
                                value={damageFee}
                                onChange={(event) => setDamageFee(event.target.value)}
                                className="w-full rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185]"
                            />
                        </label>
                        <label className="block">
                            <span className="mb-1 block text-[13px] font-bold text-[#222222]">Phí trễ hạn</span>
                            <input
                                type="number"
                                min="0"
                                value={lateFee}
                                onChange={(event) => setLateFee(event.target.value)}
                                className="w-full rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185]"
                            />
                        </label>
                    </div>

                    <label className="block">
                        <span className="mb-1 block text-[13px] font-bold text-[#222222]">Kết luận gửi hai bên</span>
                        <textarea
                            value={resolution}
                            onChange={(event) => setResolution(event.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185]"
                        />
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-[13px] font-bold text-[#222222]">Ghi chú nội bộ</span>
                        <textarea
                            value={adminNote}
                            onChange={(event) => setAdminNote(event.target.value)}
                            rows={3}
                            className="w-full resize-none rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185]"
                        />
                    </label>
                </div>

                <div className="flex justify-end gap-3 border-t border-[#E6E6E6] px-5 py-4">
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-[6px] border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-[6px] bg-[#007600] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#005F00] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Xác nhận xử lý
                    </button>
                </div>
            </div>
        </div>
    );
}
