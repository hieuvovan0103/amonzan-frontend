import { fetchWithAuth } from "@/lib/apiClient";
import type {
    AdminVendorVerificationRequest,
    VendorVerificationTab,
} from "@/types/admin-vendor";

export async function getVendorVerificationRequests(
    status: VendorVerificationTab = "PENDING"
): Promise<AdminVendorVerificationRequest[]> {
    const params = new URLSearchParams();
    params.set("status", status);

    const response = await fetchWithAuth(
        `/vendors/admin/requests?${params.toString()}`
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.message ||
                "Khong the tai danh sach yeu cau xac thuc vendor."
        );
    }

    return response.json();
}

async function reviewVendorRequest(
    shopId: string,
    action: "approve" | "reject"
): Promise<AdminVendorVerificationRequest> {
    const response = await fetchWithAuth(
        `/vendors/admin/requests/${shopId}/${action}`,
        {
            method: "PATCH",
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
            errorData?.message || "Khong the cap nhat trang thai vendor."
        );
    }

    const data = await response.json();
    return data.vendor as AdminVendorVerificationRequest;
}

export function approveVendorVerification(shopId: string) {
    return reviewVendorRequest(shopId, "approve");
}

export function rejectVendorVerification(shopId: string) {
    return reviewVendorRequest(shopId, "reject");
}
