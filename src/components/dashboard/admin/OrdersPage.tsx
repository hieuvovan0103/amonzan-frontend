import { ChevronRight, Download, Loader2, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import AdminBadge from "@/components/dashboard/admin/AdminBadge";
import SimplePagination from "@/components/ui/SimplePagination";
import { getAdminOrders, type AdminOrderListItem } from "@/lib/api/adminOrders";

type OrdersPageProps = {
    onSelectOrder: (order: AdminOrderListItem) => void;
};

export default function OrdersPage({ onSelectOrder }: OrdersPageProps) {
    const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState("ALL");
    const [keyword, setKeyword] = useState("");
    const pageSize = 20;

    const [pagination, setPagination] = useState({
        page: 1,
        limit: pageSize,
        total: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
    });

    const loadOrders = useCallback(async (nextPage: number) => {
        setIsLoading(true);
        setError(null);

        try {
            const payload = await getAdminOrders({
                page: nextPage,
                limit: pageSize,
                status,
                search: keyword.trim() || undefined,
            });
            setOrders(payload.orders ?? []);
            setPagination(payload.pagination);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Không thể tải danh sách đơn thuê.");
        } finally {
            setIsLoading(false);
        }
    }, [keyword, status]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadOrders(1);
        }, 0);
        return () => window.clearTimeout(timer);
    }, [loadOrders, status, keyword]);

    const totalPages = pagination.totalPages ?? 1;

    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-[24px] font-bold text-[#222222]">
                        Quản lý đơn thuê
                    </h1>
                    <p className="text-[14px] text-[#565959] mt-1">
                        Theo dõi vòng đời đơn hàng từ lúc thanh toán đến khi trả đồ.
                    </p>
                </div>

                <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 border border-[#D5D9D9] bg-white rounded-[8px] text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7] transition-all shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    Xuất báo cáo CSV
                </button>
            </div>

            <div className="mb-4 flex flex-col gap-2 rounded-[12px] border border-[#E6E6E6] bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#007185]"
                    >
                        <option value="ALL">Tất cả trạng thái</option>
                        <option value="PENDING_VENDOR_APPROVAL">Chờ shop duyệt</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="READY_FOR_PICKUP">Sẵn sàng giao</option>
                        <option value="IN_RENTAL">Đang thuê</option>
                        <option value="RETURN_PENDING">Chờ trả hàng</option>
                        <option value="COMPLETED">Hoàn tất</option>
                        <option value="DISPUTED">Tranh chấp</option>
                        <option value="CANCELLED">Đã hủy</option>
                    </select>
                </div>

                <div className="relative w-full sm:w-[320px]">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
                    <input
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Tìm theo mã đơn (UUID)..."
                        className="w-full rounded-[8px] border border-[#D5D9D9] py-2 pl-9 pr-3 text-[13px] outline-none focus:border-[#007185]"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[16px] border border-[#E6E6E6] overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-10 text-center text-[14px] text-[#565959]">
                        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                        Đang tải đơn thuê...
                    </div>
                ) : error ? (
                    <div className="p-6 text-[13px] font-semibold text-[#842029]">{error}</div>
                ) : (
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#F7F7F7] border-b border-[#E6E6E6] text-[#565959]">
                            <tr>
                                <th className="p-4 font-semibold">Mã đơn</th>
                                <th className="p-4 font-semibold">Bên thuê / Cửa hàng</th>
                                <th className="p-4 font-semibold">Thời gian thuê</th>
                                <th className="p-4 font-semibold text-right">Tổng cộng</th>
                                <th className="p-4 font-semibold text-center">Trạng thái</th>
                                <th className="p-4 font-semibold text-center">Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {orders.map((o) => (
                                <tr
                                    key={o.id}
                                    className="border-b border-[#E6E6E6] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                                    onClick={() => onSelectOrder(o)}
                                >
                                    <td className="p-4 font-bold text-[#007185] hover:underline">
                                        {o.id.slice(0, 8)}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold text-[#222222]">{o.renter}</div>
                                        <div className="text-[11px] text-[#6B7280] font-medium mt-0.5">
                                            Shop: {o.shop}
                                        </div>
                                    </td>
                                    <td className="p-4 text-[#565959] font-medium">
                                        {new Date(o.startDate).toLocaleDateString("vi-VN")} -{" "}
                                        {new Date(o.endDate).toLocaleDateString("vi-VN")}
                                    </td>
                                    <td className="p-4 text-right font-bold text-[#222222]">
                                        {o.total.toLocaleString()} ₫
                                    </td>
                                    <td className="p-4 text-center">
                                        <AdminBadge status={o.status} />
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            type="button"
                                            className="p-1.5 hover:bg-gray-200 rounded-lg text-[#565959] hover:text-[#222222] transition-colors"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSelectOrder(o);
                                            }}
                                        >
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {!isLoading ? (
                <SimplePagination
                    page={pagination.page}
                    totalPages={totalPages}
                    onPageChange={(next) => {
                        const bounded = Math.min(Math.max(1, next), totalPages);
                        void loadOrders(bounded);
                    }}
                />
            ) : null}
        </div>
    );
}
