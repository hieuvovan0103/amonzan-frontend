"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";
import ProductReviewStars from "./ProductReviewStars";

type ProductReviewFormProps = {
    isSubmitting: boolean;
    onSubmit: (payload: { rating: number; comment: string }) => Promise<void>;
};

export default function ProductReviewForm({ isSubmitting, onSubmit }: ProductReviewFormProps) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (rating < 1 || rating > 5) {
            setError("Vui lòng chọn số sao từ 1 đến 5.");
            return;
        }

        if (comment.length > 1000) {
            setError("Nội dung đánh giá không được vượt quá 1000 ký tự.");
            return;
        }

        await onSubmit({ rating, comment });
        setComment("");
        setRating(5);
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 rounded-[6px] border border-[#D5D9D9] bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-[14px] font-bold text-[#222222]">Chấm điểm sản phẩm</span>
                <ProductReviewStars
                    value={rating}
                    onChange={setRating}
                    interactive
                    size="h-5 w-5"
                />
            </div>

            <label className="mb-2 block text-[13px] font-semibold text-[#222222]" htmlFor="product-review-comment">
                Nhận xét của bạn
            </label>
            <textarea
                id="product-review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={1000}
                rows={4}
                className="w-full resize-none rounded-[4px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
                placeholder="Chia sẻ trải nghiệm thuê sản phẩm này..."
            />
            <div className="mt-1 flex items-center justify-between text-[12px] text-[#565959]">
                <span>{error}</span>
                <span>{comment.length}/1000</span>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 inline-flex items-center gap-2 rounded-[4px] bg-[#FFD814] px-4 py-2 text-[14px] font-bold text-[#222222] hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Gửi đánh giá
            </button>
        </form>
    );
}
