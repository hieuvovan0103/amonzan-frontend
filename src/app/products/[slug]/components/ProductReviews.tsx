"use client";

import { useMemo, useState } from "react";
import { AlertCircle, Loader2, MessageSquarePlus } from "lucide-react";
import RatingBar from "./RatingBar";
import ProductReviewForm from "./ProductReviewForm";
import ProductReviewList from "./ProductReviewList";
import ProductReviewStars from "./ProductReviewStars";
import type { ProductDetail, ProductReview } from "@/lib/api/products";
import {
    createProductReview,
    getProductReviewEligibility,
    getProductReviews,
    updateMyProductReview,
} from "@/lib/api/reviews";
import { useAuthModal } from "@/stores/useAuthModal";
import { useAuthStore } from "@/stores/useAuthStore";

type ProductReviewsProps = {
    product: ProductDetail;
};

function buildDistribution(reviews: ProductReview[]) {
    return reviews.reduce<Record<1 | 2 | 3 | 4 | 5, number>>(
        (acc, review) => {
            const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
            if (rating >= 1 && rating <= 5) {
                acc[rating] += 1;
            }
            return acc;
        },
        { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    );
}

function calculateAverage(reviews: ProductReview[], fallback: number) {
    if (reviews.length === 0) {
        return fallback;
    }

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return Number((total / reviews.length).toFixed(1));
}

export default function ProductReviews({ product }: ProductReviewsProps) {
    const user = useAuthStore((state) => state.user);
    const openLogin = useAuthModal((state) => state.openLogin);
    const [reviews, setReviews] = useState<ProductReview[]>(product.reviews);
    const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingReview, setEditingReview] = useState<ProductReview | null>(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const totalReviews = reviews.length;
    const rating = calculateAverage(reviews, Number(product.rating ?? 0));
    const ratingDistribution = useMemo(() => buildDistribution(reviews), [reviews]);

    const handleWriteReview = async () => {
        setError("");
        setMessage("");

        if (!user) {
            openLogin();
            return;
        }

        setIsCheckingEligibility(true);

        try {
            const eligibility = await getProductReviewEligibility(product.id);
            if (!eligibility.eligible) {
                setShowForm(false);
                setEditingReview(null);
                setMessage(
                    eligibility.message ||
                        "Bạn chỉ có thể đánh giá sản phẩm sau khi hoàn tất đơn thuê.",
                );
                return;
            }

            setEditingReview(eligibility.alreadyReviewed ? eligibility.review : null);
            setShowForm(true);
            setMessage(eligibility.alreadyReviewed ? "Bạn đang chỉnh sửa đánh giá đã gửi." : "");
        } catch (err: any) {
            setError(err.message || "Không thể kiểm tra quyền đánh giá.");
        } finally {
            setIsCheckingEligibility(false);
        }
    };

    const handleSubmitReview = async (payload: { rating: number; comment: string }) => {
        setError("");
        setIsSubmitting(true);

        try {
            if (editingReview) {
                await updateMyProductReview(product.id, payload);
            } else {
                await createProductReview(product.id, payload);
            }
            const refreshed = await getProductReviews(product.id);
            setReviews(refreshed.reviews);
            setShowForm(false);
            setEditingReview(null);
            setMessage(editingReview ? "Bạn đã cập nhật đánh giá sản phẩm này." : "Bạn đã đánh giá sản phẩm này.");
        } catch (err: any) {
            setError(err.message || "Không thể gửi đánh giá.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="danh-gia" className="border-t border-[#E6E6E6] py-8">
            <div className="flex flex-col gap-12 md:flex-row">
                <div className="flex-shrink-0 md:w-[320px]">
                    <h2 className="mb-4 text-[20px] font-bold text-[#222222]">
                        Đánh giá từ khách hàng
                    </h2>

                    <div className="mb-2 flex items-center gap-2">
                        <ProductReviewStars value={Math.round(rating)} size="h-5 w-5" />
                        <span className="text-[18px] font-bold text-[#222222]">
                            {rating.toFixed(1)}/5
                        </span>
                    </div>

                    <p className="mb-6 text-[14px] text-[#565959]">
                        {totalReviews} đánh giá
                    </p>

                    <div className="mb-8">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = ratingDistribution[stars as 1 | 2 | 3 | 4 | 5];
                            const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                            return <RatingBar key={stars} stars={String(stars)} percent={percent} />;
                        })}
                    </div>

                    <div className="border-t border-[#E6E6E6] pt-6">
                        <h3 className="mb-2 text-[16px] font-bold text-[#222222]">
                            Đánh giá sản phẩm này
                        </h3>
                        <p className="mb-4 text-[13px] text-[#565959]">
                            Bạn có thể đánh giá sản phẩm sau khi hoàn tất đơn thuê.
                        </p>

                        <button
                            type="button"
                            onClick={handleWriteReview}
                            disabled={isCheckingEligibility}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#D5D9D9] bg-white px-4 py-2 text-[14px] font-bold text-[#222222] hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isCheckingEligibility ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <MessageSquarePlus className="h-4 w-4" />
                            )}
                            Viết đánh giá
                        </button>

                        {message ? (
                            <div className="mt-3 rounded-[4px] border border-[#D5D9D9] bg-[#F7F7F7] px-3 py-2 text-[13px] text-[#565959]">
                                {message}
                            </div>
                        ) : null}

                        {error ? (
                            <div className="mt-3 flex gap-2 rounded-[4px] border border-red-100 bg-red-50 px-3 py-2 text-[13px] text-[#C62828]">
                                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        ) : null}

                        {showForm ? (
                            <ProductReviewForm
                                isSubmitting={isSubmitting}
                                initialRating={editingReview?.rating ?? 5}
                                initialComment={editingReview?.comment ?? ""}
                                submitLabel={editingReview ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                                onSubmit={handleSubmitReview}
                            />
                        ) : null}
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="mb-6 text-[16px] font-bold text-[#222222]">
                        Nhận xét
                    </h3>
                    <ProductReviewList reviews={reviews} />
                </div>
            </div>
        </section>
    );
}
