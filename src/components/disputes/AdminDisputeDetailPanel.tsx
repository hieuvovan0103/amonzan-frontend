import { FileSearch, Scale, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { AdminDisputeDetail } from "@/types/dispute";
import AdminDisputeStatusBadge, {
    getDisputeDecisionLabel,
} from "@/components/disputes/AdminDisputeStatusBadge";
import DisputeTimeline from "@/components/disputes/DisputeTimeline";
import { useAdminDisputeModalStore } from "@/stores/adminDisputeModalStore";

function formatDate(value: string | null) {
    if (!value) return "Chưa có";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function formatPrice(value: number) {
    return value.toLocaleString("vi-VN");
}

function EvidenceGrid({ title, urls }: { title: string; urls: string[] }) {
    return (
        <div className="rounded-[10px] border border-[#E6E6E6] p-3">
            <div className="font-bold text-[#222222]">{title}</div>
            {urls.length ? (
                <div className="mt-2 grid grid-cols-3 gap-2">
                    {urls.map((imageUrl, index) => (
                        <a
                            key={`${imageUrl}-${index}`}
                            href={imageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="block aspect-square overflow-hidden rounded-[8px] border border-[#E6E6E6] bg-[#F7F7F7]"
                        >
                            <img
                                src={imageUrl}
                                alt={`${title} ${index + 1}`}
                                className="h-full w-full object-cover transition-transform hover:scale-105"
                            />
                        </a>
                    ))}
                </div>
            ) : (
                <div className="mt-2 text-[#565959]">Chưa có ảnh.</div>
            )}
        </div>
    );
}

export default function AdminDisputeDetailPanel({
    dispute,
    isLoading,
}: {
    dispute: AdminDisputeDetail | null;
    isLoading: boolean;
}) {
    const openResolve = useAdminDisputeModalStore((state) => state.openResolve);
    const openRequestEvidence = useAdminDisputeModalStore((state) => state.openRequestEvidence);
    const [isComplaintOpen, setIsComplaintOpen] = useState(false);

    const complaintContent = useMemo(() => {
        if (!dispute) return "";
        return dispute.complaint?.description || dispute.reason || "";
    }, [dispute]);

    useEffect(() => {
        setIsComplaintOpen(false);
    }, [dispute?.disputeId]);

    if (isLoading) {
        return (
            <aside className="rounded-[12px] border border-[#E6E6E6] bg-white p-5 text-[13px] text-[#565959] shadow-sm">
                Đang tải chi tiết...
            </aside>
        );
    }

    if (!dispute) {
        return (
            <aside className="rounded-[12px] border border-[#E6E6E6] bg-white p-5 text-[13px] text-[#565959] shadow-sm">
                Chọn một tranh chấp để xem chi tiết.
            </aside>
        );
    }

    const canAct = !["RESOLVED", "REJECTED"].includes(dispute.status);

    return (
        <aside className="space-y-4 rounded-[12px] border border-[#E6E6E6] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <h3 className="flex items-center gap-2 font-bold text-[#222222]">
                    <Scale className="h-5 w-5 text-[#007600]" />
                    Chi tiết tranh chấp
                </h3>
                <AdminDisputeStatusBadge status={dispute.status} />
            </div>

            <div>
                <div className="font-bold text-[#222222]">
                    {dispute.complaint?.title || dispute.reason || "Khiếu nại hoàn trả"}
                </div>
                <div className="mt-1 text-[13px] text-[#565959]">
                    Mở lúc: {formatDate(dispute.openedAt)}
                </div>
                {dispute.decision ? (
                    <div className="mt-1 text-[13px] font-semibold text-[#007185]">
                        Quyết định: {getDisputeDecisionLabel(dispute.decision)}
                    </div>
                ) : null}
            </div>

            {canAct ? (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => openRequestEvidence(dispute)}
                        className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                    >
                        <FileSearch className="h-4 w-4" />
                        Yêu cầu bằng chứng
                    </button>
                    <button
                        type="button"
                        onClick={() => openResolve(dispute)}
                        className="inline-flex items-center justify-center rounded-[6px] bg-[#007600] px-3 py-2 text-[13px] font-bold text-white hover:bg-[#005F00]"
                    >
                        Xử lý tranh chấp
                    </button>
                </div>
            ) : null}

            <div className="rounded-[10px] border border-[#E6E6E6] bg-[#FAFAFA] p-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="font-bold text-[#222222]">Nội dung khiếu nại</div>
                    <button
                        type="button"
                        onClick={() => setIsComplaintOpen(true)}
                        className="shrink-0 rounded-[6px] border border-[#D5D9D9] bg-white px-3 py-1 text-[11px] font-semibold text-[#222222] hover:bg-[#F7F7F7]"
                    >
                        Xem
                    </button>
                </div>
                <div className="mt-1 text-[13px] text-[#565959]">
                    Nhấn <span className="font-semibold text-[#222222]">Xem</span> để mở nội dung khiếu nại.
                </div>
            </div>

            {isComplaintOpen ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setIsComplaintOpen(false)}
                >
                    <div
                        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[12px] bg-white shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#E6E6E6] px-5 py-4">
                            <div>
                                <h2 className="text-[18px] font-bold text-[#222222]">Nội dung khiếu nại</h2>
                                <p className="mt-1 text-[13px] text-[#565959]">Tranh chấp #{dispute.disputeId.slice(0, 8)}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsComplaintOpen(false)}
                                className="rounded-full p-2 hover:bg-[#F7F7F7]"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-5">
                            <textarea
                                value={complaintContent || "Không có mô tả."}
                                readOnly
                                rows={10}
                                className="w-full resize-none rounded-[10px] border border-[#E6E6E6] bg-white p-3 text-[13px] text-[#565959] outline-none"
                            />
                        </div>

                        <div className="flex justify-end border-t border-[#E6E6E6] px-5 py-4">
                            <button
                                type="button"
                                onClick={() => setIsComplaintOpen(false)}
                                className="rounded-[6px] border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            <div className="rounded-[10px] border border-[#E6E6E6] p-3">
                <div className="font-bold text-[#222222]">Ghi chú hoàn trả</div>
                <div className="mt-2 text-[13px] text-[#565959]">
                    Người thuê: {dispute.returnRecord?.returnRequestNote || "Không có"}
                </div>
                <div className="mt-1 text-[13px] text-[#565959]">
                    Vendor:{" "}
                    {dispute.returnRecord?.vendorReturnNote ||
                        dispute.returnRecord?.returnIssueDescription ||
                        dispute.earlyReturnRequest?.vendorResponseNote ||
                        "Không có"}
                </div>
            </div>

            <EvidenceGrid title="Bằng chứng từ người thuê" urls={dispute.renterEvidenceUrls} />
            <EvidenceGrid title="Bằng chứng từ vendor" urls={dispute.vendorEvidenceUrls} />

            <div className="rounded-[10px] border border-[#E6E6E6] p-3">
                <div className="font-bold text-[#222222]">Các bên liên quan</div>
                <div className="mt-2 text-[13px] text-[#565959]">
                    Người thuê: <span className="font-semibold text-[#222222]">{dispute.renter.fullName}</span>
                </div>
                <div className="mt-1 text-[13px] text-[#565959]">
                    Shop: <span className="font-semibold text-[#222222]">{dispute.shop.name}</span>
                </div>
            </div>

            <div className="rounded-[10px] border border-[#E6E6E6] p-3">
                <div className="font-bold text-[#222222]">Đơn hàng</div>
                <div className="mt-2 text-[13px] text-[#565959]">Mã đơn: #{dispute.orderId.slice(0, 8)}</div>
                <div className="mt-1 text-[13px] text-[#565959]">
                    Trạng thái: <span className="font-semibold text-[#222222]">{dispute.order.status}</span>
                </div>
                <div className="mt-1 text-[13px] text-[#565959]">
                    Thời gian thuê: {formatDate(dispute.order.rentalStart)} - {formatDate(dispute.order.rentalEnd)}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-[13px] text-[#565959]">
                    <div>Tiền cọc: {formatPrice(dispute.order.depositAmount)}đ</div>
                    <div>Tổng tiền: {formatPrice(dispute.order.totalAmount)}đ</div>
                    <div>Phí hư hỏng: {formatPrice(dispute.order.damageFee)}đ</div>
                    <div>Phí trễ hạn: {formatPrice(dispute.order.lateFee)}đ</div>
                </div>
            </div>

            <div className="rounded-[10px] border border-[#E6E6E6] p-3">
                <div className="font-bold text-[#222222]">Sản phẩm</div>
                <div className="mt-2 space-y-1 text-[13px] text-[#565959]">
                    {dispute.items.map((item) => (
                        <div key={item.orderItemId}>
                            {item.productName} {item.variantName ? `(${item.variantName})` : ""} x {item.quantity}
                        </div>
                    ))}
                </div>
            </div>

            {dispute.resolution ? (
                <div className="rounded-[10px] border border-[#E6E6E6] bg-[#F7FFF7] p-3">
                    <div className="font-bold text-[#222222]">Kết luận admin</div>
                    <p className="mt-1 whitespace-pre-line text-[13px] text-[#565959]">{dispute.resolution}</p>
                    {dispute.adminNote ? (
                        <p className="mt-2 whitespace-pre-line text-[13px] text-[#565959]">
                            Ghi chú nội bộ: {dispute.adminNote}
                        </p>
                    ) : null}
                </div>
            ) : null}

            <DisputeTimeline dispute={dispute} />
        </aside>
    );
}
