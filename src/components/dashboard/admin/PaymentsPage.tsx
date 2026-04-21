import { MOCK_ADMIN_TRANSACTIONS } from "@/data/mockAdminDashboard";
import AdminBadge from "@/components/dashboard/admin/AdminBadge";

export default function PaymentsPage() {
    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-[16px] border border-[#E6E6E6] shadow-sm">
                    <div className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider mb-2">
                        Tổng escrow đang giữ
                    </div>
                    <div className="text-[26px] font-bold text-[#007185]">
                        3.450.000.000 ₫
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[16px] border border-[#E6E6E6] shadow-sm">
                    <div className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider mb-2">
                        Chờ hoàn tiền
                    </div>
                    <div className="text-[26px] font-bold text-orange-600">
                        128.000.000 ₫
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#232F3E] to-[#111111] text-white p-6 rounded-[16px] border border-[#E6E6E6] shadow-sm">
                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Doanh thu phí sàn
                    </div>
                    <div className="text-[26px] font-bold">45.200.000 ₫</div>
                </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden shadow-sm">
                <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#F7F7F7] border-b border-[#E6E6E6] text-[#565959]">
                        <tr>
                            <th className="p-4 font-semibold">ID giao dịch</th>
                            <th className="p-4 font-semibold">Đơn hàng</th>
                            <th className="p-4 font-semibold">Loại giao dịch</th>
                            <th className="p-4 font-semibold">Phương thức</th>
                            <th className="p-4 font-semibold">Số tiền</th>
                            <th className="p-4 text-center font-semibold">Escrow</th>
                        </tr>
                    </thead>

                    <tbody>
                        {MOCK_ADMIN_TRANSACTIONS.map((t) => (
                            <tr
                                key={t.id}
                                className="border-b border-[#E6E6E6] hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-4 font-medium text-[#222222]">{t.id}</td>
                                <td className="p-4 text-[#007185] font-medium hover:underline cursor-pointer">
                                    {t.orderId}
                                </td>
                                <td className="p-4">
                                    <span className="font-semibold text-[#222222]">
                                        {t.type === "RENTAL_FEE"
                                            ? "Tiền thuê"
                                            : t.type === "DEPOSIT"
                                                ? "Tiền cọc"
                                                : "Hoàn tiền"}
                                    </span>
                                </td>
                                <td className="p-4 text-[#6B7280]">{t.method}</td>
                                <td
                                    className={`p-4 font-bold ${t.type === "REFUND" ? "text-red-600" : "text-[#222222]"
                                        }`}
                                >
                                    {t.type === "REFUND" ? "-" : ""}
                                    {t.amount.toLocaleString()} ₫
                                </td>
                                <td className="p-4 text-center">
                                    <AdminBadge status={t.escrow} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}