import type { AdminDispute } from "@/types/dispute";
import AdminDisputeStatusBadge from "@/components/disputes/AdminDisputeStatusBadge";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

function getDisputeTypeLabel(type: string) {
    const labels: Record<string, string> = {
        RETURN_DISPUTE: "Khiếu nại hoàn trả",
        EARLY_RETURN_DISPUTE: "Khiếu nại trả hàng sớm",
    };
    return labels[type] ?? type;
}

type AdminDisputeListProps = {
    disputes: AdminDispute[];
    selectedDisputeId: string | null;
    onSelect: (disputeId: string) => void;
};

export default function AdminDisputeList({
    disputes,
    selectedDisputeId,
    onSelect,
}: AdminDisputeListProps) {
    return (
        <div className="h-fit overflow-x-auto rounded-[12px] border border-[#E6E6E6] bg-white shadow-sm">
            <table className="w-full text-left text-[13px]">
                <thead className="border-b border-[#E6E6E6] bg-[#F7F7F7]">
                    <tr>
                        <th className="p-4">Mã tranh chấp</th>
                        <th className="p-4">Đơn hàng</th>
                        <th className="p-4">Người khiếu nại</th>
                        <th className="p-4">Loại</th>
                        <th className="p-4">Mở lúc</th>
                        <th className="p-4">Trạng thái</th>
                        <th className="p-4">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {disputes.map((dispute) => (
                        <tr
                            key={dispute.disputeId}
                            className={`border-b border-[#E6E6E6] transition-colors hover:bg-[#F9FAFB] ${
                                selectedDisputeId === dispute.disputeId ? "bg-[#FFF8E1]" : ""
                            }`}
                        >
                            <td className="p-4 font-bold">#{dispute.disputeId.slice(0, 8)}</td>
                            <td className="p-4 font-medium text-[#007185]">
                                #{dispute.orderId.slice(0, 8)}
                            </td>
                            <td className="p-4">
                                {dispute.complaint?.complainantName || dispute.renter.fullName}
                            </td>
                            <td className="p-4 font-medium">{getDisputeTypeLabel(dispute.type)}</td>
                            <td className="p-4 text-[#565959]">{formatDate(dispute.openedAt)}</td>
                            <td className="p-4">
                                <AdminDisputeStatusBadge status={dispute.status} />
                            </td>
                            <td className="p-4">
                                <button
                                    type="button"
                                    onClick={() => onSelect(dispute.disputeId)}
                                    className="rounded-[6px] bg-[#232F3E] px-3 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-black"
                                >
                                    Xem
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
