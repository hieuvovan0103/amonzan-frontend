"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { createReturnComplaint } from "@/lib/api/returns";
import { useReturnComplaintModalStore } from "@/stores/returnComplaintModalStore";

type ReturnComplaintModalProps = {
    onSubmitted: () => Promise<void> | void;
};

export default function ReturnComplaintModal({ onSubmitted }: ReturnComplaintModalProps) {
    const { isOpen, order, close } = useReturnComplaintModalStore();
    const [title, setTitle] = useState("Khiếu nại kết quả hoàn trả");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen || !order) return null;

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!title.trim() || !description.trim()) {
            setError("Vui lòng nhập tiêu đề và nội dung khiếu nại.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createReturnComplaint(order.orderId, { title, description });
            await onSubmitted();
            close();
            setTitle("Khiếu nại kết quả hoàn trả");
            setDescription("");
        } catch (err: any) {
            setError(err.message || "Không thể gửi khiếu nại.");
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
                className="mb-8 w-full max-w-[520px] rounded-[12px] bg-white shadow-2xl"
            >
                <div className="flex items-start justify-between border-b border-[#E6E6E6] px-5 py-4">
                    <div>
                        <h2 className="text-[20px] font-bold text-[#222222]">Khiếu nại kết quả hoàn trả</h2>
                        <p className="mt-1 text-[13px] text-[#565959]">Đơn #{order.orderId.slice(0, 8)}</p>
                    </div>
                    <button type="button" onClick={close} className="rounded-full p-2 text-[#565959] hover:bg-[#F7F7F7]">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 px-5 py-4">
                    <div>
                        <label className="mb-2 block text-[14px] font-semibold text-[#222222]">Tiêu đề</label>
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="w-full rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-[14px] font-semibold text-[#222222]">Nội dung khiếu nại</label>
                        <textarea
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            rows={5}
                            maxLength={2000}
                            placeholder="Nêu rõ lý do bạn không đồng ý với kết quả xử lý của shop."
                            className="w-full resize-none rounded-[8px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
                        />
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
                        Gửi khiếu nại
                    </button>
                </div>
            </form>
        </div>
    );
}
