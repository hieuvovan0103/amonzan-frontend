import { AlertTriangle, ShieldCheck } from "lucide-react";
import { MOCK_ADMIN_DISPUTES } from "@/data/mockAdminDashboard";
import AdminBadge from "@/components/dashboard/admin/AdminBadge";

export default function DisputesPage() {
    return (
        <div className="p-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-bold text-[#222222]">
                    Tranh chấp & khiếu nại
                </h2>

                <div className="flex gap-2">
                    <span className="bg-red-50 text-red-700 text-[12px] font-bold px-3 py-1 rounded-full border border-red-100 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        12 tranh chấp mới
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden shadow-sm h-fit">
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#F7F7F7] border-b border-[#E6E6E6]">
                            <tr>
                                <th className="p-4">Mã tranh chấp</th>
                                <th className="p-4">Đơn hàng</th>
                                <th className="p-4">Bên khiếu nại</th>
                                <th className="p-4">Loại</th>
                                <th className="p-4">Trạng thái</th>
                                <th className="p-4">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody>
                            {MOCK_ADMIN_DISPUTES.map((d) => (
                                <tr
                                    key={d.id}
                                    className="border-b border-[#E6E6E6] hover:bg-[#F9FAFB] transition-colors"
                                >
                                    <td className="p-4 font-bold">{d.id}</td>
                                    <td className="p-4 text-[#007185] hover:underline cursor-pointer font-medium">
                                        {d.orderId}
                                    </td>
                                    <td className="p-4">{d.renter}</td>
                                    <td className="p-4 font-medium">
                                        {d.type === "DAMAGE_REPORT" ? "Hư hỏng đồ" : "Không giao hàng"}
                                    </td>
                                    <td className="p-4">
                                        <AdminBadge status={d.status} />
                                    </td>
                                    <td className="p-4">
                                        <button
                                            type="button"
                                            className="bg-[#232F3E] text-white px-3 py-1 rounded-[6px] text-[11px] font-semibold hover:bg-black transition-colors"
                                        >
                                            Xử lý
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-[12px] border border-[#E6E6E6] p-5 shadow-sm space-y-4">
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-[#222222]">
                        <ShieldCheck className="w-5 h-5 text-[#007600]" />
                        Quy trình phân xử
                    </h3>

                    <p className="text-[13px] text-[#565959] leading-relaxed">
                        Admin cần đối chiếu hình ảnh khi giao và khi trả trước khi quyết định
                        giải ngân hay hoàn tiền cọc.
                    </p>

                    <div className="p-4 bg-red-50 rounded-[12px] text-[12px] border border-red-100 flex gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <div>
                            <span className="font-bold text-red-800 block mb-1">
                                Cảnh báo hệ thống:
                            </span>
                            Shop Camera Rent Pro đang có tỷ lệ tranh chấp cao vượt ngưỡng an toàn.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}