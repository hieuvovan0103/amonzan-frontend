"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Loader2, RefreshCw, Star, X } from "lucide-react";
import {
    approveVendorOrder,
    getVendorOrders,
    rejectVendorOrder,
} from "@/lib/api/vendor";
import type { VendorOrder } from "@/types/vendor";

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
    const [isLoading, setIsLoading] = useState(true);
    const [actionOrderId, setActionOrderId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getVendorOrders("PENDING_VENDOR_APPROVAL");
            setOrders(data);
        } catch (err: any) {
            setError(err?.message || "Không thể tải đơn thuê.");
        } finally {
            setIsLoading(false);
        }
    }, []);

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

    return (
        <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-[#E0E4E8] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-[#222222]">Duyệt đơn thuê</h1>
                    <p className="mt-1 text-[13px] text-[#565959]">
                        Các đơn đã thanh toán và đang chờ shop chấp nhận hoặc từ chối.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={loadOrders}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-semibold text-[#222222] hover:bg-[#F7F7F7]"
                >
                    <RefreshCw className="h-4 w-4" />
                    Làm mới
                </button>
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
                                                    {formatPrice(item.lineSubtotal + item.lineDeposit)}đ
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
