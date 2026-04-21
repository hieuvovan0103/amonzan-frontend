"use client";

import { Search, UserX } from "lucide-react";
import { useState } from "react";
import { MOCK_ADMIN_USERS } from "@/data/mockAdminDashboard";
import { AdminUser } from "@/types/admin";
import AdminBadge from "@/components/dashboard/admin/AdminBadge";
import BanUserModal from "@/components/dashboard/admin/BanUserModal";

export default function AccountsPage() {
    const [userToBan, setUserToBan] = useState<AdminUser | null>(null);

    return (
        <div className="animate-in fade-in duration-500 p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-[20px] font-bold text-[#222222]">
                        Quản lý tài khoản & phân quyền
                    </h2>
                    <p className="text-[14px] text-[#565959] mt-1">
                        Quản lý shop, người thuê và kiểm soát rủi ro nền tảng.
                    </p>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm tên, email, số điện thoại..."
                        className="w-[250px] border border-[#D5D9D9] rounded-[8px] pl-9 pr-3 py-2 text-[13px] outline-none focus:border-[#007185]"
                    />
                    <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden shadow-sm">
                <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#F7F7F7] border-b border-[#E6E6E6] text-[#565959]">
                        <tr>
                            <th className="p-4 font-semibold">Tên tài khoản</th>
                            <th className="p-4 font-semibold">Vai trò</th>
                            <th className="p-4 font-semibold text-center">Uy tín</th>
                            <th className="p-4 font-semibold text-right">Đơn active / Cọc giữ</th>
                            <th className="p-4 font-semibold text-center">Trạng thái</th>
                            <th className="p-4 font-semibold text-center">Rủi ro</th>
                        </tr>
                    </thead>

                    <tbody>
                        {MOCK_ADMIN_USERS.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-[#E6E6E6] hover:bg-[#F9FAFB] transition-colors"
                            >
                                <td className="p-4">
                                    <div className="font-bold text-[#007185] hover:underline cursor-pointer">
                                        {user.name}
                                    </div>
                                    <div className="text-[11px] text-[#6B7280]">
                                        Tham gia: {user.joined}
                                    </div>
                                </td>

                                <td className="p-4">
                                    <AdminBadge status={user.type} />
                                </td>

                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-1 font-bold text-[#222222]">
                                        {user.rating} <span className="text-[#FFA41C]">★</span>
                                    </div>
                                </td>

                                <td className="p-4 text-right">
                                    <div className="font-bold text-[#222222]">
                                        {user.activeOrders} đơn
                                    </div>
                                    <div className="text-[11px] text-[#C62828]">
                                        Cọc: {user.escrowBalance.toLocaleString()} ₫
                                    </div>
                                </td>

                                <td className="p-4 text-center">
                                    <AdminBadge status={user.status} />
                                </td>

                                <td className="p-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setUserToBan(user)}
                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition-colors"
                                        title="Đình chỉ / khóa"
                                    >
                                        <UserX className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <BanUserModal user={userToBan} onClose={() => setUserToBan(null)} />
        </div>
    );
}