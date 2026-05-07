"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { getVendorReturnRequests } from "@/lib/api/returns";
import type { ReturnRequest } from "@/types/return";
import ReturnStatusBadge from "@/components/returns/ReturnStatusBadge";
import VendorReturnActions from "@/components/returns/VendorReturnActions";

function formatDate(value: string | null | undefined) {
    if (!value) return "Chưa có";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

function formatPrice(value: number) {
    return value.toLocaleString("vi-VN");
}

export default function ReturnRequestList() {
    const [focusedOrderId, setFocusedOrderId] = useState<string | null>(null);
    const [requests, setRequests] = useState<ReturnRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadRequests = async () => {
        setIsLoading(true);
        setError("");

        try {
            const data = await getVendorReturnRequests();
            setRequests(data.requests);
        } catch (err: any) {
            setError(err.message || "Không thể tải yêu cầu hoàn trả.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRequests();
        setFocusedOrderId(new URLSearchParams(window.location.search).get("orderId"));
    }, []);

    return (
        <section className="space-y-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-[#E0E4E8] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-[22px] font-bold text-[#222222]">Yêu cầu hoàn trả</h1>
                    <p className="mt-1 text-[13px] text-[#565959]">
                        Xử lý các đơn người thuê đã gửi yêu cầu hoàn trả hàng.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={loadRequests}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-semibold text-[#222222] hover:bg-[#F7F7F7]"
                >
                    <RefreshCw className="h-4 w-4" />
                    Làm mới
                </button>
            </div>

            {error ? (
                <div className="rounded-xl border border-[#F5C2C7] bg-[#FFF5F5] p-4 text-[13px] font-semibold text-[#842029]">
                    {error}
                </div>
            ) : null}

            {isLoading ? (
                <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-[#E0E4E8] bg-white">
                    <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                </div>
            ) : requests.length === 0 ? (
                <div className="rounded-2xl border border-[#E0E4E8] bg-white p-8 text-center text-[14px] text-[#565959]">
                    Hiện chưa có yêu cầu hoàn trả nào.
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => {
                        const isFocused = focusedOrderId === request.orderId;

                        return (
                        <article
                            key={request.orderId}
                            className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
                                isFocused ? "border-[#FF9900] ring-2 ring-[#FF9900]/30" : "border-[#E0E4E8]"
                            }`}
                        >
                            <div className="flex flex-col gap-4 border-b border-[#E6E6E6] p-5 lg:flex-row lg:items-start lg:justify-between">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-[16px] font-bold text-[#222222]">
                                            Đơn #{request.orderId.slice(0, 8)}
                                        </h2>
                                        <ReturnStatusBadge
                                            status={request.status}
                                            vendorStatus={request.returnRecord?.vendorReturnStatus}
                                        />
                                    </div>
                                    <p className="mt-1 text-[13px] text-[#565959]">
                                        Thời gian thuê: {formatDate(request.rentalStart)} - {formatDate(request.rentalEnd)}
                                    </p>
                                    <p className="mt-1 text-[13px] font-semibold text-[#007185]">
                                        Gửi yêu cầu: {formatDate(request.returnRecord?.returnRequestedAt)}
                                    </p>
                                </div>
                                <div className="rounded-xl border border-[#E6E6E6] bg-[#F7F7F7] p-3 text-[13px]">
                                    <div className="font-bold text-[#222222]">{request.renter.fullName}</div>
                                    <div className="mt-1 text-[#565959]">
                                        {request.renter.phoneNumber || request.renter.email || "Không có liên hệ"}
                                    </div>
                                    <div className="mt-1 font-bold text-[#B12704]">
                                        Tổng đơn: {formatPrice(request.totalAmount)}đ
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]">
                                <div className="space-y-3">
                                    {request.items.map((item) => (
                                        <div key={item.orderItemId} className="flex gap-3">
                                            <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-[#E6E6E6] bg-[#F7F7F7]">
                                                {item.productImage ? (
                                                    <img src={item.productImage} alt={item.productName} className="h-full w-full object-cover" />
                                                ) : null}
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
                                        Ghi chú khách: {request.returnRecord?.returnRequestNote || "Không có ghi chú"}
                                    </div>

                                    {request.returnRecord?.returnEvidenceUrls.length ? (
                                        <div className="grid grid-cols-4 gap-2">
                                            {request.returnRecord.returnEvidenceUrls.map((imageUrl, index) => (
                                                <a key={`${imageUrl}-${index}`} href={imageUrl} target="_blank" rel="noreferrer" className="aspect-square overflow-hidden rounded-lg border border-[#E6E6E6]">
                                                    <img src={imageUrl} alt={`Ảnh minh chứng ${index + 1}`} className="h-full w-full object-cover" />
                                                </a>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>

                                <VendorReturnActions request={request} onChanged={loadRequests} />
                            </div>
                        </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
