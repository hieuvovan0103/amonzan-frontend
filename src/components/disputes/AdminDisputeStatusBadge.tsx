import type { AdminDisputeDecision } from "@/types/dispute";

const statusLabels: Record<string, string> = {
    OPEN: "Đang mở",
    UNDER_REVIEW: "Đang xem xét",
    NEED_MORE_EVIDENCE: "Cần bổ sung bằng chứng",
    RESOLVED: "Đã xử lý",
    REJECTED: "Bị từ chối",
};

const statusStyles: Record<string, string> = {
    OPEN: "border-yellow-200 bg-yellow-50 text-yellow-800",
    UNDER_REVIEW: "border-blue-200 bg-blue-50 text-blue-800",
    NEED_MORE_EVIDENCE: "border-orange-200 bg-orange-50 text-orange-800",
    RESOLVED: "border-green-200 bg-green-50 text-green-800",
    REJECTED: "border-red-200 bg-red-50 text-red-800",
};

const decisionLabels: Record<AdminDisputeDecision, string> = {
    FULL_REFUND: "Hoàn tiền toàn phần",
    PARTIAL_REFUND: "Hoàn tiền một phần",
    NO_REFUND: "Không hoàn tiền",
    RELEASE_TO_VENDOR: "Chuyển tiền cho vendor",
    DEDUCT_DEPOSIT: "Trừ tiền cọc",
    REFUND_DEPOSIT: "Hoàn tiền cọc",
    SPLIT_AMOUNT: "Chia tiền",
};

export function getDisputeDecisionLabel(decision: AdminDisputeDecision | string | null) {
    if (!decision) return "Chưa có quyết định";
    return decisionLabels[decision as AdminDisputeDecision] ?? decision;
}

export default function AdminDisputeStatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${
                statusStyles[status] ?? "border-gray-200 bg-gray-50 text-gray-700"
            }`}
        >
            {statusLabels[status] ?? status}
        </span>
    );
}
