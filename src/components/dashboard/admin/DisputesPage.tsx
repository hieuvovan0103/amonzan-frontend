"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, RefreshCw } from "lucide-react";
import AdminDisputeDetailPanel from "@/components/disputes/AdminDisputeDetailPanel";
import AdminDisputeList from "@/components/disputes/AdminDisputeList";
import AdminResolveDisputeModal from "@/components/disputes/AdminResolveDisputeModal";
import RequestEvidenceModal from "@/components/disputes/RequestEvidenceModal";
import { getAdminDisputeDetail, getAdminDisputes } from "@/lib/api/admin-disputes";
import type { AdminDispute, AdminDisputeDetail } from "@/types/dispute";

const statusFilters = [
    { value: "ALL", label: "Tất cả" },
    { value: "OPEN", label: "Đang mở" },
    { value: "UNDER_REVIEW", label: "Đang xem xét" },
    { value: "NEED_MORE_EVIDENCE", label: "Cần bổ sung bằng chứng" },
    { value: "RESOLVED", label: "Đã xử lý" },
    { value: "REJECTED", label: "Bị từ chối" },
];

export default function DisputesPage() {
    const [disputes, setDisputes] = useState<AdminDispute[]>([]);
    const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
    const [selectedDispute, setSelectedDispute] = useState<AdminDisputeDetail | null>(null);
    const [status, setStatus] = useState("ALL");
    const [isLoadingList, setIsLoadingList] = useState(true);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false);
    const [error, setError] = useState("");

    const openDisputes = useMemo(
        () => disputes.filter((dispute) => !["RESOLVED", "REJECTED"].includes(dispute.status)).length,
        [disputes],
    );

    const loadDisputes = useCallback(async () => {
        setIsLoadingList(true);
        setError("");

        try {
            const data = await getAdminDisputes({ status, limit: 50 });
            setDisputes(data.disputes);
            setSelectedDisputeId((current) => {
                if (current && data.disputes.some((dispute) => dispute.disputeId === current)) {
                    return current;
                }
                return data.disputes[0]?.disputeId ?? null;
            });
        } catch (err: any) {
            setError(err.message || "Không thể tải tranh chấp.");
        } finally {
            setIsLoadingList(false);
        }
    }, [status]);

    const loadSelectedDispute = useCallback(async () => {
        if (!selectedDisputeId) {
            setSelectedDispute(null);
            return;
        }

        setIsLoadingDetail(true);
        try {
            const detail = await getAdminDisputeDetail(selectedDisputeId);
            setSelectedDispute(detail);
        } catch (err: any) {
            setError(err.message || "Không thể tải chi tiết tranh chấp.");
        } finally {
            setIsLoadingDetail(false);
        }
    }, [selectedDisputeId]);

    const refreshAll = useCallback(async () => {
        await loadDisputes();
        await loadSelectedDispute();
    }, [loadDisputes, loadSelectedDispute]);

    useEffect(() => {
        loadDisputes();
    }, [loadDisputes]);

    useEffect(() => {
        loadSelectedDispute();
    }, [loadSelectedDispute]);

    return (
        <div className="animate-in slide-in-from-bottom-4 p-6 duration-500">
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h2 className="text-[20px] font-bold text-[#222222]">Khiếu nại / Tranh chấp</h2>
                    <p className="mt-1 text-[13px] text-[#565959]">
                        Admin xem bằng chứng từ hai bên và đưa ra quyết định cuối cùng.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="flex items-center gap-1 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-[12px] font-bold text-red-700">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        {openDisputes} tranh chấp đang mở
                    </span>
                    <button
                        type="button"
                        onClick={refreshAll}
                        className="inline-flex items-center gap-2 rounded-full border border-[#D5D9D9] bg-white px-3 py-1 text-[12px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Làm mới
                    </button>
                </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {statusFilters.map((filter) => (
                    <button
                        key={filter.value}
                        type="button"
                        onClick={() => setStatus(filter.value)}
                        className={`rounded-full border px-3 py-1 text-[12px] font-bold transition-colors ${
                            status === filter.value
                                ? "border-[#232F3E] bg-[#232F3E] text-white"
                                : "border-[#D5D9D9] bg-white text-[#222222] hover:bg-[#F7F7F7]"
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {error ? (
                <div className="mb-4 rounded-[12px] border border-[#F5C2C7] bg-[#FFF5F5] p-4 text-[13px] font-semibold text-[#842029]">
                    {error}
                </div>
            ) : null}

            {isLoadingList ? (
                <div className="flex min-h-[260px] items-center justify-center rounded-[12px] border border-[#E6E6E6] bg-white">
                    <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                </div>
            ) : disputes.length === 0 ? (
                <div className="rounded-[12px] border border-[#E6E6E6] bg-white p-8 text-center text-[14px] text-[#565959]">
                    Chưa có tranh chấp phù hợp với bộ lọc.
                </div>
            ) : (
                <div className="space-y-6">
                    <AdminDisputeList
                        disputes={disputes}
                        selectedDisputeId={selectedDisputeId}
                        onSelect={setSelectedDisputeId}
                    />
                    <AdminDisputeDetailPanel dispute={selectedDispute} isLoading={isLoadingDetail} />
                </div>
            )}

            <RequestEvidenceModal onRequested={refreshAll} />
            <AdminResolveDisputeModal onResolved={refreshAll} />
        </div>
    );
}
