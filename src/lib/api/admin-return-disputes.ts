import { fetchWithAuth } from "@/lib/apiClient";
import type { AdminReturnDispute } from "@/types/admin";

export async function getAdminReturnDisputes() {
    const response = await fetchWithAuth("/admin/return-disputes");

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể tải tranh chấp hoàn trả.");
    }

    const payload = (await response.json()) as { disputes: AdminReturnDispute[] };
    return payload.disputes ?? [];
}

export async function resolveAdminReturnDispute(disputeId: string, resolution: string) {
    const response = await fetchWithAuth(`/admin/return-disputes/${disputeId}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({ resolution }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể xử lý tranh chấp.");
    }

    return response.json() as Promise<{
        disputeId: string;
        orderId: string;
        status: "RESOLVED";
        resolvedAt: string;
        message: string;
    }>;
}
