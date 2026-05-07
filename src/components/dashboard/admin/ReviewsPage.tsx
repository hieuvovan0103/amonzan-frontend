"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, EyeOff, Loader2, MessageSquareWarning, Search, Trash2, XCircle } from "lucide-react";
import {
    deleteAdminReview,
    getAdminReviews,
    hideAdminReview,
    type AdminReview,
    updateAdminReviewReportStatus,
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

type ReviewFilter = "ALL" | "REPORTED" | "HIDDEN";

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export default function ReviewsPage() {
    const searchParams = useSearchParams();
    const highlightedReviewId = searchParams.get("reviewId");
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState<string | null>(null);
    const [filter, setFilter] = useState<ReviewFilter>("REPORTED");
    const [keyword, setKeyword] = useState("");

    const loadReviews = async () => {
        setIsLoading(true);
        setError("");

        try {
            setReviews(await getAdminReviews());
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không thể tải danh sách đánh giá."));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            loadReviews();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const handleHide = async (reviewId: string) => {
        setBusyId(reviewId);
        setError("");

        try {
            await hideAdminReview(reviewId);
            await loadReviews();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không thể ẩn đánh giá."));
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
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không thể xóa đánh giá."));
        } finally {
            setBusyId(null);
        }
    };

    const handleReportStatus = async (reviewId: string, status: "RESOLVED" | "DISMISSED") => {
        setBusyId(reviewId);
        setError("");

        try {
            await updateAdminReviewReportStatus(reviewId, status);
            await loadReviews();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không thể cập nhật trạng thái báo cáo."));
        } finally {
            setBusyId(null);
        }
    };

    const filteredReviews = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        return [...reviews]
            .sort((left, right) => {
                const leftPending = left.report_status === "PENDING" ? 1 : 0;
                const rightPending = right.report_status === "PENDING" ? 1 : 0;
                if (leftPending !== rightPending) return rightPending - leftPending;
                return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
            })
            .filter((review) => {
                if (filter === "REPORTED" && review.report_status !== "PENDING") return false;
                if (filter === "HIDDEN" && !review.is_hidden) return false;
                if (!normalizedKeyword) return true;

                return [
                    review.review_id,
                    review.reviewer_name,
                    review.reviewer_email,
                    review.reporter_name,
                    review.reporter_email,
                    review.report_reason,
                    review.product?.name,
                    review.product?.shop_name,
                ]
                    .filter(Boolean)
                    .some((value) => String(value).toLowerCase().includes(normalizedKeyword));
            });
    }, [filter, keyword, reviews]);

    const pendingReportCount = reviews.filter((review) => review.report_status === "PENDING").length;
    const hiddenCount = reviews.filter((review) => review.is_hidden).length;

    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-[22px] font-bold text-[#222222]">
                        Báo cáo đánh giá
                    </h2>
                    <p className="text-[14px] text-[#565959]">
                        Xem, lọc và xử lý các đánh giá bị người dùng báo cáo.
                    </p>
                </div>

                <div className="grid gap-2 text-[13px] font-bold text-[#222222] sm:grid-cols-3">
                    <div className="rounded-[6px] border border-[#F5C2C7] bg-[#FFF5F5] px-4 py-2 text-[#842029]">
                        {pendingReportCount} báo cáo chờ xử lý
                    </div>
                    <div className="rounded-[6px] border border-[#D5D9D9] bg-white px-4 py-2">
                        {reviews.length} đánh giá
                    </div>
                    <div className="rounded-[6px] border border-[#E6E6E6] bg-[#F7F7F7] px-4 py-2 text-[#565959]">
                        {hiddenCount} đã ẩn
                    </div>
                </div>
            </div>

            <div className="mb-4 flex flex-col gap-3 rounded-[8px] border border-[#E6E6E6] bg-white p-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                    {[
                        { value: "REPORTED", label: "Đang bị báo cáo" },
                        { value: "ALL", label: "Tất cả" },
                        { value: "HIDDEN", label: "Đã ẩn" },
                    ].map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setFilter(option.value as ReviewFilter)}
                            className={`rounded-[6px] px-3 py-2 text-[13px] font-bold ${
                                filter === option.value
                                    ? "bg-[#232F3E] text-white"
                                    : "border border-[#D5D9D9] bg-white text-[#222222] hover:bg-[#F7F7F7]"
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full lg:w-[320px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                    <input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Tìm review, người báo cáo, sản phẩm..."
                        className="w-full rounded-[6px] border border-[#D5D9D9] py-2 pl-9 pr-3 text-[13px] outline-none focus:border-[#FF9900]"
                    />
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
            ) : filteredReviews.length === 0 ? (
                <div className="rounded-[8px] border border-[#E6E6E6] bg-white p-12 text-center">
                    <MessageSquareWarning className="mx-auto mb-4 h-14 w-14 text-[#D5D9D9]" />
                    <h3 className="mb-2 text-[18px] font-bold text-[#222222]">
                        Không có báo cáo phù hợp
                    </h3>
                    <p className="text-[14px] text-[#565959]">
                        Thử đổi bộ lọc hoặc từ khóa tìm kiếm.
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
                            {filteredReviews.map((review) => (
                                <tr
                                    key={review.review_id}
                                    className={`border-b border-[#E6E6E6] align-top hover:bg-[#F9FAFB] ${
                                        highlightedReviewId === review.review_id
                                            ? "bg-[#FFF8E1] ring-2 ring-inset ring-[#FF9900]"
                                            : ""
                                    }`}
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
                                        {review.report_status === "PENDING" ? (
                                            <div className="mt-2 rounded-[4px] border border-[#F5C2C7] bg-[#FFF5F5] px-2 py-1 text-[12px] font-semibold text-[#842029]">
                                                Báo cáo: {review.report_reason || "Không có lý do"}
                                                <div className="mt-1 font-normal text-[#565959]">
                                                    Người báo cáo: {review.reporter_name || review.reporter_email || "Không rõ"}
                                                    {review.reported_at ? ` · ${formatDate(review.reported_at)}` : ""}
                                                </div>
                                            </div>
                                        ) : null}
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
                                            {review.report_status === "PENDING" ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        disabled={busyId === review.review_id}
                                                        onClick={() => handleReportStatus(review.review_id, "RESOLVED")}
                                                        className="inline-flex items-center gap-1 rounded-[4px] border border-[#0F7B0F] bg-white px-3 py-2 font-bold text-[#0F7B0F] hover:bg-[#F1FFF4] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4" />
                                                        Xong
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={busyId === review.review_id}
                                                        onClick={() => handleReportStatus(review.review_id, "DISMISSED")}
                                                        className="inline-flex items-center gap-1 rounded-[4px] border border-[#D5D9D9] bg-white px-3 py-2 font-bold text-[#565959] hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                        Bỏ qua
                                                    </button>
                                                </>
                                            ) : null}
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
