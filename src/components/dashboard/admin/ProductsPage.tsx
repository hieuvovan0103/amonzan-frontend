import { CheckCircle, Filter, Package, XCircle } from "lucide-react";
import { MOCK_ADMIN_PRODUCTS } from "@/data/mockAdminDashboard";
import AdminBadge from "@/components/dashboard/admin/AdminBadge";

export default function ProductsPage() {
    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-bold text-[#222222]">
                    Kiểm duyệt sản phẩm
                </h2>

                <div className="flex gap-3">
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 border border-[#D5D9D9] bg-white rounded-[8px] text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7] transition-all shadow-sm"
                    >
                        <Filter className="w-4 h-4" />
                        Lọc chờ duyệt
                    </button>

                    <button
                        type="button"
                        className="bg-[#232F3E] text-white px-4 py-2 rounded-[8px] text-[13px] font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                    >
                        <Package className="w-4 h-4" />
                        Thêm sản phẩm
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden shadow-sm">
                <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#F7F7F7] border-b border-[#E6E6E6] text-[#565959]">
                        <tr>
                            <th className="p-4 font-semibold">Mã SP</th>
                            <th className="p-4 font-semibold">Tên sản phẩm & Shop</th>
                            <th className="p-4 font-semibold">Danh mục</th>
                            <th className="p-4 font-semibold text-right">Giá thuê / Cọc</th>
                            <th className="p-4 font-semibold text-center">Tồn kho</th>
                            <th className="p-4 font-semibold text-center">Trạng thái</th>
                            <th className="p-4 font-semibold text-center">Kiểm duyệt</th>
                        </tr>
                    </thead>

                    <tbody>
                        {MOCK_ADMIN_PRODUCTS.map((prod) => (
                            <tr
                                key={prod.id}
                                className="border-b border-[#E6E6E6] hover:bg-[#F9FAFB] transition-colors"
                            >
                                <td className="p-4 font-medium text-[#007185] hover:underline cursor-pointer">
                                    {prod.id}
                                </td>
                                <td className="p-4">
                                    <div className="font-semibold text-[#222222] line-clamp-1">
                                        {prod.name}
                                    </div>
                                    <div className="text-[12px] text-[#6B7280]">{prod.shop}</div>
                                </td>
                                <td className="p-4 text-[#565959]">{prod.category}</td>
                                <td className="p-4 text-right">
                                    <div className="font-bold text-[#222222]">{prod.price}</div>
                                    <div className="text-[12px] text-[#C62828] font-medium">
                                        Cọc: {prod.deposit}
                                    </div>
                                </td>
                                <td className="p-4 text-center font-bold text-[#007185]">
                                    {prod.stock}
                                </td>
                                <td className="p-4 text-center">
                                    <AdminBadge status={prod.status} />
                                </td>
                                <td className="p-4 text-center">
                                    {prod.status === "PENDING" ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                className="p-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-md transition-colors"
                                                title="Duyệt"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                className="p-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-md transition-colors"
                                                title="Từ chối"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="text-[#007185] hover:underline font-medium text-[12px]"
                                        >
                                            Chi tiết
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}