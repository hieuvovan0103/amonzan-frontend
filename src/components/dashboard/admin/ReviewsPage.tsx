"use client";

import { useEffect, useState } from "react";
import { AlertCircle, EyeOff, Loader2, MessageSquare, Trash2 } from "lucide-react";
import {
    deleteAdminReview,
    getAdminReviews,
    hideAdminReview,
    type AdminReview,
} from "@/lib/api/reviews";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState<string | null>(null);

    const loadReviews = async () => {
        setIsLoading(true);
        setError("");

        try {
            setReviews(await getAdminReviews());
        } catch (err: any) {
            setError(err.message || "Không thể tải danh sách đánh giá.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
    }, []);

    const handleHide = async (reviewId: string) => {
        setBusyId(reviewId);
        setError("");

        try {
            await hideAdminReview(reviewId);
            await loadReviews();
        } catch (err: any) {
            setError(err.message || "Không thể ẩn đánh giá.");
        } finally {
            setBusyId(null);
        }
    };

    const handleDelete = async (reviewId: string) => {
        const confirmed = window.confirm("Bạn chắc chắn muốn xóa đánh giá này?");
        if (!confirmed) return;

        setBusyId(reviewId);
        setError("");

        try {
            await deleteAdminReview(reviewId);
            await loadReviews();
        } catch (err: any) {
            setError(err.message || "Không thể xóa đánh giá.");
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-[22px] font-bold text-[#222222]">
                        Quản lý đánh giá
                    </h2>
                    <p className="text-[14px] text-[#565959]">
                        Theo dõi và xử lý các đánh giá sản phẩm trong marketplace.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-[6px] border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-bold text-[#222222]">
                    <MessageSquare className="h-4 w-4 text-[#007185]" />
                    {reviews.length} đánh giá
                </div>
            </div>

            {error ? (
                <div className="mb-4 flex items-center gap-2 rounded-[6px] border border-red-100 bg-red-50 px-4 py-3 text-[14px] text-[#C62828]">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            ) : null}

            {isLoading ? (
                <div className="rounded-[8px] border border-[#E6E6E6] bg-white p-10 text-center text-[14px] text-[#565959]">
                    <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                    Đang tải đánh giá...
                </div>
            ) : reviews.length === 0 ? (
                <div className="rounded-[8px] border border-[#E6E6E6] bg-white p-12 text-center">
                    <MessageSquare className="mx-auto mb-4 h-14 w-14 text-[#D5D9D9]" />
                    <h3 className="mb-2 text-[18px] font-bold text-[#222222]">
                        Chưa có đánh giá
                    </h3>
                    <p className="text-[14px] text-[#565959]">
                        Đánh giá của người thuê sẽ xuất hiện tại đây sau khi họ hoàn tất đơn thuê.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-[8px] border border-[#E6E6E6] bg-white shadow-sm">
                    <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-[#E6E6E6] bg-[#F7F7F7] text-[#565959]">
                            <tr>
                                <th className="p-4 font-semibold">Người đánh giá</th>
                                <th className="p-4 font-semibold">Sản phẩm</th>
                                <th className="p-4 font-semibold text-center">Sao</th>
                                <th className="p-4 font-semibold">Nội dung</th>
                                <th className="p-4 font-semibold">Ngày tạo</th>
                                <th className="p-4 font-semibold text-center">Trạng thái</th>
                                <th className="p-4 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.map((review) => (
                                <tr
                                    key={review.review_id}
                                    className="border-b border-[#E6E6E6] align-top hover:bg-[#F9FAFB]"
                                >
                                    <td className="p-4">
                                        <div className="font-bold text-[#222222]">{review.reviewer_name}</div>
                                        <div className="text-[12px] text-[#6B7280]">
                                            {review.reviewer_email ?? "Không có email"}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[#565959]">
                                        {review.product?.name ?? "Không rõ sản phẩm"}
                                        {review.product?.shop_name ? (
                                            <div className="text-[12px] text-[#6B7280]">
                                                Shop: {review.product.shop_name}
                                            </div>
                                        ) : null}
                                    </td>
                                    <td className="p-4 text-center font-bold text-[#FFA41C]">
                                        {review.rating}/5
                                    </td>
                                    <td className="max-w-[360px] p-4 text-[#222222]">
                                        {review.comment || (
                                            <span className="italic text-[#565959]">
                                                Không có nhận xét
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-[#565959]">{formatDate(review.created_at)}</td>
                                    <td className="p-4 text-center">
                                        <span
                                            className={`rounded-full px-3 py-1 text-[12px] font-bold ${
                                                review.is_hidden
                                                    ? "bg-[#FEE2E2] text-[#C62828]"
                                                    : "bg-[#E6F4EA] text-[#137333]"
                                            }`}
                                        >
                                            {review.is_hidden ? "Đã ẩn" : "Đang hiển thị"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="inline-flex gap-2">
                                            <button
                                                type="button"
                                                disabled={busyId === review.review_id || review.is_hidden}
                                                onClick={() => handleHide(review.review_id)}
                                                className="inline-flex items-center gap-1 rounded-[4px] border border-[#D5D9D9] bg-white px-3 py-2 font-bold text-[#007185] hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <EyeOff className="h-4 w-4" />
                                                Ẩn
                                            </button>
                                            <button
                                                type="button"
                                                disabled={busyId === review.review_id}
                                                onClick={() => handleDelete(review.review_id)}
                                                className="inline-flex items-center gap-1 rounded-[4px] border border-red-100 bg-white px-3 py-2 font-bold text-[#C62828] hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
