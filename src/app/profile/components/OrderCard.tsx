"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertTriangle, CalendarDays, Loader2, MessageSquarePlus, PackageCheck } from "lucide-react";
import { confirmRenterReceived, type PaidOrder } from "@/lib/api/orders";
import { reportReview } from "@/lib/api/reviews";
import { useEarlyReturnModalStore } from "@/stores/useEarlyReturnModalStore";
import { useReturnModalStore } from "@/stores/returnModalStore";
import { useReturnComplaintModalStore } from "@/stores/returnComplaintModalStore";
import { useEarlyReturnComplaintModalStore } from "@/stores/earlyReturnComplaintModalStore";

type OrderCardProps = {
    order: PaidOrder;
    onChanged?: () => Promise<void> | void;
};

function formatCurrency(value: number) {
    return value.toLocaleString("vi-VN");
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

function toLocalDateKey(value: Date) {
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        PENDING_VENDOR_APPROVAL: "Chờ shop xác nhận",
        CONFIRMED: "Đã xác nhận",
        READY_FOR_PICKUP: "Sẵn sàng giao/nhận",
        IN_RENTAL: "Đang thuê",
        RETURN_PENDING: "Chờ trả hàng",
        COMPLETED: "Hoàn thành",
        CANCELLED: "Đã hủy",
        LATE: "Quá hạn",
        DISPUTED: "Đang tranh chấp",
    };

    return labels[status] ?? status;
}

function getStatusTone(status: string) {
    if (status === "COMPLETED") return "border-[#B7E4C7] bg-[#F1FFF4] text-[#007600]";
    if (status === "CANCELLED") return "border-[#F5C2C7] bg-[#FFF5F5] text-[#842029]";
    if (status === "LATE" || status === "DISPUTED") return "border-[#F5C2C7] bg-[#FFF5F5] text-[#C62828]";
    if (status === "IN_RENTAL") return "border-[#C9E7F5] bg-[#F0F8FF] text-[#007185]";
    return "border-[#FFE4A3] bg-[#FFF8E1] text-[#B12704]";
}

function getEarlyReturnStatusLabel(status: string) {
    const labels: Record<string, string> = {
        PENDING: "Đang chờ shop xác nhận",
        APPROVED: "Shop đã chấp nhận, chờ trả hàng",
        REJECTED: "Shop đã từ chối",
        RECEIVED: "Shop đã nhận hàng",
    };

    return labels[status] ?? status;
}

export default function OrderCard({ order, onChanged }: OrderCardProps) {
    const [isConfirmingReceived, setIsConfirmingReceived] = useState(false);
    const [isReportingReview, setIsReportingReview] = useState(false);
    const [actionError, setActionError] = useState("");
    const openEarlyReturnModal = useEarlyReturnModalStore((state) => state.open);
    const openReturnModal = useReturnModalStore((state) => state.open);
    const openReturnComplaintModal = useReturnComplaintModalStore((state) => state.open);
    const openEarlyReturnComplaintModal = useEarlyReturnComplaintModalStore((state) => state.open);

    const canConfirmReceived =
        order.status === "CONFIRMED" &&
        toLocalDateKey(new Date()) >= toLocalDateKey(new Date(order.rentalStart));
    const canRequestEarlyReturn =
        order.status === "IN_RENTAL" &&
        toLocalDateKey(new Date()) < toLocalDateKey(new Date(order.rentalEnd)) &&
        !["PENDING", "APPROVED"].includes(order.earlyReturnRequest?.status ?? "");
    const canRequestReturn = ["IN_RENTAL", "LATE"].includes(order.status);
    const canComplainReturnResult =
        ["CONFIRMED", "ISSUE_REPORTED"].includes(order.returnRecord?.vendorReturnStatus ?? "") ||
        order.status === "DISPUTED";
    const canReviewProducts = order.status === "COMPLETED";

    const handleConfirmReceived = async () => {
        setIsConfirmingReceived(true);
        setActionError("");

        try {
            await confirmRenterReceived(order.orderId);
            await onChanged?.();
        } catch (error: any) {
            setActionError(error.message || "Không thể xác nhận đã nhận hàng.");
        } finally {
            setIsConfirmingReceived(false);
        }
    };

    const handleReportRenterReview = async () => {
        if (!order.renterReview) return;

        const reason = window.prompt("Nhập lý do báo cáo đánh giá này:");
        if (!reason?.trim()) return;

        setIsReportingReview(true);
        setActionError("");

        try {
            await reportReview(order.renterReview.reviewId, reason.trim());
            await onChanged?.();
        } catch (error: any) {
            setActionError(error.message || "Không thể báo cáo đánh giá.");
        } finally {
            setIsReportingReview(false);
        }
    };

    return (
        <article className="overflow-hidden rounded-[8px] border border-[#D5D9D9] bg-white">
            <div className="flex flex-col gap-3 border-b border-[#E6E6E6] bg-[#FAFAFA] px-4 py-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[12px] font-bold ${getStatusTone(order.status)}`}>
                        {getStatusLabel(order.status)}
                    </span>
                    <span className="text-[13px] font-semibold text-[#007185]">#{order.orderId.slice(0, 8)}</span>
                </div>
                <div className="grid gap-2 text-[12px] text-[#565959] sm:grid-cols-3 md:text-right">
                    <span>Ngày đặt: <strong className="text-[#222222]">{formatDate(order.createdAt)}</strong></span>
                    <span>Thanh toán: <strong className="text-[#007600]">{order.paymentStatus}</strong></span>
                    <span>Tổng: <strong className="text-[#B12704]">{formatCurrency(order.totalAmount)} đ</strong></span>
                </div>
            </div>

            <div className="p-4">
                <div className="mb-4 flex flex-col gap-2 rounded-[6px] border border-[#E6E6E6] bg-white px-3 py-3 text-[13px] text-[#222222] sm:flex-row sm:items-center sm:justify-between">
                    <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-[#565959]" />
                        Thời gian thuê: <strong>{formatDate(order.rentalStart)} - {formatDate(order.rentalEnd)}</strong>
                    </span>
                </div>

                {order.earlyReturnRequest ? (
                    <div className="mb-4 rounded-[6px] border border-[#FFE4A3] bg-[#FFFDF5] p-3 text-[13px]">
                        <div className="font-bold text-[#222222]">Yêu cầu trả hàng sớm</div>
                        <div className="mt-1 text-[#565959]">
                            Ngày muốn trả: {formatDate(order.earlyReturnRequest.requestedReturnAt)} ·{" "}
                            {getEarlyReturnStatusLabel(order.earlyReturnRequest.status)}
                        </div>
                        {order.earlyReturnRequest.vendorResponseNote ? (
                            <div className="mt-1 text-[#842029]">
                                Phản hồi shop: {order.earlyReturnRequest.vendorResponseNote}
                            </div>
                        ) : null}
                        {order.earlyReturnRequest.status === "REJECTED" ? (
                            <button
                                type="button"
                                onClick={() => openEarlyReturnComplaintModal(order)}
                                className="mt-3 rounded-[4px] border border-[#F5C2C7] bg-white px-3 py-2 text-[13px] font-bold text-[#842029] hover:bg-[#FFF5F5]"
                            >
                                Khiếu nại từ chối trả sớm
                            </button>
                        ) : null}
                        {order.earlyReturnRequest.conditionImageUrls?.length ? (
                            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                                {order.earlyReturnRequest.conditionImageUrls.map((imageUrl, index) => (
                                    <a
                                        key={`${imageUrl}-${index}`}
                                        href={imageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block aspect-square overflow-hidden rounded-[6px] border border-[#E6E6E6] bg-[#F7F7F7]"
                                    >
                                        <img
                                            src={imageUrl}
                                            alt={`Ảnh hiện trạng trả sớm ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </a>
                                ))}
                            </div>
                        ) : null}
                    </div>
                ) : null}

                <div className="divide-y divide-[#E6E6E6] rounded-[8px] border border-[#E6E6E6]">
                    {order.items.map((item) => (
                        <div key={item.orderItemId} className="flex flex-col gap-3 p-3 sm:flex-row sm:gap-4 sm:p-4">
                            <div className="h-[84px] w-[84px] flex-shrink-0 overflow-hidden rounded-[6px] border border-[#E6E6E6] bg-[#F7F7F7]">
                                <img
                                    src={item.productImage ?? "/file.svg"}
                                    alt={item.productName}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="min-w-0 flex-1">
                                {item.productSlug ? (
                                    <Link
                                        href={`/products/${item.productSlug}`}
                                        className="line-clamp-2 text-[14px] font-bold leading-5 text-[#007185] hover:text-[#E47911] hover:underline"
                                    >
                                        {item.productName}
                                    </Link>
                                ) : (
                                    <h3 className="line-clamp-2 text-[14px] font-bold leading-5 text-[#222222]">
                                        {item.productName}
                                    </h3>
                                )}

                                <div className="mt-1 text-[12px] text-[#565959]">
                                    Shop: <strong className="text-[#222222]">{item.shopName || "Amonzan vendor"}</strong>
                                </div>
                                {item.variantName ? (
                                    <div className="mt-1 text-[12px] text-[#565959]">
                                        Phân loại: <strong className="text-[#222222]">{item.variantName}</strong>
                                    </div>
                                ) : null}
                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[#222222]">
                                    <span>Số lượng: <strong>{item.quantity}</strong></span>
                                    <span>Thành tiền: <strong className="text-[#B12704]">{formatCurrency(item.lineSubtotal)} đ</strong></span>
                                </div>
                            </div>

                            {canReviewProducts && item.productSlug ? (
                                <div className="flex flex-shrink-0 items-start sm:justify-end">
                                    <Link
                                        href={`/products/${item.productSlug}#danh-gia`}
                                        className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#FF9900] bg-[#FFD814] px-4 py-2 text-[13px] font-bold text-[#222222] hover:bg-[#F7CA00] sm:w-auto"
                                    >
                                        <MessageSquarePlus className="h-4 w-4" />
                                        Đánh giá
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    ))}
                </div>

                {order.renterReview ? (
                    <div className="mt-4 rounded-[6px] border border-[#E6E6E6] bg-[#FAFAFA] p-3 text-[13px]">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <div className="font-bold text-[#222222]">Đánh giá từ shop {order.renterReview.shopName}</div>
                                <div className="mt-1 flex items-center gap-1 font-bold text-[#B12704]">
                                    {order.renterReview.rating}/5 <span className="text-[#FFA41C]">★</span>
                                </div>
                                {order.renterReview.comment ? (
                                    <p className="mt-1 text-[#565959]">{order.renterReview.comment}</p>
                                ) : null}
                            </div>
                            <button
                                type="button"
                                onClick={handleReportRenterReview}
                                disabled={isReportingReview || order.renterReview.reportStatus === "PENDING"}
                                className="rounded-[4px] border border-[#F5C2C7] bg-white px-3 py-2 text-[12px] font-bold text-[#842029] hover:bg-[#FFF5F5] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {order.renterReview.reportStatus === "PENDING" ? "Đã báo cáo" : "Báo cáo"}
                            </button>
                        </div>
                    </div>
                ) : null}

                {actionError ? (
                    <div className="mt-4 flex items-start gap-2 rounded-[6px] border border-red-100 bg-red-50 px-3 py-3 text-[13px] font-semibold text-[#842029]">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        {actionError}
                    </div>
                ) : null}

                {canConfirmReceived || canRequestEarlyReturn || canRequestReturn || canComplainReturnResult ? (
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
                        {canConfirmReceived ? (
                            <button
                                type="button"
                                onClick={handleConfirmReceived}
                                disabled={isConfirmingReceived}
                                className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#0F7B0F] bg-[#0F7B0F] px-4 py-2.5 text-[13px] font-bold text-white hover:bg-[#0B650B] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isConfirmingReceived ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackageCheck className="h-4 w-4" />}
                                Xác nhận đã nhận hàng
                            </button>
                        ) : null}

                        {canRequestEarlyReturn ? (
                            <button
                                type="button"
                                onClick={() => openEarlyReturnModal(order)}
                                className="rounded-[4px] border border-[#D5D9D9] bg-white px-4 py-2.5 text-[13px] font-bold text-[#007185] hover:bg-[#F7F7F7]"
                            >
                                Yêu cầu trả hàng sớm
                            </button>
                        ) : null}

                        {canRequestReturn ? (
                            <button
                                type="button"
                                onClick={() => openReturnModal(order)}
                                className="rounded-[4px] border border-[#007185] bg-white px-4 py-2.5 text-[13px] font-bold text-[#007185] hover:bg-[#F0F8FF]"
                            >
                                Yêu cầu hoàn trả
                            </button>
                        ) : null}

                        {canComplainReturnResult ? (
                            <button
                                type="button"
                                onClick={() => openReturnComplaintModal(order)}
                                className="rounded-[4px] border border-[#F5C2C7] bg-white px-4 py-2.5 text-[13px] font-bold text-[#842029] hover:bg-[#FFF5F5]"
                            >
                                Khiếu nại kết quả hoàn trả
                            </button>
                        ) : null}
                    </div>
                ) : null}
            </div>
        </article>
    );
}
