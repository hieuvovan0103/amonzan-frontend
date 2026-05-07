"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Check, ImageIcon, Loader2, PackageCheck, RefreshCw, Star, X } from "lucide-react";
import {
    approveEarlyReturn,
    approveVendorOrder,
    confirmReturnReceived,
    getVendorEarlyReturnRequests,
    getVendorOrders,
    rejectEarlyReturn,
    rejectVendorOrder,
    reviewRenter,
} from "@/lib/api/vendor";
import type { VendorEarlyReturnRequest, VendorOrder } from "@/types/vendor";

function formatPrice(value: number) {
    return value.toLocaleString("vi-VN");
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

function RenterReviewHistory({
    summary,
    reviews,
}: {
    summary?: { averageRating: number; count: number };
    reviews?: Array<{ reviewId: string; rating: number; comment: string | null; shopName: string; createdAt: string }>;
}) {
    const safeReviews = reviews ?? [];

    return (
        <div className="mt-3 rounded-xl border border-[#E6E6E6] bg-white p-3 text-[12px]">
            <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[#222222]">Lịch sử đánh giá người thuê</span>
                <span className="inline-flex items-center gap-1 font-bold text-[#B12704]">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {Number(summary?.averageRating ?? 0).toFixed(1)} ({summary?.count ?? 0})
                </span>
            </div>
            {safeReviews.length ? (
                <div className="mt-2 space-y-2">
                    {safeReviews.slice(0, 3).map((review) => (
                        <div key={review.reviewId} className="rounded-lg bg-[#FAFAFA] p-2 text-[#565959]">
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-[#222222]">{review.shopName}</span>
                                <span className="inline-flex items-center gap-1 text-[#B12704]">
                                    <Star className="h-3 w-3 fill-current" />
                                    {review.rating}/5
                                </span>
                            </div>
                            {review.comment ? <p className="mt-1 line-clamp-2">{review.comment}</p> : null}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="mt-2 text-[#565959]">Chưa có cửa hàng nào đánh giá người thuê này.</p>
            )}
        </div>
    );
}

export default function VendorOrdersView() {
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [earlyReturnRequests, setEarlyReturnRequests] = useState<VendorEarlyReturnRequest[]>([]);
    const [viewMode, setViewMode] = useState<"orders" | "early_returns">("orders");
    const [isLoading, setIsLoading] = useState(true);
    const [actionOrderId, setActionOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [rejectingEarlyReturnId, setRejectingEarlyReturnId] = useState<string | null>(null);
    const [earlyReturnRejectReason, setEarlyReturnRejectReason] = useState("");
    const [returnReceiveRequest, setReturnReceiveRequest] = useState<VendorEarlyReturnRequest | null>(null);
    const [returnConditionNote, setReturnConditionNote] = useState("Hàng trả bình thường.");
    const [returnDamaged, setReturnDamaged] = useState(false);
    const [renterReviewRating, setRenterReviewRating] = useState(5);
    const [renterReviewComment, setRenterReviewComment] = useState("");

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (viewMode === "orders") {
                const data = await getVendorOrders("PENDING_VENDOR_APPROVAL");
                setOrders(data);
            } else {
                const data = await getVendorEarlyReturnRequests();
                setEarlyReturnRequests(data);
            }
        } catch (err: any) {
            setError(err?.message || "Không thể tải đơn thuê.");
        } finally {
            setIsLoading(false);
        }
    }, [viewMode]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleReview = async (orderId: string, action: "approve" | "reject") => {
        setActionOrderId(orderId);
        setError(null);

        try {
            if (action === "approve") {
                await approveVendorOrder(orderId);
            } else {
                await rejectVendorOrder(orderId);
            }

            await loadOrders();
        } catch (err: any) {
            setError(err?.message || "Không thể cập nhật đơn thuê.");
        } finally {
            setActionOrderId(null);
        }
    };

    const handleEarlyReturnAction = async (
        request: VendorEarlyReturnRequest,
        action: "approve" | "reject" | "received",
    ) => {
        setActionOrderId(request.orderId);
        setError(null);

        try {
            if (action === "approve") {
                await approveEarlyReturn(request.orderId);
            } else if (action === "reject") {
                setRejectingEarlyReturnId(request.orderId);
                setEarlyReturnRejectReason("");
                return;
            } else {
                setReturnReceiveRequest(request);
                setReturnConditionNote("Hàng trả bình thường.");
                setReturnDamaged(false);
                setRenterReviewRating(5);
                setRenterReviewComment("");
                return;
            }

            await loadOrders();
        } catch (err: any) {
            setError(err?.message || "Không thể cập nhật yêu cầu trả sớm.");
        } finally {
            setActionOrderId(null);
        }
    };

    const handleRejectEarlyReturnWithReason = async (request: VendorEarlyReturnRequest) => {
        setActionOrderId(request.orderId);
        setError(null);

        if (!earlyReturnRejectReason.trim()) {
            setError("Vui lòng nhập lý do từ chối yêu cầu trả sớm.");
            setActionOrderId(null);
            return;
        }

        try {
            await rejectEarlyReturn(request.orderId, earlyReturnRejectReason.trim());
            setRejectingEarlyReturnId(null);
            setEarlyReturnRejectReason("");
            await loadOrders();
        } catch (err: any) {
            setError(err?.message || "Không thể từ chối yêu cầu trả sớm.");
        } finally {
            setActionOrderId(null);
        }
    };

    const openReturnReceiveModal = (request: VendorEarlyReturnRequest) => {
        setReturnReceiveRequest(request);
        setReturnConditionNote("Hàng trả bình thường.");
        setReturnDamaged(false);
        setRenterReviewRating(5);
        setRenterReviewComment("");
        setError(null);
    };

    const closeReturnReceiveModal = () => {
        if (actionOrderId === returnReceiveRequest?.orderId) return;
        setReturnReceiveRequest(null);
        setReturnConditionNote("Hàng trả bình thường.");
        setReturnDamaged(false);
        setRenterReviewRating(5);
        setRenterReviewComment("");
    };

    const handleConfirmReturnReceived = async () => {
        if (!returnReceiveRequest) return;

        setActionOrderId(returnReceiveRequest.orderId);
        setError(null);

        try {
            await confirmReturnReceived(returnReceiveRequest.orderId, {
                returnedAt: new Date().toISOString(),
                returnConditionNote: returnConditionNote.trim(),
                damaged: returnDamaged,
            });

            await reviewRenter(returnReceiveRequest.orderId, {
                rating: renterReviewRating,
                comment: renterReviewComment.trim(),
            });

            setReturnReceiveRequest(null);
            setReturnConditionNote("Hàng trả bình thường.");
            setReturnDamaged(false);
            setRenterReviewRating(5);
            setRenterReviewComment("");
            await loadOrders();
        } catch (err: any) {
            setError(err?.message || "Không thể xác nhận đã nhận hàng hoàn trả.");
        } finally {
            setActionOrderId(null);
        }
    };

    return (
        <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-[#E0E4E8] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-[#222222]">Duyệt đơn thuê</h1>
                    <p className="mt-1 text-[13px] text-[#565959]">
                        Các đơn chờ duyệt và yêu cầu trả hàng sớm từ người thuê.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setViewMode("orders")}
                        className={`rounded-xl border px-4 py-2 text-[13px] font-semibold ${
                            viewMode === "orders"
                                ? "border-[#FF9900] bg-[#FFF8E1] text-[#222222]"
                                : "border-[#D5D9D9] bg-white text-[#565959]"
                        }`}
                    >
                        Đơn chờ duyệt
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("early_returns")}
                        className={`rounded-xl border px-4 py-2 text-[13px] font-semibold ${
                            viewMode === "early_returns"
                                ? "border-[#FF9900] bg-[#FFF8E1] text-[#222222]"
                                : "border-[#D5D9D9] bg-white text-[#565959]"
                        }`}
                    >
                        Yêu cầu trả sớm
                    </button>
                    <button
                        type="button"
                        onClick={loadOrders}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-semibold text-[#222222] hover:bg-[#F7F7F7]"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Làm mới
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-xl border border-[#F5C2C7] bg-[#FFF5F5] p-4 text-[13px] font-semibold text-[#842029]">
                    {error}
                </div>
            )}

            {isLoading ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#E0E4E8] bg-white">
                    <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                </div>
            ) : viewMode === "early_returns" ? (
                earlyReturnRequests.length === 0 ? (
                    <div className="rounded-2xl border border-[#E0E4E8] bg-white p-8 text-center text-[14px] text-[#565959]">
                        Hiện chưa có yêu cầu trả hàng sớm.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {earlyReturnRequests.map((request) => (
                            <article
                                key={request.requestId}
                                className="overflow-hidden rounded-2xl border border-[#E0E4E8] bg-white shadow-sm"
                            >
                                <div className="flex flex-col gap-4 border-b border-[#E6E6E6] p-5 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="text-[16px] font-bold text-[#222222]">
                                                Đơn #{request.orderId.slice(0, 8)}
                                            </h2>
                                            <span className="rounded-full bg-[#FFF8E1] px-2.5 py-1 text-[11px] font-bold text-[#8A5A00]">
                                                {request.status === "PENDING" && "Chờ xử lý"}
                                                {request.status === "APPROVED" && "Đã chấp nhận"}
                                                {request.status === "REJECTED" && "Đã từ chối"}
                                                {request.status === "RECEIVED" && "Đã nhận hàng"}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-[13px] text-[#565959]">
                                            Thuê ban đầu: {formatDate(request.order.rentalStart)} - {formatDate(request.originalRentalEnd)}
                                        </p>
                                        <p className="mt-1 text-[13px] font-semibold text-[#007185]">
                                            Khách muốn trả: {formatDate(request.requestedReturnAt)}
                                        </p>
                                    </div>

                                    <div className="rounded-xl border border-[#E6E6E6] bg-[#F7F7F7] p-3 text-[13px]">
                                        <div className="font-bold text-[#222222]">{request.renter.fullName}</div>
                                        <div className="mt-1 text-[#565959]">{request.renter.phoneNumber || request.renter.email || "Không có liên hệ"}</div>
                                        <div className="mt-1 font-bold text-[#B12704]">
                                            Hoàn dự kiến: {formatPrice(request.estimatedRefundAmount)}đ
                                        </div>
                                        <RenterReviewHistory
                                            summary={request.renter.reviewSummary}
                                            reviews={request.renter.reviews}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
                                    <div className="space-y-3">
                                        {request.items.map((item) => (
                                            <div key={item.orderItemId} className="flex gap-3">
                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-[#E6E6E6] bg-[#F7F7F7]">
                                                    {item.productImage && (
                                                        <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-[#222222]">{item.productName}</div>
                                                    <div className="mt-1 text-[13px] text-[#565959]">
                                                        {item.variantName || "Mặc định"} x {item.quantity}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="rounded-xl border border-[#E6E6E6] bg-[#FAFAFA] p-3 text-[13px] text-[#565959]">
                                            Ghi chú khách: {request.reason || "Không có ghi chú"}
                                        </div>
                                        {request.conditionImageUrls?.length ? (
                                            <div className="rounded-xl border border-[#E6E6E6] bg-[#FAFAFA] p-3">
                                                <div className="mb-2 text-[13px] font-bold text-[#222222]">
                                                    Ảnh hiện trạng khách gửi
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                                                    {request.conditionImageUrls.map((imageUrl, index) => (
                                                        <a
                                                            key={`${imageUrl}-${index}`}
                                                            href={imageUrl}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="block aspect-square overflow-hidden rounded-lg border border-[#E6E6E6] bg-white"
                                                        >
                                                            <img
                                                                src={imageUrl}
                                                                alt={`Ảnh hiện trạng ${index + 1}`}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>

                                    <div className="space-y-2">
                                        {request.status === "PENDING" && (
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    type="button"
                                                    disabled={actionOrderId === request.orderId}
                                                    onClick={() => {
                                                        setRejectingEarlyReturnId(request.orderId);
                                                        setEarlyReturnRejectReason("");
                                                        setError(null);
                                                    }}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F5C2C7] bg-white px-3 py-2 text-[13px] font-bold text-[#842029] hover:bg-[#FFF5F5] disabled:opacity-60"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Từ chối
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={actionOrderId === request.orderId}
                                                    onClick={() => handleEarlyReturnAction(request, "approve")}
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F7B0F] bg-[#0F7B0F] px-3 py-2 text-[13px] font-bold text-white hover:bg-[#0B650B] disabled:opacity-60"
                                                >
                                                    <Check className="h-4 w-4" />
                                                    Chấp nhận
                                                </button>
	                                            </div>
	                                        )}
                                            {rejectingEarlyReturnId === request.orderId ? (
                                                <div className="rounded-xl border border-[#F5C2C7] bg-[#FFF5F5] p-3">
                                                    <label className="mb-2 block text-[13px] font-bold text-[#842029]">
                                                        Lý do từ chối
                                                    </label>
                                                    <textarea
                                                        value={earlyReturnRejectReason}
                                                        onChange={(event) => setEarlyReturnRejectReason(event.target.value)}
                                                        rows={3}
                                                        maxLength={1000}
                                                        placeholder="Ví dụ: Shop chưa thể nhận trả sớm vào thời điểm này."
                                                        className="w-full resize-none rounded-lg border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] text-[#222222] outline-none focus:border-[#842029] focus:ring-1 focus:ring-[#842029]"
                                                    />
                                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                                        <button
                                                            type="button"
                                                            disabled={actionOrderId === request.orderId}
                                                            onClick={() => {
                                                                setRejectingEarlyReturnId(null);
                                                                setEarlyReturnRejectReason("");
                                                                setError(null);
                                                            }}
                                                            className="rounded-xl border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7] disabled:opacity-60"
                                                        >
                                                            Hủy
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={actionOrderId === request.orderId}
                                                            onClick={() => handleRejectEarlyReturnWithReason(request)}
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#842029] px-3 py-2 text-[13px] font-bold text-white hover:bg-[#6F1A22] disabled:opacity-60"
                                                        >
                                                            {actionOrderId === request.orderId ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                                            Xác nhận từ chối
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
	                                        {request.status === "APPROVED" && (
                                            <button
                                                type="button"
                                                disabled={actionOrderId === request.orderId}
                                                onClick={() => openReturnReceiveModal(request)}
                                                className="w-full rounded-xl border border-[#007185] bg-white px-3 py-2 text-[13px] font-bold text-[#007185] hover:bg-[#F0F8FF] disabled:opacity-60"
                                            >
                                                Xác nhận đã nhận hàng
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )
            ) : orders.length === 0 ? (
                <div className="rounded-2xl border border-[#E0E4E8] bg-white p-8 text-center text-[14px] text-[#565959]">
                    Hiện chưa có đơn thuê nào chờ duyệt.
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <article
                            key={order.orderId}
                            className="overflow-hidden rounded-2xl border border-[#E0E4E8] bg-white shadow-sm"
                        >
                            <div className="flex flex-col gap-4 border-b border-[#E6E6E6] p-5 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-[16px] font-bold text-[#222222]">
                                            Đơn #{order.orderId.slice(0, 8)}
                                        </h2>
                                        <span className="rounded-full bg-[#FFF8E1] px-2.5 py-1 text-[11px] font-bold text-[#8A5A00]">
                                            Chờ shop duyệt
                                        </span>
                                    </div>

                                    <p className="mt-1 text-[13px] text-[#565959]">
                                        {formatDate(order.rentalStart)} - {formatDate(order.rentalEnd)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#E6E6E6] bg-[#F7F7F7] p-3 text-[13px]">
                                    <div className="font-bold text-[#222222]">{order.renter.fullName}</div>
                                    <div className="mt-1 flex items-center gap-1 text-[#B12704]">
                                        <Star className="h-3.5 w-3.5 fill-current" />
                                        Điểm uy tín: {order.renter.reputationScore.toFixed(1)}
                                    </div>
                                    <div className="mt-1 text-[#565959]">
                                        Điểm phạt: {order.renter.penaltyPoints.toFixed(1)}
                                    </div>
                                    <RenterReviewHistory
                                        summary={order.renter.reviewSummary}
                                        reviews={order.renter.reviews}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-5 p-5 lg:grid-cols-[1fr_300px]">
                                <div className="space-y-3">
                                    {order.items.map((item) => (
                                        <div key={item.orderItemId} className="flex gap-3">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-[#E6E6E6] bg-[#F7F7F7]">
                                                {item.productImage && (
                                                    <img
                                                        src={item.productImage}
                                                        alt={item.productName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-[#222222]">
                                                    {item.productName}
                                                </div>
                                                <div className="mt-1 text-[13px] text-[#565959]">
                                                    {item.variantName || "Mặc định"} x {item.quantity}
                                                </div>
                                                <div className="mt-1 text-[13px] font-bold text-[#B12704]">
                                                    {formatPrice(item.lineSubtotal)}đ
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <div className="rounded-xl border border-[#E6E6E6] p-4 text-[13px]">
                                        <div className="flex justify-between">
                                            <span className="text-[#565959]">Tổng thanh toán</span>
                                            <span className="font-bold text-[#B12704]">
                                                {formatPrice(order.totalAmount)}đ
                                            </span>
                                        </div>
                                        <div className="mt-2 text-[#565959]">
                                            Giao tới: {order.address?.fullAddress || "Chưa có địa chỉ"}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            disabled={actionOrderId === order.orderId}
                                            onClick={() => handleReview(order.orderId, "reject")}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#F5C2C7] bg-white px-3 py-2 text-[13px] font-bold text-[#842029] hover:bg-[#FFF5F5] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <X className="h-4 w-4" />
                                            Từ chối
                                        </button>
                                        <button
                                            type="button"
                                            disabled={actionOrderId === order.orderId}
                                            onClick={() => handleReview(order.orderId, "approve")}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F7B0F] bg-[#0F7B0F] px-3 py-2 text-[13px] font-bold text-white hover:bg-[#0B650B] disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Check className="h-4 w-4" />
                                            Chấp nhận
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {returnReceiveRequest ? (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5">
                    <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                        <div className="flex items-start justify-between gap-4 border-b border-[#E6E6E6] px-5 py-4">
                            <div className="flex min-w-0 gap-3">
                                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-[#E6F4F1] text-[#007185]">
                                    <PackageCheck className="h-5 w-5" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-[18px] font-bold text-[#222222]">
                                        Xác nhận đã nhận hàng hoàn trả
                                    </h2>
                                    <p className="mt-1 text-[13px] text-[#565959]">
                                        Kiểm tra thông tin, ảnh hiện trạng và ghi chú trước khi hoàn tất đơn #
                                        {returnReceiveRequest.orderId.slice(0, 8)}.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={closeReturnReceiveModal}
                                disabled={actionOrderId === returnReceiveRequest.orderId}
                                className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#D5D9D9] bg-white text-[#565959] hover:bg-[#F7F7F7] disabled:opacity-60"
                                aria-label="Đóng"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="overflow-y-auto px-5 py-4">
                            <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                                <div className="space-y-4">
                                    <div className="grid gap-3 rounded-xl border border-[#E6E6E6] bg-[#FAFAFA] p-4 text-[13px] sm:grid-cols-2">
                                        <div>
                                            <div className="text-[#565959]">Người thuê</div>
                                            <div className="mt-1 font-bold text-[#222222]">
                                                {returnReceiveRequest.renter.fullName}
                                            </div>
                                            <div className="mt-1 text-[#565959]">
                                                {returnReceiveRequest.renter.phoneNumber ||
                                                    returnReceiveRequest.renter.email ||
                                                    "Không có liên hệ"}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[#565959]">Thời gian trả</div>
                                            <div className="mt-1 font-bold text-[#222222]">
                                                Khách muốn trả: {formatDate(returnReceiveRequest.requestedReturnAt)}
                                            </div>
                                            <div className="mt-1 text-[#565959]">
                                                Hạn gốc: {formatDate(returnReceiveRequest.originalRentalEnd)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-[14px] font-bold text-[#222222]">Sản phẩm hoàn trả</h3>
                                        {returnReceiveRequest.items.map((item) => (
                                            <div
                                                key={item.orderItemId}
                                                className="flex gap-3 rounded-xl border border-[#E6E6E6] bg-white p-3"
                                            >
                                                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-[#E6E6E6] bg-[#F7F7F7]">
                                                    {item.productImage ? (
                                                        <img
                                                            src={item.productImage}
                                                            alt={item.productName}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-bold text-[#222222]">{item.productName}</div>
                                                    <div className="mt-1 text-[13px] text-[#565959]">
                                                        {item.variantName || "Mặc định"} x {item.quantity}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <label className="block">
                                        <span className="mb-2 block text-[14px] font-bold text-[#222222]">
                                            Ghi chú tình trạng hàng trả
                                        </span>
                                        <textarea
                                            value={returnConditionNote}
                                            onChange={(event) => setReturnConditionNote(event.target.value)}
                                            rows={4}
                                            maxLength={1000}
                                            className="w-full resize-none rounded-xl border border-[#D5D9D9] bg-white px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
                                            placeholder="Ví dụ: Hàng trả đầy đủ phụ kiện, không có hư hỏng."
                                        />
                                    </label>

                                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#F0C36D] bg-[#FFF8E1] p-3">
                                        <input
                                            type="checkbox"
                                            checked={returnDamaged}
                                            onChange={(event) => setReturnDamaged(event.target.checked)}
                                            className="mt-1 h-4 w-4 rounded border-[#D5D9D9] text-[#B12704] focus:ring-[#B12704]"
                                        />
                                        <span className="min-w-0 text-[13px] text-[#565959]">
                                            <span className="block font-bold text-[#222222]">
                                                Hàng có hư hỏng hoặc cần xử lý thêm
                                            </span>
                                            Bật tùy chọn này nếu shop cần ghi nhận tình trạng bất thường khi nhận hàng.
                                        </span>
                                    </label>

                                    <div className="rounded-xl border border-[#E6E6E6] bg-white p-4">
                                        <div className="text-[14px] font-bold text-[#222222]">
                                            Đánh giá người thuê
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-1 text-[#FFA41C]">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRenterReviewRating(star)}
                                                    className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-[#FFA41C]"
                                                    aria-label={`Chọn ${star} sao`}
                                                >
                                                    <Star
                                                        className={`h-5 w-5 fill-current ${
                                                            star <= renterReviewRating ? "" : "text-[#D5D9D9]"
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={renterReviewComment}
                                            onChange={(event) => setRenterReviewComment(event.target.value)}
                                            rows={3}
                                            maxLength={1000}
                                            className="mt-3 w-full resize-none rounded-xl border border-[#D5D9D9] bg-white px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
                                            placeholder="Ví dụ: Khách trả hàng đúng hẹn, giao tiếp tốt, sản phẩm còn nguyên trạng."
                                        />
                                    </div>
                                </div>

                                <aside className="space-y-3">
                                    <div className="rounded-xl border border-[#E6E6E6] bg-[#F7F7F7] p-4 text-[13px]">
                                        <div className="text-[#565959]">Hoàn dự kiến</div>
                                        <div className="mt-1 text-[18px] font-bold text-[#B12704]">
                                            {formatPrice(returnReceiveRequest.estimatedRefundAmount)}đ
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-[#E6E6E6] bg-[#FAFAFA] p-4">
                                        <div className="mb-2 flex items-center gap-2 text-[14px] font-bold text-[#222222]">
                                            <ImageIcon className="h-4 w-4 text-[#565959]" />
                                            Ảnh khách gửi
                                        </div>
                                        {returnReceiveRequest.conditionImageUrls?.length ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {returnReceiveRequest.conditionImageUrls.map((imageUrl, index) => (
                                                    <a
                                                        key={`${imageUrl}-${index}`}
                                                        href={imageUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="block aspect-square overflow-hidden rounded-lg border border-[#E6E6E6] bg-white"
                                                    >
                                                        <img
                                                            src={imageUrl}
                                                            alt={`Ảnh hiện trạng ${index + 1}`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </a>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="rounded-lg border border-dashed border-[#D5D9D9] bg-white p-4 text-center text-[13px] text-[#565959]">
                                                Khách chưa gửi ảnh hiện trạng.
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2 rounded-xl border border-[#E6E6E6] bg-white p-3 text-[12px] text-[#565959]">
                                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#B12704]" />
                                        Sau khi xác nhận, hệ thống sẽ ghi nhận shop đã nhận hàng hoàn trả cho yêu cầu này.
                                    </div>
                                </aside>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-2 border-t border-[#E6E6E6] bg-[#FAFAFA] px-5 py-4 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={closeReturnReceiveModal}
                                disabled={actionOrderId === returnReceiveRequest.orderId}
                                className="rounded-xl border border-[#D5D9D9] bg-white px-4 py-2 text-[14px] font-bold text-[#222222] hover:bg-[#F7F7F7] disabled:opacity-60"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmReturnReceived}
                                disabled={actionOrderId === returnReceiveRequest.orderId}
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#007185] bg-[#007185] px-4 py-2 text-[14px] font-bold text-white hover:bg-[#005F6B] disabled:opacity-60"
                            >
                                {actionOrderId === returnReceiveRequest.orderId ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <PackageCheck className="h-4 w-4" />
                                )}
                                Xác nhận đã nhận hàng
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}
