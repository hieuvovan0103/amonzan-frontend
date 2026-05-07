import { fetchWithAuth } from "@/lib/apiClient";

export type VoucherValidationResult = {
    valid: boolean;
    discountAmount: number;
    voucherId: string | null;
    code?: string;
    scope?: "PLATFORM" | "SHOP";
    shopId?: string | null;
    message: string;
};

export type ManagedVoucher = {
    voucherId: string;
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    validFrom: string;
    validTo: string;
    isActive: boolean;
    scope: "PLATFORM" | "SHOP";
    shopId: string | null;
    shopName: string | null;
    status: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED" | "ARCHIVED" | string;
    rejectionReason: string | null;
    createdAt: string | null;
    updatedAt: string | null;
};

export type VoucherPayload = {
    code: string;
    discountType: "PERCENTAGE" | "FIXED";
    discountValue: number;
    validFrom: string;
    validTo: string;
};

export async function validateVoucher(params: {
    code: string;
    subtotal: number;
    shopId?: string;
}) {
    const response = await fetchWithAuth("/vouchers/validate", {
        method: "POST",
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể kiểm tra mã giảm giá.");
    }

    return response.json() as Promise<VoucherValidationResult>;
}

async function readError(response: Response, fallback: string) {
    const error = await response.json().catch(() => null);
    return error?.message || fallback;
}

export async function getVendorVouchers() {
    const response = await fetchWithAuth("/vendor/vouchers");
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tải voucher của shop."));
    }
    const payload = await response.json();
    return (payload.vouchers ?? []) as ManagedVoucher[];
}

export async function createVendorVoucher(payload: VoucherPayload) {
    const response = await fetchWithAuth("/vendor/vouchers", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tạo voucher."));
    }
    return response.json() as Promise<ManagedVoucher>;
}

export async function submitVendorVoucher(voucherId: string) {
    const response = await fetchWithAuth(`/vendor/vouchers/${voucherId}/submit-review`, {
        method: "PATCH",
    });
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể gửi duyệt voucher."));
    }
    return response.json() as Promise<ManagedVoucher>;
}

export async function getAdminVouchers(params?: { status?: string; scope?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.scope) query.set("scope", params.scope);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    const response = await fetchWithAuth(`/admin/vouchers${suffix}`);
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tải danh sách voucher."));
    }
    const payload = await response.json();
    return (payload.vouchers ?? []) as ManagedVoucher[];
}

export async function createAdminVoucher(payload: VoucherPayload) {
    const response = await fetchWithAuth("/admin/vouchers", {
        method: "POST",
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tạo voucher."));
    }
    return response.json() as Promise<ManagedVoucher>;
}

export async function approveAdminVoucher(voucherId: string) {
    const response = await fetchWithAuth(`/admin/vouchers/${voucherId}/approve`, {
        method: "PATCH",
    });
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể duyệt voucher."));
    }
    return response.json() as Promise<ManagedVoucher>;
}

export async function rejectAdminVoucher(voucherId: string, reason: string) {
    const response = await fetchWithAuth(`/admin/vouchers/${voucherId}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
    });
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể từ chối voucher."));
    }
    return response.json() as Promise<ManagedVoucher>;
}

