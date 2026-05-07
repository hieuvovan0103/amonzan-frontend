"use client";

import type { ProductReview } from "@/lib/api/products";
import { reportReview } from "@/lib/api/reviews";
import ProductReviewStars from "./ProductReviewStars";

type ProductReviewListProps = {
    reviews: ProductReview[];
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

export default function ProductReviewList({ reviews }: ProductReviewListProps) {
    const handleReport = async (reviewId: string) => {
        const reason = window.prompt("Nhập lý do báo cáo đánh giá này:");
        if (!reason?.trim()) return;
        await reportReview(reviewId, reason.trim());
        window.alert("Đã gửi báo cáo đánh giá đến admin.");
    };

    if (reviews.length === 0) {
        return (
            <div className="rounded-[6px] border border-dashed border-[#D5D9D9] bg-[#F7F7F7] px-5 py-8 text-center">
                <p className="text-[14px] font-semibold text-[#222222]">
                    Chưa có đánh giá cho sản phẩm này.
                </p>
                <p className="mt-1 text-[13px] text-[#565959]">
                    Các đánh giá thật sẽ xuất hiện sau khi khách hàng hoàn tất đơn thuê.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <article key={review.id} className="border-b border-[#E6E6E6] pb-6 last:border-b-0">
                    <div className="mb-2 flex items-center justify-between gap-3">
                        <div>
                            <div className="text-[14px] font-bold text-[#222222]">
                                {review.reviewerName}
                            </div>
                            <span className="text-[12px] text-[#565959]">
                                Đánh giá vào ngày {formatDate(review.createdAt)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <ProductReviewStars value={review.rating} size="h-3.5 w-3.5" />
                            <span className="text-[13px] font-bold text-[#222222]">
                                {review.rating}/5
                            </span>
                        </div>
                    </div>

                    {review.comment ? (
                        <p className="text-[14px] leading-[1.6] text-[#222222]">
                            {review.comment}
                        </p>
                    ) : (
                        <p className="text-[14px] italic text-[#565959]">
                            Người thuê không để lại nhận xét.
                        </p>
                    )}
                    <button
                        type="button"
                        onClick={() => handleReport(review.id)}
                        className="mt-3 text-[12px] font-semibold text-[#842029] hover:underline"
                    >
                        Báo cáo đánh giá
                    </button>
                </article>
            ))}
        </div>
    );
}
