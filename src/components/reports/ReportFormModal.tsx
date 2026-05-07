"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, Flag, Loader2, X } from "lucide-react";

export type ReportFormValues = {
    category: string;
    reason: string;
    detail: string;
};

type ReportFormModalProps = {
    title?: string;
    description?: string;
    subjectLabel?: string;
    submitLabel?: string;
    onClose: () => void;
    onSubmit: (values: ReportFormValues) => Promise<void> | void;
};

const reportCategories = [
    { value: "INAPPROPRIATE_CONTENT", label: "Nội dung không phù hợp" },
    { value: "FALSE_INFORMATION", label: "Thông tin sai sự thật" },
    { value: "HARASSMENT", label: "Quấy rối / xúc phạm" },
    { value: "SPAM", label: "Spam hoặc quảng cáo" },
    { value: "OTHER", label: "Khác" },
];

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export default function ReportFormModal({
    title = "Gửi báo cáo cho admin",
    description = "Vui lòng mô tả rõ vấn đề để đội ngũ quản trị có thể kiểm tra và xử lý.",
    subjectLabel,
    submitLabel = "Gửi báo cáo",
    onClose,
    onSubmit,
}: ReportFormModalProps) {
    const [category, setCategory] = useState(reportCategories[0].value);
    const [reason, setReason] = useState("");
    const [detail, setDetail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (reason.trim().length < 5) {
            setError("Vui lòng nhập lý do báo cáo ít nhất 5 ký tự.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                category,
                reason: reason.trim(),
                detail: detail.trim(),
            });
            onClose();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không thể gửi báo cáo. Vui lòng thử lại."));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[140] flex items-start justify-center overflow-y-auto bg-black/55 p-4 pt-10"
            role="dialog"
            aria-modal="true"
        >
            <div className="w-full max-w-[520px] overflow-hidden rounded-[12px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                <div className="flex items-start justify-between gap-4 border-b border-[#E6E6E6] px-5 py-4">
                    <div>
                        <div className="flex items-center gap-2 text-[18px] font-bold text-[#222222]">
                            <Flag className="h-5 w-5 text-[#C62828]" />
                            {title}
                        </div>
                        <p className="mt-1 text-[13px] leading-5 text-[#565959]">
                            {description}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-[#565959] hover:bg-[#F7F7F7]"
                        aria-label="Đóng form báo cáo"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
                    {subjectLabel ? (
                        <div className="rounded-[8px] border border-[#E6E6E6] bg-[#FAFAFA] px-3 py-2 text-[13px] text-[#222222]">
                            <span className="font-bold">Đối tượng báo cáo:</span> {subjectLabel}
                        </div>
                    ) : null}

                    {error ? (
                        <div className="flex items-start gap-2 rounded-[8px] border border-red-100 bg-red-50 px-3 py-2 text-[13px] font-semibold text-[#842029]">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            {error}
                        </div>
                    ) : null}

                    <label className="block">
                        <span className="text-[13px] font-bold text-[#222222]">Loại báo cáo</span>
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                            className="mt-1 w-full rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-2.5 text-[14px] text-[#222222] outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20"
                        >
                            {reportCategories.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="text-[13px] font-bold text-[#222222]">Lý do chính</span>
                        <input
                            value={reason}
                            onChange={(event) => setReason(event.target.value)}
                            maxLength={160}
                            placeholder="Ví dụ: Nội dung đánh giá xúc phạm người dùng"
                            className="mt-1 w-full rounded-[8px] border border-[#D5D9D9] px-3 py-2.5 text-[14px] text-[#222222] outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20"
                        />
                    </label>

                    <label className="block">
                        <span className="text-[13px] font-bold text-[#222222]">Mô tả chi tiết</span>
                        <textarea
                            value={detail}
                            onChange={(event) => setDetail(event.target.value)}
                            maxLength={700}
                            rows={4}
                            placeholder="Bổ sung ngữ cảnh, bằng chứng hoặc lý do admin cần xem xét..."
                            className="mt-1 w-full resize-none rounded-[8px] border border-[#D5D9D9] px-3 py-2.5 text-[14px] text-[#222222] outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20"
                        />
                    </label>

                    <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-[6px] border border-[#D5D9D9] bg-white px-4 py-2.5 text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#C62828] bg-[#C62828] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#A61B1B] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
