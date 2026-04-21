import { ChevronRight, Download } from "lucide-react";
import { AdminOrder } from "@/types/admin";
import { MOCK_ADMIN_ORDERS } from "@/data/mockAdminDashboard";
import AdminBadge from "@/components/dashboard/admin/AdminBadge";

type OrdersPageProps = {
    onSelectOrder: (order: AdminOrder) => void;
};

export default function OrdersPage({ onSelectOrder }: OrdersPageProps) {
    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-[24px] font-bold text-[#222222]">
                        Quản lý đơn thuê
                    </h1>
                    <p className="text-[14px] text-[#565959] mt-1">
                        Theo dõi vòng đời đơn hàng từ lúc đặt cọc đến khi trả đồ.
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

            <div className="bg-white rounded-[16px] border border-[#E6E6E6] overflow-hidden shadow-sm">
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
                        {MOCK_ADMIN_ORDERS.map((o) => (
                            <tr
                                key={o.id}
                                className="border-b border-[#E6E6E6] hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                                onClick={() => onSelectOrder(o)}
                            >
                                <td className="p-4 font-bold text-[#007185] hover:underline">
                                    {o.id}
                                </td>
                                <td className="p-4">
                                    <div className="font-bold text-[#222222]">{o.renter}</div>
                                    <div className="text-[11px] text-[#6B7280] font-medium mt-0.5">
                                        Shop: {o.shop}
                                    </div>
                                </td>
                                <td className="p-4 text-[#565959] font-medium">
                                    {o.startDate} - {o.endDate}
                                </td>
                                <td className="p-4 text-right font-bold text-[#222222]">
                                    {(o.total + o.deposit).toLocaleString()} ₫
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
            </div>
        </div>
    );
}