import { fetchWithAuth } from "../apiClient";
import { ApiProduct } from "@/types/vendor";
import { VendorPartnerType } from "@/types/vendor-registration";

export interface RegisterVendorPayload {
  shopName: string;
  contactPhone: string;
  contactEmail: string;
  description?: string;
  province: string;
  district: string;
  addressDetail: string;
  partnerType: VendorPartnerType;
  identityNumber: string;
  identityFrontUrl?: string;
  identityBackUrl?: string;
}

export async function registerVendorApi(payload: RegisterVendorPayload) {
  const response = await fetchWithAuth("/vendors/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      // Ignored
    }
    throw new Error(errorData?.message || "Đăng ký gian hàng thất bại. Vui lòng thử lại.");
  }

  return response.json();
}

// ─── Vendor Products API ────────────────────────────────────────────────────────

export async function getVendorProducts(): Promise<ApiProduct[]> {
  const response = await fetchWithAuth("/vendor/products");
  if (!response.ok) {
    throw new Error("Không thể tải danh sách sản phẩm.");
  }
  return response.json();
}

export async function getVendorProductDetail(productId: string): Promise<ApiProduct> {
  const response = await fetchWithAuth(`/vendor/products/${productId}`);
  if (!response.ok) {
    throw new Error("Không thể tải thông tin chi tiết sản phẩm.");
  }
  return response.json();
}

export async function createVendorProduct(payload: any): Promise<ApiProduct> {
  const response = await fetchWithAuth("/vendor/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Tạo sản phẩm thất bại.");
  }
  return response.json();
}

export async function updateVendorProduct(productId: string, payload: any): Promise<ApiProduct> {
  const response = await fetchWithAuth(`/vendor/products/${productId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Cập nhật sản phẩm thất bại.");
  }
  return response.json();
}

export async function updateVendorProductStatus(
  productId: string,
  status: "DRAFT" | "ACTIVE" | "ARCHIVED"
): Promise<ApiProduct> {
  const response = await fetchWithAuth(`/vendor/products/${productId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Cập nhật trạng thái thất bại.");
  }
  return response.json();
}
