"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, Star, X } from "lucide-react";
import {
    approveEarlyReturn,
    approveVendorOrder,
    confirmReturnReceived,
    getVendorEarlyReturnRequests,
    getVendorOrders,
    rejectEarlyReturn,
    rejectVendorOrder,
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

export default function VendorOrdersView() {
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [earlyReturnRequests, setEarlyReturnRequests] = useState<VendorEarlyReturnRequest[]>([]);
    const [viewMode, setViewMode] = useState<"orders" | "early_returns">("orders");
    const [isLoading, setIsLoading] = useState(true);
    const [actionOrderId, setActionOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [rejectingEarlyReturnId, setRejectingEarlyReturnId] = useState<string | null>(null);
    const [earlyReturnRejectReason, setEarlyReturnRejectReason] = useState("");

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
                const reason = window.prompt("Nhập lý do từ chối yêu cầu trả sớm:");
                if (!reason) return;
                await rejectEarlyReturn(request.orderId, reason);
            } else {
                const note = window.prompt("Ghi chú tình trạng hàng trả:", "Hàng trả bình thường.");
                await confirmReturnReceived(request.orderId, {
                    returnedAt: new Date().toISOString(),
                    returnConditionNote: note || "",
                    damaged: false,
                });
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
                                                onClick={() => handleEarlyReturnAction(request, "received")}
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
        </section>
    );
}
