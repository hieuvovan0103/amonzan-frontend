import { fetchWithAuth } from "@/lib/apiClient";
import type {
    AdminDispute,
    AdminDisputeDetail,
    AdminDisputePagination,
    RequestEvidencePayload,
    ResolveDisputePayload,
} from "@/types/dispute";

async function readError(response: Response, fallback: string) {
    const error = await response.json().catch(() => null);
    return error?.message || fallback;
}

export async function getAdminDisputes(params: {
    status?: string;
    page?: number;
    limit?: number;
} = {}) {
    const search = new URLSearchParams();
    if (params.status && params.status !== "ALL") search.set("status", params.status);
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));

    const response = await fetchWithAuth(`/admin/disputes${search.toString() ? `?${search}` : ""}`);
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tải danh sách tranh chấp."));
    }

    return response.json() as Promise<{
        disputes: AdminDispute[];
        pagination: AdminDisputePagination;
    }>;
}

export async function getAdminDisputeDetail(disputeId: string) {
    const response = await fetchWithAuth(`/admin/disputes/${disputeId}`);
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tải chi tiết tranh chấp."));
    }

    const payload = (await response.json()) as { dispute: AdminDisputeDetail };
    return payload.dispute;
}

export async function requestDisputeEvidence(disputeId: string, payload: RequestEvidencePayload) {
    const response = await fetchWithAuth(`/admin/disputes/${disputeId}/request-evidence`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể yêu cầu bổ sung bằng chứng."));
    }

    return response.json() as Promise<{ disputeId: string; status: string; message: string }>;
}

export async function resolveAdminDispute(disputeId: string, payload: ResolveDisputePayload) {
    const response = await fetchWithAuth(`/admin/disputes/${disputeId}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({
            decision: payload.decision,
            refund_amount: payload.refundAmount,
            damage_fee: payload.damageFee,
            late_fee: payload.lateFee,
            resolution: payload.resolution,
            admin_note: payload.adminNote,
        }),
    });
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể xử lý tranh chấp."));
    }

    return response.json() as Promise<{ disputeId: string; orderId: string; status: string; message: string }>;
}
