"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { requestDisputeEvidence } from "@/lib/api/admin-disputes";
import type { EvidenceRequestTarget } from "@/types/dispute";
import { useAdminDisputeModalStore } from "@/stores/adminDisputeModalStore";
import { useToastStore } from "@/stores/useToastStore";

type RequestEvidenceModalProps = {
    onRequested: () => Promise<void> | void;
};

export default function RequestEvidenceModal({ onRequested }: RequestEvidenceModalProps) {
    const { modalType, dispute, close } = useAdminDisputeModalStore();
    const showToast = useToastStore((state) => state.show);
    const [target, setTarget] = useState<EvidenceRequestTarget>("BOTH");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (modalType !== "requestEvidence") return;
        setTarget("BOTH");
        setMessage(dispute?.evidenceRequestMessage ?? "");
    }, [modalType, dispute]);

    if (modalType !== "requestEvidence" || !dispute) return null;

    const submit = async () => {
        if (message.trim().length < 5) {
            showToast("Vui lòng nhập nội dung yêu cầu ít nhất 5 ký tự.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            await requestDisputeEvidence(dispute.disputeId, {
                target,
                message: message.trim(),
            });
            showToast("Đã gửi yêu cầu bổ sung bằng chứng.", "success");
            close();
            await onRequested();
        } catch (err: any) {
            showToast(err.message || "Không thể yêu cầu bổ sung bằng chứng.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-[12px] bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-[#E6E6E6] px-5 py-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#222222]">Yêu cầu bổ sung bằng chứng</h2>
                        <p className="mt-1 text-[13px] text-[#565959]">Đơn #{dispute.orderId.slice(0, 8)}</p>
                    </div>
                    <button type="button" onClick={close} className="rounded-full p-2 hover:bg-[#F7F7F7]">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 p-5">
                    <label className="block">
                        <span className="mb-1 block text-[13px] font-bold text-[#222222]">Yêu cầu bên nào</span>
                        <select
                            value={target}
                            onChange={(event) => setTarget(event.target.value as EvidenceRequestTarget)}
                            className="w-full rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185]"
                        >
                            <option value="RENTER">Người thuê</option>
                            <option value="VENDOR">Vendor/shop</option>
                            <option value="BOTH">Cả hai bên</option>
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-1 block text-[13px] font-bold text-[#222222]">Nội dung yêu cầu</span>
                        <textarea
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            rows={4}
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
                        className="inline-flex items-center gap-2 rounded-[6px] bg-[#232F3E] px-4 py-2 text-[13px] font-bold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Gửi yêu cầu
                    </button>
                </div>
            </div>
        </div>
    );
}
