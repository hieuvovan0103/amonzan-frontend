"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, CalendarDays, ChevronLeft, ChevronRight, Filter, Loader2, RefreshCw, Search } from "lucide-react";
import { getVendorOrders } from "@/lib/api/vendor";
import type { VendorCalendarEvent, VendorOrder } from "@/types/vendor";

const STATUS_LABELS: Record<string, string> = {
    PENDING_PAYMENT: "Chờ thanh toán",
    PENDING_VENDOR_APPROVAL: "Chờ shop duyệt",
    CONFIRMED: "Đã xác nhận",
    READY_FOR_PICKUP: "Sẵn sàng giao",
    IN_RENTAL: "Đang thuê",
    RETURN_PENDING: "Chờ hoàn trả",
    COMPLETED: "Hoàn tất",
    CANCELLED: "Đã hủy",
    LATE: "Quá hạn",
    DISPUTED: "Tranh chấp",
};

const STATUS_COLORS: Record<string, string> = {
    PENDING_PAYMENT: "bg-slate-100 border-slate-200",
    PENDING_VENDOR_APPROVAL: "bg-[#FFF8E1] border-[#F0C14B]",
    CONFIRMED: "bg-blue-100 border-blue-300",
    READY_FOR_PICKUP: "bg-cyan-100 border-cyan-300",
    IN_RENTAL: "bg-[#E6F4EA] border-[#34A853]",
    RETURN_PENDING: "bg-purple-100 border-purple-300",
    COMPLETED: "bg-gray-100 border-gray-300",
    CANCELLED: "bg-red-50 border-red-200",
    LATE: "bg-orange-100 border-orange-300",
    DISPUTED: "bg-red-100 border-red-300",
};

function parseDateOnly(value: string) {
    const [year, month, day] = value.slice(0, 10).split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

function formatPrice(value: number) {
    return value.toLocaleString("vi-VN");
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

function getMonthDays(monthDate: Date) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const dayCount = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: dayCount }, (_, index) => new Date(year, month, index + 1));
}

function isSameMonthOrOverlaps(event: VendorCalendarEvent, monthDate: Date) {
    const start = parseDateOnly(event.rentalStart);
    const end = parseDateOnly(event.rentalEnd);
    if (!start || !end) return false;

    const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

    return start <= monthEnd && end >= monthStart;
}

function isActiveDay(event: VendorCalendarEvent, day: Date) {
    const start = parseDateOnly(event.rentalStart);
    const end = parseDateOnly(event.rentalEnd);
    if (!start || !end) return false;

    return day >= start && day <= end;
}

function mapOrderToCalendarEvent(order: VendorOrder): VendorCalendarEvent {
    const firstItem = order.items[0];
    const title = firstItem
        ? `${firstItem.productName}${firstItem.variantName ? ` - ${firstItem.variantName}` : ""}`
        : "Đơn thuê";

    return {
        id: order.orderId,
        orderId: order.orderId,
        title,
        status: order.status,
        paymentStatus: order.paymentStatus,
        rentalStart: order.rentalStart,
        rentalEnd: order.rentalEnd,
        renterName: order.renter.fullName,
        totalAmount: order.totalAmount,
        items: order.items,
        color: STATUS_COLORS[order.status] ?? "bg-[#FF9900]/20 border-[#FF9900]/50",
    };
}

export default function VendorRentalsCalendarView() {
    const [events, setEvents] = useState<VendorCalendarEvent[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState("ALL");
    const [orderSearch, setOrderSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");
    const [currentMonth, setCurrentMonth] = useState(() => new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const days = useMemo(() => getMonthDays(currentMonth), [currentMonth]);
    const monthLabel = useMemo(
        () =>
            new Intl.DateTimeFormat("vi-VN", {
                month: "long",
                year: "numeric",
            }).format(currentMonth),
        [currentMonth],
    );

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const orders = await getVendorOrders("ALL");
            setEvents(orders.map(mapOrderToCalendarEvent));
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không thể tải lịch cho thuê."));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadOrders();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [loadOrders]);

    const orderOptions = useMemo(
        () =>
            events.map((event) => ({
                id: event.orderId,
                label: `#${event.orderId.slice(0, 8)} - ${event.renterName} - ${event.title}`,
            })),
        [events],
    );

    const statusOptions = useMemo(
        () => Array.from(new Set(events.map((event) => event.status))).sort(),
        [events],
    );

    const typeOptions = useMemo(
        () =>
            Array.from(
                new Set(
                    events.flatMap((event) =>
                        event.items.map((item) => item.productName).filter(Boolean),
                    ),
                ),
            ).sort(),
        [events],
    );

    const filteredEvents = useMemo(() => {
        const normalizedSearch = orderSearch.trim().toLowerCase();
        const selectedEvents = selectedOrderId === "ALL"
            ? events
            : events.filter((event) => event.orderId === selectedOrderId);

        return selectedEvents
            .filter((event) => {
                if (!normalizedSearch) return true;

                return event.orderId.toLowerCase().includes(normalizedSearch) ||
                    event.orderId.slice(0, 8).toLowerCase().includes(normalizedSearch);
            })
            .filter((event) => statusFilter === "ALL" || event.status === statusFilter)
            .filter((event) =>
                typeFilter === "ALL" ||
                event.items.some((item) => item.productName === typeFilter),
            )
            .filter((event) => isSameMonthOrOverlaps(event, currentMonth));
    }, [currentMonth, events, orderSearch, selectedOrderId, statusFilter, typeFilter]);

    const monthStats = useMemo(() => ({
        total: filteredEvents.length,
        active: filteredEvents.filter((event) => event.status === "IN_RENTAL").length,
        pending: filteredEvents.filter((event) => event.status === "PENDING_VENDOR_APPROVAL").length,
    }), [filteredEvents]);

    const goToPreviousMonth = () => {
        setCurrentMonth((value) => new Date(value.getFullYear(), value.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth((value) => new Date(value.getFullYear(), value.getMonth() + 1, 1));
    };

    return (
        <div className="flex-1 min-w-0 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-[24px] font-bold text-[#222222] tracking-[-0.02em] mb-1">
                        Lịch cho thuê
                    </h1>
                    <p className="text-[14px] text-[#565959]">
                        Hiển thị toàn bộ đơn thuê của shop theo thời gian thuê.
                    </p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={goToPreviousMonth}
                        className="bg-white border border-[#D5D9D9] px-3 py-2 rounded-[8px]"
                        aria-label="Tháng trước"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex min-w-[150px] items-center justify-center gap-2 rounded-[8px] border border-[#D5D9D9] bg-[#F7F7F7] px-3 py-2 text-[13px] font-bold text-[#222222]">
                        <CalendarDays className="h-4 w-4 text-[#007185]" />
                        {monthLabel}
                    </div>
                    <button
                        type="button"
                        onClick={goToNextMonth}
                        className="bg-white border border-[#D5D9D9] px-3 py-2 rounded-[8px]"
                        aria-label="Tháng sau"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                        <input
                            type="search"
                            value={orderSearch}
                            onChange={(event) => setOrderSearch(event.target.value)}
                            placeholder="Tìm mã đơn..."
                            className="w-[190px] rounded-[8px] border border-[#D5D9D9] bg-white py-2 pl-9 pr-3 text-[13px] font-semibold text-[#222222] outline-none placeholder:text-[#9B9B9B] focus:border-[#FF9900]"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                        <select
                            value={selectedOrderId}
                            onChange={(event) => setSelectedOrderId(event.target.value)}
                            className="max-w-[320px] bg-white border border-[#D5D9D9] pl-9 pr-3 py-2 rounded-[8px] text-[13px] font-bold outline-none focus:border-[#FF9900]"
                        >
                            <option value="ALL">Tất cả đơn</option>
                            {orderOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value)}
                        className="rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] font-bold outline-none focus:border-[#FF9900]"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {STATUS_LABELS[status] ?? status}
                            </option>
                        ))}
                    </select>
                    <select
                        value={typeFilter}
                        onChange={(event) => setTypeFilter(event.target.value)}
                        className="max-w-[260px] rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] font-bold outline-none focus:border-[#FF9900]"
                    >
                        <option value="ALL">Tất cả thể loại</option>
                        {typeOptions.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={loadOrders}
                        className="inline-flex items-center gap-2 rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-[#E6E6E6] bg-[#F7F7F7] p-4">
                    <div className="text-[12px] font-semibold text-[#565959]">Đơn trong tháng</div>
                    <div className="mt-1 text-[22px] font-bold text-[#222222]">{monthStats.total}</div>
                    <div className="mt-1 text-[11px] text-[#565959]">Sau khi áp dụng bộ lọc</div>
                </div>
                <div className="rounded-xl border border-[#E6E6E6] bg-[#E6F4EA] p-4">
                    <div className="text-[12px] font-semibold text-[#565959]">Đang thuê</div>
                    <div className="mt-1 text-[22px] font-bold text-[#1E7E34]">{monthStats.active}</div>
                </div>
                <div className="rounded-xl border border-[#E6E6E6] bg-[#FFF8E1] p-4">
                    <div className="text-[12px] font-semibold text-[#565959]">Chờ shop duyệt</div>
                    <div className="mt-1 text-[22px] font-bold text-[#B12704]">{monthStats.pending}</div>
                </div>
            </div>

            {error ? (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] text-[#B12704]">
                    <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            ) : null}

            {isLoading ? (
                <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-[#D5D9D9] bg-[#F7F7F7]">
                    <Loader2 className="h-7 w-7 animate-spin text-[#FF9900]" />
                </div>
            ) : (
            <div className="overflow-x-auto">
                <div className="min-w-[900px]">
                    <div
                        className="grid border border-[#E6E6E6] rounded-[12px] overflow-hidden"
                        style={{ gridTemplateColumns: `260px repeat(${days.length}, minmax(42px, 1fr))` }}
                    >
                        <div className="bg-[#F7F7F7] p-3 text-[13px] font-bold border-r border-b border-[#E6E6E6]">
                            Đơn thuê
                        </div>

                        {days.map((day) => (
                            <div
                                key={day.toISOString()}
                                className="bg-[#F7F7F7] p-3 text-center text-[12px] font-bold border-r border-b border-[#E6E6E6]"
                            >
                                {day.getDate()}
                            </div>
                        ))}

                        {filteredEvents.map((event) => (
                            <div key={event.id} className="contents">
                                <div className="border-r border-b border-[#E6E6E6] p-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="text-[13px] font-bold text-[#222222]">
                                            #{event.orderId.slice(0, 8)}
                                        </span>
                                        <span className="rounded-full bg-[#F7F7F7] px-2 py-0.5 text-[10px] font-bold text-[#565959]">
                                            {STATUS_LABELS[event.status] ?? event.status}
                                        </span>
                                    </div>
                                    <div className="mt-1 line-clamp-1 text-[12px] font-semibold text-[#007185]">
                                        {event.title}
                                    </div>
                                    <div className="mt-1 text-[11px] text-[#565959]">
                                        {event.renterName}
                                    </div>
                                    <div className="mt-1 text-[11px] text-[#565959]">
                                        {formatDate(event.rentalStart)} - {formatDate(event.rentalEnd)}
                                    </div>
                                    <div className="mt-1 text-[11px] font-bold text-[#B12704]">
                                        {formatPrice(event.totalAmount)} đ
                                    </div>
                                </div>

                                {days.map((day) => {
                                    const active = isActiveDay(event, day);

                                    return (
                                        <div
                                            key={`${event.id}-${day.toISOString()}`}
                                            className={`h-[96px] border-r border-b border-[#E6E6E6] p-1 ${active ? event.color : "bg-white"}`}
                                        >
                                            {active ? (
                                                <div className="h-full rounded-md border border-inherit bg-white/35" />
                                            ) : null}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )}

            {!isLoading && filteredEvents.length === 0 ? (
                <div className="mt-4 rounded-[8px] border border-dashed border-[#D5D9D9] bg-[#F7F7F7] p-4 text-center text-[14px] text-[#565959]">
                    {events.length === 0
                        ? "Shop chưa có đơn thuê nào."
                        : "Không có đơn thuê nào phù hợp với bộ lọc trong tháng này."}
                </div>
            ) : null}
        </div>
    );
}
