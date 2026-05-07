type ReturnStatusBadgeProps = {
    status: string;
    vendorStatus?: string | null;
};

function getLabel(status: string, vendorStatus?: string | null) {
    if (vendorStatus === "ISSUE_REPORTED") return "Shop báo vấn đề";
    if (vendorStatus === "CONFIRMED") return "Hoàn trả thành công";

    const labels: Record<string, string> = {
        RETURN_PENDING: "Chờ shop xử lý",
        COMPLETED: "Hoàn trả thành công",
        DISPUTED: "Đang tranh chấp",
    };

    return labels[status] ?? status;
}

export default function ReturnStatusBadge({ status, vendorStatus }: ReturnStatusBadgeProps) {
    const tone =
        status === "DISPUTED" || vendorStatus === "ISSUE_REPORTED"
            ? "border-[#F5C2C7] bg-[#FFF5F5] text-[#842029]"
            : status === "COMPLETED" || vendorStatus === "CONFIRMED"
              ? "border-[#BADBCC] bg-[#F0FFF4] text-[#0F5132]"
              : "border-[#FFE69C] bg-[#FFF8E1] text-[#8A5A00]";

    return (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${tone}`}>
            {getLabel(status, vendorStatus)}
        </span>
    );
}
