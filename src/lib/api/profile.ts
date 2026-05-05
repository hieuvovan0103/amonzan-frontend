import { fetchWithAuth } from "@/lib/apiClient";

export type ProfileAddress = {
    address_id: string;
    user_id: string;
    recipient_name: string;
    phone_number: string;
    line1: string;
    line2?: string | null;
    ward?: string | null;
    district?: string | null;
    city?: string | null;
    province?: string | null;
    postal_code?: string | null;
    country: string;
    is_default: boolean;
};

export type AddressPayload = {
    recipient_name: string;
    phone_number: string;
    line1: string;
    line2?: string;
    ward?: string;
    district?: string;
    city?: string;
    province?: string;
    postal_code?: string;
    country?: string;
    is_default?: boolean;
};

export async function getProfileAddresses() {
    const response = await fetchWithAuth("/profile/addresses");

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể tải địa chỉ giao nhận.");
    }

    return response.json() as Promise<ProfileAddress[]>;
}

export async function createProfileAddress(payload: AddressPayload) {
    const response = await fetchWithAuth("/profile/addresses", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể thêm địa chỉ giao nhận.");
    }

    return response.json() as Promise<ProfileAddress>;
}

export async function updateProfileAddress(
    addressId: string,
    payload: Partial<AddressPayload>,
) {
    const response = await fetchWithAuth(`/profile/addresses/${addressId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể cập nhật địa chỉ giao nhận.");
    }

    return response.json() as Promise<ProfileAddress>;
}

export async function deleteProfileAddress(addressId: string) {
    const response = await fetchWithAuth(`/profile/addresses/${addressId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể xóa địa chỉ giao nhận.");
    }

    return response.json() as Promise<{ message: string }>;
}
