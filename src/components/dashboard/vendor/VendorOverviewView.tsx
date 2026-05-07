"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ClipboardCheck, Loader2, Package, RefreshCw, TicketPercent } from "lucide-react";
import { getVendorOrders } from "@/lib/api/vendor";
import type { ApiProduct, VendorOrder, VendorTab } from "@/types/vendor";

type VendorOverviewViewProps = {
    products: ApiProduct[];
    isLoadingProducts: boolean;
    productError: string | null;
    onNavigate: (tab: VendorTab) => void;
    onRefreshProducts: () => void;
};

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

function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
        PENDING_VENDOR_APPROVAL: "Chờ shop duyệt",
        CONFIRMED: "Đã xác nhận",
        READY_FOR_PICKUP: "Sẵn sàng giao",
        IN_RENTAL: "Đang thuê",
        RETURN_PENDING: "Chờ trả hàng",
        COMPLETED: "Hoàn tất",
        CANCELLED: "Đã hủy",
        DISPUTED: "Tranh chấp",
    };

    return labels[status] ?? status;
}

function StatCard({
    title,
    value,
    helper,
    icon: Icon,
    onClick,
}: {
    title: string;
    value: string;
    helper: string;
    icon: React.ElementType;
    onClick?: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-2xl border border-[#E6E6E6] bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
            <div className="mb-4 flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF8E6] text-[#E47911]">
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="text-[13px] font-semibold text-[#565959]">{title}</div>
            <div className="mt-1 text-[26px] font-bold tracking-tight text-[#222222]">{value}</div>
            <div className="mt-1 text-[12px] text-[#6B7280]">{helper}</div>
        </button>
    );
}

export default function VendorOverviewView({
    products,
    isLoadingProducts,
    productError,
    onNavigate,
    onRefreshProducts,
}: VendorOverviewViewProps) {
    const [orders, setOrders] = useState<VendorOrder[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [orderError, setOrderError] = useState<string | null>(null);

    useEffect(() => {
        let isCancelled = false;

        async function loadOrders() {
            setIsLoadingOrders(true);
            setOrderError(null);

            try {
                const data = await getVendorOrders("ALL");
                if (!isCancelled) setOrders(data);
            } catch (error) {
                if (!isCancelled) {
                    setOrderError(error instanceof Error ? error.message : "Không thể tải đơn thuê.");
                }
            } finally {
                if (!isCancelled) setIsLoadingOrders(false);
            }
        }

        const timer = window.setTimeout(() => {
            void loadOrders();
        }, 0);

        return () => {
            isCancelled = true;
            window.clearTimeout(timer);
        };
    }, []);

    const summary = useMemo(() => {
        const approvedProducts = products.filter((product) => product.status === "APPROVED").length;
        const pendingProducts = products.filter((product) => product.status === "PENDING_REVIEW").length;
        const totalStock = products.reduce(
            (sum, product) =>
                sum +
                (product.product_variants ?? []).reduce(
                    (variantSum, variant) => variantSum + Number(variant.available_stock ?? 0),
                    0,
                ),
            0,
        );
        const pendingOrders = orders.filter((order) => order.status === "PENDING_VENDOR_APPROVAL").length;
        const activeRentals = orders.filter((order) => ["CONFIRMED", "READY_FOR_PICKUP", "IN_RENTAL"].includes(order.status)).length;
        const revenue = orders
            .filter((order) => !["CANCELLED"].includes(order.status))
            .reduce((sum, order) => sum + Number(order.totalAmount ?? 0), 0);

        return {
            approvedProducts,
            pendingProducts,
            totalStock,
            pendingOrders,
            activeRentals,
            revenue,
        };
    }, [orders, products]);

    const recentOrders = orders.slice(0, 5);

    return (
        <div className="flex-1 animate-in fade-in duration-300">
            <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#E6E6E6] bg-gradient-to-br from-[#232F3E] to-[#0F2535] p-6 text-white shadow-sm md:flex-row md:items-center md:justify-between">
                <div>
                    <p className="text-[13px] font-semibold text-white/75">Vendor dashboard</p>
                    <h1 className="mt-1 text-[28px] font-bold tracking-tight">Tổng quan cửa hàng</h1>
                    <p className="mt-2 max-w-[560px] text-[14px] leading-6 text-white/75">
                        Theo dõi sản phẩm, đơn thuê cần xử lý và doanh thu tạm tính từ các đơn đã thanh toán.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onRefreshProducts}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-bold text-white hover:bg-white/15"
                >
                    <RefreshCw className="h-4 w-4" />
                    Làm mới
                </button>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Sản phẩm đã duyệt"
                    value={isLoadingProducts ? "..." : String(summary.approvedProducts)}
                    helper={`${summary.pendingProducts} sản phẩm chờ duyệt`}
                    icon={Package}
                    onClick={() => onNavigate("vendor_listings")}
                />
                <StatCard
                    title="Tồn kho khả dụng"
                    value={isLoadingProducts ? "..." : String(summary.totalStock)}
                    helper={productError || "Tổng tồn khả dụng theo biến thể"}
                    icon={Package}
                    onClick={() => onNavigate("vendor_listings")}
                />
                <StatCard
                    title="Đơn chờ duyệt"
                    value={isLoadingOrders ? "..." : String(summary.pendingOrders)}
                    helper={`${summary.activeRentals} đơn đang xác nhận/thuê`}
                    icon={ClipboardCheck}
                    onClick={() => onNavigate("vendor_orders")}
                />
                <StatCard
                    title="Doanh thu tạm tính"
                    value={isLoadingOrders ? "..." : `${formatPrice(summary.revenue)}đ`}
                    helper={orderError || "Tính từ các đơn không bị hủy"}
                    icon={TicketPercent}
                    onClick={() => onNavigate("vendor_orders")}
                />
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
                <section className="overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-[#E6E6E6] px-5 py-4">
                        <div>
                            <h2 className="text-[16px] font-bold text-[#222222]">Đơn thuê gần đây</h2>
                            <p className="mt-0.5 text-[12px] text-[#565959]">Các đơn mới nhất thuộc shop của bạn.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate("vendor_orders")}
                            className="rounded-lg border border-[#D5D9D9] px-3 py-1.5 text-[12px] font-bold text-[#007185] hover:bg-[#F0F8FF]"
                        >
                            Xem tất cả
                        </button>
                    </div>

                    {isLoadingOrders ? (
                        <div className="flex min-h-[220px] items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                        </div>
                    ) : recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-[14px] text-[#565959]">Chưa có đơn thuê nào.</div>
                    ) : (
                        <div className="divide-y divide-[#E6E6E6]">
                            {recentOrders.map((order) => (
                                <div key={order.orderId} className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <div className="text-[13px] font-bold text-[#007185]">#{order.orderId.slice(0, 8)}</div>
                                        <div className="mt-1 text-[13px] text-[#222222]">
                                            {order.items.map((item) => item.productName).join(", ")}
                                        </div>
                                        <div className="mt-1 flex items-center gap-1 text-[12px] text-[#565959]">
                                            <CalendarDays className="h-3.5 w-3.5" />
                                            {formatDate(order.rentalStart)} - {formatDate(order.rentalEnd)}
                                        </div>
                                    </div>
                                    <div className="text-left md:text-right">
                                        <div className="text-[13px] font-bold text-[#B12704]">{formatPrice(order.totalAmount)}đ</div>
                                        <div className="mt-1 rounded-full border border-[#D5D9D9] px-2 py-1 text-[11px] font-bold text-[#565959]">
                                            {getStatusLabel(order.status)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-[#E6E6E6] bg-white p-5 shadow-sm">
                    <h2 className="text-[16px] font-bold text-[#222222]">Lối tắt</h2>
                    <div className="mt-4 grid gap-3">
                        <button
                            type="button"
                            onClick={() => onNavigate("vendor_listings")}
                            className="rounded-xl border border-[#D5D9D9] px-4 py-3 text-left text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                        >
                            Quản lý sản phẩm
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate("vendor_orders")}
                            className="rounded-xl border border-[#D5D9D9] px-4 py-3 text-left text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                        >
                            Duyệt đơn thuê
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate("vendor_vouchers")}
                            className="rounded-xl border border-[#D5D9D9] px-4 py-3 text-left text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                        >
                            Tạo voucher cho shop
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate("rentals_calendar")}
                            className="rounded-xl border border-[#D5D9D9] px-4 py-3 text-left text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                        >
                            Xem lịch cho thuê
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}

