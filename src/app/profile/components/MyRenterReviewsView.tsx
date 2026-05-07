"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, MessageSquareText, Star } from "lucide-react";
import { getMyPaidOrders, type PaidOrder } from "@/lib/api/orders";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

export default function MyRenterReviewsView() {
    const [orders, setOrders] = useState<PaidOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        async function loadReviews() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getMyPaidOrders();
                if (!isCancelled) setOrders(data);
            } catch (err: any) {
                if (!isCancelled) {
                    setError(err?.message || "Không thể tải đánh giá từ shop.");
                }
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        }

        loadReviews();

        return () => {
            isCancelled = true;
        };
    }, []);

    const reviews = useMemo(
        () =>
            orders
                .filter((order) => order.renterReview)
                .map((order) => ({
                    ...order.renterReview!,
                    orderId: order.orderId,
                }))
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [orders],
    );

    const averageRating = reviews.length
        ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
        : 0;

    return (
        <section className="rounded-[8px] border border-[#E6E6E6] bg-white">
            <div className="border-b border-[#E6E6E6] px-5 py-4 md:px-6">
                <h2 className="text-[18px] font-bold text-[#222222]">Đánh giá về tôi</h2>
                <p className="mt-1 text-[13px] text-[#565959]">
                    Các nhận xét mà shop đã gửi sau khi bạn hoàn tất đơn thuê.
                </p>
            </div>

            <div className="p-5 md:p-6">
                {isLoading ? (
                    <div className="flex min-h-[260px] items-center justify-center rounded-[8px] border border-dashed border-[#D5D9D9] bg-[#F7F7F7]">
                        <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                    </div>
                ) : error ? (
                    <div className="flex items-start gap-2 rounded-[8px] border border-[#F5C2C7] bg-[#FFF5F5] p-4 text-[14px] font-semibold text-[#842029]">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        {error}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-[8px] border border-dashed border-[#D5D9D9] bg-[#F7F7F7] px-5 py-14 text-center">
                        <MessageSquareText className="mb-3 h-12 w-12 text-[#A0A0A0]" />
                        <h3 className="text-[16px] font-bold text-[#222222]">Chưa có đánh giá từ shop</h3>
                        <p className="mt-1 max-w-[520px] text-[14px] text-[#565959]">
                            Khi shop xác nhận nhận hàng hoàn trả và đánh giá bạn, nhận xét sẽ xuất hiện tại đây.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="grid gap-3 sm:grid-cols-3">
                            <div className="rounded-[8px] border border-[#E6E6E6] bg-[#FFF8E1] p-4">
                                <div className="text-[12px] font-semibold uppercase text-[#565959]">
                                    Điểm trung bình
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-[24px] font-bold text-[#B12704]">
                                    {averageRating}/5
                                    <Star className="h-5 w-5 fill-[#FFA41C] text-[#FFA41C]" />
                                </div>
                            </div>
                            <div className="rounded-[8px] border border-[#E6E6E6] bg-[#FAFAFA] p-4">
                                <div className="text-[12px] font-semibold uppercase text-[#565959]">
                                    Số đánh giá
                                </div>
                                <div className="mt-2 text-[24px] font-bold text-[#222222]">{reviews.length}</div>
                            </div>
                            <div className="rounded-[8px] border border-[#E6E6E6] bg-[#FAFAFA] p-4">
                                <div className="text-[12px] font-semibold uppercase text-[#565959]">
                                    Đánh giá mới nhất
                                </div>
                                <div className="mt-2 text-[16px] font-bold text-[#222222]">
                                    {formatDate(reviews[0].createdAt)}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <article
                                    key={review.reviewId}
                                    className="rounded-[8px] border border-[#E6E6E6] bg-white p-4"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <div className="font-bold text-[#222222]">
                                                Shop {review.shopName}
                                            </div>
                                            <div className="mt-1 text-[12px] text-[#565959]">
                                                Đơn #{review.orderId.slice(0, 8)} · {formatDate(review.createdAt)}
                                            </div>
                                        </div>
                                        <div className="inline-flex items-center gap-1 text-[14px] font-bold text-[#B12704]">
                                            {review.rating}/5
                                            <Star className="h-4 w-4 fill-[#FFA41C] text-[#FFA41C]" />
                                        </div>
                                    </div>
                                    {review.comment ? (
                                        <p className="mt-3 text-[14px] leading-6 text-[#565959]">
                                            {review.comment}
                                        </p>
                                    ) : null}
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
