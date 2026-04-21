import { Box, RefreshCcw } from "lucide-react";
import { MOCK_ADMIN_INVENTORY } from "@/data/mockAdminDashboard";
import AdminBadge from "@/components/dashboard/admin/AdminBadge";

export default function InventoryPage() {
    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-bold text-[#222222]">
                    Quản lý tồn kho
                </h2>

                <button
                    type="button"
                    className="bg-[#232F3E] text-white px-4 py-2 rounded-[8px] text-[13px] font-medium flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <Box className="w-4 h-4" />
                    Thêm item lẻ
                </button>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden shadow-sm">
                <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#F7F7F7] border-b border-[#E6E6E6] text-[#565959]">
                        <tr>
                            <th className="p-4 font-semibold">Mã item</th>
                            <th className="p-4 font-semibold">Sản phẩm / Biến thể</th>
                            <th className="p-4 font-semibold">Trạng thái</th>
                            <th className="p-4 font-semibold">Tình trạng</th>
                            <th className="p-4 font-semibold">Kiểm tra cuối</th>
                            <th className="p-4 font-semibold text-center">Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {MOCK_ADMIN_INVENTORY.map((item) => (
                            <tr
                                key={item.id}
                                className="border-b border-[#E6E6E6] hover:bg-[#F9FAFB] transition-colors"
                            >
                                <td className="p-4 font-medium text-[#007185]">{item.id}</td>
                                <td className="p-4">
                                    <div className="font-semibold text-[#222222]">
                                        {item.product}
                                    </div>
                                    <div className="text-[12px] text-[#6B7280]">
                                        {item.variant}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <AdminBadge status={item.status} />
                                </td>
                                <td className="p-4 font-medium">{item.condition}</td>
                                <td className="p-4 text-[#6B7280]">{item.lastCheck}</td>
                                <td className="p-4 text-center">
                                    <button
                                        type="button"
                                        className="text-[#565959] hover:text-[#232F3E] p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
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