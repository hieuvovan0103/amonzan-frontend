type AdminBadgeProps = {
    status: string;
};

export default function AdminBadge({ status }: AdminBadgeProps) {
    const styles: Record<string, string> = {
        ACTIVE_RENTAL: "bg-purple-100 text-purple-800 border-purple-200",
        DISPUTED: "bg-red-100 text-red-800 border-red-200",
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        COMPLETED: "bg-green-100 text-green-800 border-green-200",
        IN_TRANSIT: "bg-teal-100 text-teal-800 border-teal-200",
        AVAILABLE: "bg-green-100 text-green-800 border-green-200",
        RENTED: "bg-purple-100 text-purple-800 border-purple-200",
        MAINTENANCE: "bg-orange-100 text-orange-800 border-orange-200",
        DAMAGED: "bg-red-100 text-red-800 border-red-200",
        HELD: "bg-blue-100 text-blue-800 border-blue-200",
        RELEASED: "bg-green-100 text-green-800 border-green-200",
        SUCCESS: "bg-green-100 text-green-800 border-green-200",
        RESOLVED: "bg-gray-100 text-gray-800 border-gray-200",
        APPROVED: "bg-green-100 text-green-800 border-green-200",
        REJECTED: "bg-red-100 text-red-800 border-red-200",
        VERIFIED: "bg-blue-50 text-blue-700 border-blue-200",
        WARNING: "bg-orange-50 text-orange-700 border-orange-200",
        SHOP: "bg-gray-100 text-gray-800 border-gray-200",
        RENTER: "bg-white text-gray-600 border-gray-200",
    };

    const labels: Record<string, string> = {
        ACTIVE_RENTAL: "Đang thuê",
        DISPUTED: "Tranh chấp",
        PENDING: "Chờ xử lý",
        COMPLETED: "Hoàn thành",
        IN_TRANSIT: "Đang giao",
        AVAILABLE: "Sẵn sàng",
        RENTED: "Đang cho thuê",
        MAINTENANCE: "Bảo trì",
        DAMAGED: "Hư hỏng",
        HELD: "Đang giữ cọc",
        RELEASED: "Đã giải ngân",
        SUCCESS: "Thành công",
        RESOLVED: "Đã giải quyết",
        APPROVED: "Đã duyệt",
        REJECTED: "Từ chối",
        VERIFIED: "Đã xác thực",
        WARNING: "Cảnh báo",
        SHOP: "Shop",
        RENTER: "Người thuê",
    };

    return (
        <span
            className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${styles[status] || "bg-gray-100 text-gray-800 border-gray-200"
                }`}
        >
            {labels[status] || status}
        </span>
    );
}