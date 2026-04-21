"use client";

import { useState } from "react";
import { AlertOctagon } from "lucide-react";
import { AdminUser } from "@/types/admin";

type BanUserModalProps = {
    user: AdminUser | null;
    onClose: () => void;
};

export default function BanUserModal({
    user,
    onClose,
}: BanUserModalProps) {
    const [confirmText, setConfirmText] = useState("");
    const [reason, setReason] = useState("");

    if (!user) return null;

    const isMatched = confirmText === user.name;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div
                className="absolute inset-0 bg-[#0F1111]/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white w-full max-w-[500px] rounded-[16px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
                <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertOctagon className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-[18px] font-bold text-red-800">
                            Đình chỉ tài khoản
                        </h2>
                        <p className="text-[13px] text-red-600">
                            Hành động này có thể ảnh hưởng đến đơn hàng và dòng tiền.
                        </p>
                    </div>
                </div>

                <div className="p-6 pb-2">
                    <p className="text-[14px] text-[#222222] font-medium mb-3">
                        Bạn đang chuẩn bị khóa tài khoản{" "}
                        <span className="font-bold">{user.name}</span>. Hãy xem xét các hậu
                        quả sau:
                    </p>

                    <div className="bg-[#F7F7F7] border border-[#E6E6E6] rounded-[8px] p-4 space-y-2 mb-6">
                        <div className="flex justify-between text-[13px]">
                            <span className="text-[#565959]">Đơn hàng đang hoạt động:</span>
                            <span className="font-bold text-orange-600">
                                {user.activeOrders} đơn
                            </span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                            <span className="text-[#565959]">Tiền cọc đang giữ:</span>
                            <span className="font-bold text-[#C62828]">
                                {user.escrowBalance.toLocaleString()} ₫
                            </span>
                        </div>
                        <p className="text-[12px] text-[#6B7280] italic mt-2 pt-2 border-t border-[#D5D9D9]">
                            Khi khóa tài khoản, các đơn liên quan có thể cần xử lý thủ công.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                Lý do đình chỉ *
                            </label>
                            <select
                                className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828]"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value="">-- Chọn lý do --</option>
                                <option value="fraud">Gian lận / chiếm đoạt tài sản</option>
                                <option value="policy">Vi phạm chính sách nhiều lần</option>
                                <option value="dispute">Tỉ lệ tranh chấp quá cao</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                Gõ <span className="text-[#C62828]">{user.name}</span> để xác
                                nhận
                            </label>
                            <input
                                type="text"
                                placeholder="Nhập chính xác tên tài khoản..."
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828]"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 flex items-center justify-end gap-3 mt-4 border-t border-[#E6E6E6]">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-[14px] font-bold text-[#565959] hover:bg-[#E6E6E6] rounded-[8px] transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="button"
                        disabled={!isMatched || !reason}
                        className="px-4 py-2 bg-[#C62828] text-white text-[14px] font-bold rounded-[8px] hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        Đình chỉ tài khoản
                    </button>
                </div>
            </div>
        </div>
    );
}