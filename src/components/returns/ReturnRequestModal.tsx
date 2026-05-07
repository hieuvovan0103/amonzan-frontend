"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertCircle, ImagePlus, Loader2, Trash2, X } from "lucide-react";
import { createReturnRequest } from "@/lib/api/returns";
import {
    uploadReturnEvidenceImages,
    validateReturnEvidenceFiles,
} from "@/lib/api/returnEvidenceImages";
import { useReturnModalStore } from "@/stores/returnModalStore";
import type { ReturnConditionStatus } from "@/types/return";

type ReturnRequestModalProps = {
    onSubmitted: () => Promise<void> | void;
};

const CONDITION_OPTIONS: Array<{ value: ReturnConditionStatus; label: string }> = [
    { value: "LIKE_NEW", label: "Như mới" },
    { value: "GOOD", label: "Tốt" },
    { value: "FAIR", label: "Có hao mòn nhẹ" },
    { value: "DAMAGED", label: "Có hư hỏng" },
];

export default function ReturnRequestModal({ onSubmitted }: ReturnRequestModalProps) {
    const { isOpen, order, close } = useReturnModalStore();
    const [note, setNote] = useState("");
    const [conditionStatus, setConditionStatus] = useState<ReturnConditionStatus>("GOOD");
    const [files, setFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

    useEffect(() => {
        return () => previews.forEach((preview) => URL.revokeObjectURL(preview));
    }, [previews]);

    if (!isOpen || !order) return null;

    const handleFilesChange = (fileList: FileList | null) => {
        if (!fileList) return;

        const nextFiles = [...files, ...Array.from(fileList)].slice(0, 6);

        try {
            validateReturnEvidenceFiles(nextFiles);
            setFiles(nextFiles);
            setError("");
        } catch (err: any) {
            setError(err.message || "Không thể chọn ảnh minh chứng.");
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!note.trim()) {
            setError("Vui lòng nhập ghi chú hoàn trả.");
            return;
        }

        setIsSubmitting(true);
        try {
            const evidenceUrls = await uploadReturnEvidenceImages(order.orderId, files);
            await createReturnRequest({
                orderId: order.orderId,
                note,
                conditionStatus,
                evidenceUrls,
            });
            await onSubmitted();
            close();
            setNote("");
            setConditionStatus("GOOD");
            setFiles([]);
        } catch (err: any) {
            setError(err.message || "Không thể gửi yêu cầu hoàn trả.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/55 p-4 pt-10"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    close();
                }
            }}
        >
            <form
                onSubmit={handleSubmit}
                onMouseDown={(event) => event.stopPropagation()}
                className="mb-8 w-full max-w-[560px] rounded-[12px] bg-white shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#E6E6E6] px-5 py-4">
                    <div>
                        <h2 className="text-[20px] font-bold text-[#222222]">Yêu cầu hoàn trả</h2>
                        <p className="mt-1 text-[13px] text-[#565959]">Đơn #{order.orderId.slice(0, 8)}</p>
                    </div>
                    <button type="button" onClick={close} className="rounded-full p-2 text-[#565959] hover:bg-[#F7F7F7]">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 px-5 py-4">
                    <div>
                        <label className="mb-2 block text-[14px] font-semibold text-[#222222]">
                            Tình trạng sản phẩm khi trả
                        </label>
                        <select
                            value={conditionStatus}
                            onChange={(event) => setConditionStatus(event.target.value as ReturnConditionStatus)}
                            className="w-full rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                        >
                            {CONDITION_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-[14px] font-semibold text-[#222222]">Ghi chú hoàn trả</label>
                        <textarea
                            value={note}
                            onChange={(event) => setNote(event.target.value)}
                            rows={3}
                            maxLength={1000}
                            placeholder="Mô tả tình trạng đồ và cách bạn bàn giao lại cho shop."
                            className="w-full resize-none rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
                        />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-[14px] font-semibold text-[#222222]">Ảnh minh chứng</label>
                            <span className="text-[12px] text-[#565959]">{files.length}/6 ảnh</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <label className="flex h-[92px] w-[112px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-[#D5D9D9] bg-[#FAFAFA] text-center text-[13px] font-semibold text-[#007185] hover:bg-[#F7F7F7]">
                                <ImagePlus className="mb-1.5 h-5 w-5" />
                                Tải ảnh
                                <span className="mt-1 text-[10px] font-normal text-[#565959]">JPG/PNG/WebP</span>
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    multiple
                                    className="hidden"
                                    onChange={(event) => {
                                        handleFilesChange(event.target.files);
                                        event.target.value = "";
                                    }}
                                />
                            </label>
                            {files.map((file, index) => (
                                <div key={`${file.name}-${index}`} className="relative h-[92px] w-[92px] overflow-hidden rounded-[8px] border border-[#D5D9D9]">
                                    <img src={previews[index]} alt={`Ảnh minh chứng ${index + 1}`} className="h-full w-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))}
                                        className="absolute right-2 top-2 rounded-full bg-white/95 p-1.5 text-[#842029] shadow-sm hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error ? (
                        <div className="flex gap-2 rounded-[8px] border border-red-100 bg-red-50 px-3 py-2 text-[13px] text-[#C62828]">
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    ) : null}
                </div>

                <div className="flex justify-end gap-3 border-t border-[#E6E6E6] px-5 py-4">
                    <button type="button" onClick={close} className="rounded-[8px] border border-[#D5D9D9] px-5 py-2 text-[14px] font-bold hover:bg-[#F7F7F7]">
                        Hủy
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 rounded-[8px] bg-[#FFD814] px-5 py-2 text-[14px] font-bold text-[#222222] hover:bg-[#F7CA00] disabled:opacity-60"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Gửi yêu cầu
                    </button>
                </div>
            </form>
        </div>
    );
}
