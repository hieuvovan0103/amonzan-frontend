import { fetchWithAuth } from "@/lib/apiClient";
import type { ReturnConditionStatus, ReturnRequest, ReturnRequestsResponse } from "@/types/return";

async function readError(response: Response, fallback: string) {
    const error = await response.json().catch(() => null);
    return error?.message || fallback;
}

export async function createReturnRequest(params: {
    orderId: string;
    note?: string;
    conditionStatus?: ReturnConditionStatus;
    evidenceUrls?: string[];
}) {
    const response = await fetchWithAuth(`/orders/${params.orderId}/return-request`, {
        method: "POST",
        body: JSON.stringify({
            note: params.note,
            conditionStatus: params.conditionStatus,
            evidenceUrls: params.evidenceUrls,
        }),
    });

    if (!response.ok) {
        throw new Error(await readError(response, "Không thể gửi yêu cầu hoàn trả."));
    }

    return response.json();
}

export async function getMyReturnRequests(status = "ALL", page = 1, limit = 20) {
    const params = new URLSearchParams({
        status,
        page: String(page),
        limit: String(limit),
    });
    const response = await fetchWithAuth(`/me/return-requests?${params.toString()}`);

    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tải yêu cầu hoàn trả."));
    }

    return response.json() as Promise<ReturnRequestsResponse>;
}

export async function getVendorReturnRequests(status = "ALL", page = 1, limit = 20) {
    const params = new URLSearchParams({
        status,
        page: String(page),
        limit: String(limit),
    });
    const response = await fetchWithAuth(`/vendor/return-requests?${params.toString()}`);

    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tải yêu cầu hoàn trả của shop."));
    }

    return response.json() as Promise<ReturnRequestsResponse>;
}

export async function getReturnRequestDetail(orderId: string) {
    const response = await fetchWithAuth(`/return-requests/${orderId}`);

    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tải chi tiết hoàn trả."));
    }

    return response.json() as Promise<{ request: ReturnRequest }>;
}

export async function vendorConfirmReturn(orderId: string, payload: { note?: string; returnedAt?: string }) {
    const response = await fetchWithAuth(`/vendor/return-requests/${orderId}/confirm`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await readError(response, "Không thể xác nhận hoàn trả."));
    }

    return response.json();
}

export async function vendorReportReturnIssue(
    orderId: string,
    payload: {
        issueReason: string;
        issueDescription?: string;
        damageFee?: number;
        lateFee?: number;
        evidenceUrls?: string[];
    },
) {
    const response = await fetchWithAuth(`/vendor/return-requests/${orderId}/report-issue`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await readError(response, "Không thể báo vấn đề hoàn trả."));
    }

    return response.json();
}

export async function createReturnComplaint(
    orderId: string,
    payload: { title: string; description?: string; evidenceUrls?: string[] },
) {
    const response = await fetchWithAuth(`/orders/${orderId}/return-complaint`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await readError(response, "Không thể gửi khiếu nại hoàn trả."));
    }

    return response.json();
}

export async function createEarlyReturnComplaint(
    orderId: string,
    payload: { title: string; description?: string; evidenceUrls?: string[] },
) {
    const response = await fetchWithAuth(`/orders/${orderId}/early-return-complaint`, {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(await readError(response, "Không thể gửi khiếu nại trả hàng sớm."));
    }

    return response.json();
}
