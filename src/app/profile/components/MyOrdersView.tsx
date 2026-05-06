"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Package, Search } from "lucide-react";
import { getMyPaidOrders, type PaidOrder } from "@/lib/api/orders";
import OrderCard from "./OrderCard";
import EarlyReturnRequestModal from "./EarlyReturnRequestModal";
import ReturnRequestModal from "@/components/returns/ReturnRequestModal";
import ReturnComplaintModal from "@/components/returns/ReturnComplaintModal";
import EarlyReturnComplaintModal from "@/components/returns/EarlyReturnComplaintModal";

export default function MyOrdersView() {
    const [orders, setOrders] = useState<PaidOrder[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadOrders = async (isCancelled = false) => {
        setIsLoading(true);
        setError(null);

        try {
            const data = await getMyPaidOrders();
            if (!isCancelled) setOrders(data);
        } catch (err: any) {
            if (!isCancelled) setError(err?.message || "Không thể tải danh sách đơn hàng.");
        } finally {
            if (!isCancelled) setIsLoading(false);
        }
    };

    useEffect(() => {
        let isCancelled = false;
        loadOrders(isCancelled);
        return () => {
            isCancelled = true;
        };
    }, []);

    useEffect(() => {
        const orderId = new URLSearchParams(window.location.search).get("orderId");
        if (orderId) setSearchTerm(orderId);
    }, []);

    const filteredOrders = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) return orders;

        return orders.filter((order) => {
            const orderText = [
                order.orderId,
                order.status,
                order.paymentStatus,
                ...order.items.flatMap((item) => [item.productName, item.variantName, item.shopName]),
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            return orderText.includes(keyword);
        });
    }, [orders, searchTerm]);

    return (
        <section className="rounded-[8px] border border-[#E6E6E6] bg-white">
            <div className="border-b border-[#E6E6E6] px-5 py-4 md:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#222222]">Đơn hàng của tôi</h2>
                        <p className="mt-1 text-[13px] text-[#565959]">
                            Theo dõi đơn thuê, trả hàng và khiếu nại liên quan.
                        </p>
                    </div>
                    <div className="relative w-full md:max-w-[360px]">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="Tìm mã đơn, sản phẩm hoặc shop"
                            className="w-full rounded-[4px] border border-[#D5D9D9] py-2.5 pl-9 pr-3 text-[14px] outline-none transition-all focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/30"
                        />
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                    </div>
                </div>
            </div>

            <div className="p-5 md:p-6">
                {isLoading ? (
                    <div className="flex min-h-[260px] items-center justify-center rounded-[8px] border border-dashed border-[#D5D9D9] bg-[#F7F7F7]">
                        <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                    </div>
                ) : error ? (
                    <div className="rounded-[8px] border border-[#F5C2C7] bg-[#FFF5F5] p-4 text-[14px] font-semibold text-[#842029]">
                        {error}
                    </div>
                ) : filteredOrders.length > 0 ? (
                    <div className="space-y-5">
                        {filteredOrders.map((order) => (
                            <OrderCard key={order.orderId} order={order} onChanged={() => loadOrders(false)} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-[8px] border border-dashed border-[#D5D9D9] bg-[#F7F7F7] px-5 py-14 text-center">
                        <Package className="mb-3 h-12 w-12 text-[#A0A0A0]" />
                        <h3 className="text-[16px] font-bold text-[#222222]">Chưa có đơn hàng phù hợp</h3>
                        <p className="mt-1 text-[14px] text-[#565959]">
                            Các đơn thuê đã thanh toán sẽ được hiển thị tại đây.
                        </p>
                    </div>
                )}
            </div>

            <EarlyReturnRequestModal onSubmitted={() => loadOrders(false)} />
            <ReturnRequestModal onSubmitted={() => loadOrders(false)} />
            <ReturnComplaintModal onSubmitted={() => loadOrders(false)} />
            <EarlyReturnComplaintModal onSubmitted={() => loadOrders(false)} />
        </section>
    );
}
