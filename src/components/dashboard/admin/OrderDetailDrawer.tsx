import { Camera, Clock, X } from "lucide-react";
import { AdminOrder } from "@/types/admin";
import AdminBadge from "@/components/dashboard/admin/AdminBadge";

type OrderDetailDrawerProps = {
    order: AdminOrder | null;
    onClose: () => void;
};

export default function OrderDetailDrawer({
    order,
    onClose,
}: OrderDetailDrawerProps) {
    if (!order) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-[#0F1111]/30 z-[60] animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="fixed top-0 right-0 h-full w-[450px] bg-[#F7F7F7] shadow-[-10px_0_30px_rgba(0,0,0,0.1)] z-[70] flex flex-col overflow-hidden animate-in slide-in-from-right">
                <div className="h-[64px] bg-white border-b border-[#E6E6E6] flex items-center justify-between px-6 flex-shrink-0">
                    <h2 className="text-[18px] font-bold text-[#222222]">
                        Chi tiết đơn {order.id}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-[#F7F7F7] rounded-full text-[#565959] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="bg-white p-5 rounded-[12px] border border-[#E6E6E6] shadow-sm">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E6E6E6]">
                            <span className="text-[13px] text-[#565959] font-medium">
                                Trạng thái đơn:
                            </span>
                            <AdminBadge status={order.status} />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[13px] text-[#565959] font-medium">
                                Trạng thái cọc:
                            </span>
                            <AdminBadge status={order.escrow} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[14px] font-bold text-[#222222] mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#007185]" />
                            Tiến trình vận hành
                        </h3>

                        <div className="relative border-l-2 border-[#D5D9D9] ml-2 pl-4 space-y-6 text-[13px]">
                            <div className="relative">
                                <div className="absolute -left-[23px] w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                                <div className="font-bold text-[#222222]">
                                    Người thuê đặt cọc thành công
                                </div>
                                <div className="text-[#6B7280]">18/04/2026 - 09:30</div>
                            </div>

                            <div className="relative">
                                <div className="absolute -left-[23px] w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                                <div className="font-bold text-[#222222]">
                                    Shop bàn giao cho đơn vị vận chuyển
                                </div>
                                <div className="text-[#6B7280]">19/04/2026 - 14:15</div>
                            </div>

                            <div
                                className={`relative ${order.status === "PENDING" ? "opacity-50" : ""
                                    }`}
                            >
                                <div
                                    className={`absolute -left-[23px] w-4 h-4 rounded-full border-2 border-white ${order.status === "PENDING"
                                            ? "bg-[#D5D9D9]"
                                            : "bg-green-500"
                                        }`}
                                ></div>
                                <div className="font-bold text-[#222222]">
                                    Người thuê xác nhận nhận hàng
                                </div>

                                {order.status !== "PENDING" && (
                                    <button
                                        type="button"
                                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#D5D9D9] rounded-[6px] text-[#007185] hover:bg-[#F7F7F7] font-medium transition-colors"
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                        Xem ảnh đồng kiểm
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-[12px] border border-[#E6E6E6] shadow-sm">
                        <h3 className="text-[14px] font-bold text-[#222222] mb-3">
                            Tài chính & giải ngân
                        </h3>

                        <div className="space-y-2 text-[13px]">
                            <div className="flex justify-between">
                                <span className="text-[#565959]">Tiền thuê đã thu:</span>
                                <span className="font-bold text-[#222222]">
                                    {order.total.toLocaleString()} ₫
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#565959]">Tiền cọc đang giữ:</span>
                                <span className="font-bold text-[#C62828]">
                                    {order.deposit.toLocaleString()} ₫
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[#E6E6E6] flex flex-col gap-2">
                            <button
                                type="button"
                                className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-bold text-[13px] py-2 rounded-[8px] transition-colors shadow-sm"
                            >
                                Giải ngân cho shop
                            </button>
                            <button
                                type="button"
                                className="w-full bg-white hover:bg-red-50 border border-red-200 text-red-600 font-bold text-[13px] py-2 rounded-[8px] transition-colors shadow-sm"
                            >
                                Hoàn cọc / báo cáo sự cố
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}