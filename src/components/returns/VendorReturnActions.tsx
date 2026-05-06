"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, Check, Loader2, X } from "lucide-react";
import { vendorConfirmReturn, vendorReportReturnIssue } from "@/lib/api/returns";
import type { ReturnRequest } from "@/types/return";

type VendorReturnActionsProps = {
    request: ReturnRequest;
    onChanged: () => Promise<void> | void;
};

export default function VendorReturnActions({ request, onChanged }: VendorReturnActionsProps) {
    const [mode, setMode] = useState<"issue" | null>(null);
    const [note, setNote] = useState("");
    const [issueReason, setIssueReason] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const [damageFee, setDamageFee] = useState("");
    const [lateFee, setLateFee] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (request.status !== "RETURN_PENDING" || request.returnRecord?.vendorReturnStatus !== "PENDING") {
        return null;
    }

    const handleConfirm = async () => {
        setIsSubmitting(true);
        setError("");

        try {
            await vendorConfirmReturn(request.orderId, {
                note,
                returnedAt: new Date().toISOString(),
            });
            await onChanged();
        } catch (err: any) {
            setError(err.message || "Không thể xác nhận hoàn trả.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReportIssue = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!issueReason.trim()) {
            setError("Vui lòng nhập lý do báo vấn đề.");
            return;
        }

        setIsSubmitting(true);
        try {
            await vendorReportReturnIssue(request.orderId, {
                issueReason,
                issueDescription,
                damageFee: Number(damageFee || 0),
                lateFee: Number(lateFee || 0),
            });
            await onChanged();
        } catch (err: any) {
            setError(err.message || "Không thể báo vấn đề hoàn trả.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-3">
            {error ? (
                <div className="flex gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-[13px] text-[#C62828]">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            ) : null}

            {mode === "issue" ? (
                <form onSubmit={handleReportIssue} className="space-y-3 rounded-xl border border-[#F5C2C7] bg-[#FFF5F5] p-3">
                    <input
                        value={issueReason}
                        onChange={(event) => setIssueReason(event.target.value)}
                        placeholder="Lý do vấn đề"
                        className="w-full rounded-lg border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none"
                    />
                    <textarea
                        value={issueDescription}
                        onChange={(event) => setIssueDescription(event.target.value)}
                        rows={3}
                        placeholder="Mô tả chi tiết"
                        className="w-full resize-none rounded-lg border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            value={damageFee}
                            onChange={(event) => setDamageFee(event.target.value)}
                            type="number"
                            min={0}
                            placeholder="Phí hư hỏng"
                            className="rounded-lg border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none"
                        />
                        <input
                            value={lateFee}
                            onChange={(event) => setLateFee(event.target.value)}
                            type="number"
                            min={0}
                            placeholder="Phí trả trễ"
                            className="rounded-lg border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setMode(null)}
                            className="rounded-xl border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] font-bold"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#842029] px-3 py-2 text-[13px] font-bold text-white disabled:opacity-60"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Gửi vấn đề
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <textarea
                        value={note}
                        onChange={(event) => setNote(event.target.value)}
                        rows={2}
                        placeholder="Ghi chú khi xác nhận nhận hàng"
                        className="w-full resize-none rounded-xl border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setMode("issue")}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F5C2C7] bg-white px-3 py-2 text-[13px] font-bold text-[#842029] hover:bg-[#FFF5F5]"
                        >
                            <X className="h-4 w-4" />
                            Báo vấn đề
                        </button>
                        <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={handleConfirm}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F7B0F] px-3 py-2 text-[13px] font-bold text-white hover:bg-[#0B650B] disabled:opacity-60"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                            Đã nhận hàng
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
