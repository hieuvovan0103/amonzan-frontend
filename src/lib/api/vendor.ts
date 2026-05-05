import { fetchWithAuth } from "../apiClient";
import { ApiProduct, VendorOrder } from "@/types/vendor";
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

// ─── Vendor Shop Profile API ─────────────────────────────────────────────────

export interface ShopProfileData {
  shop_id: string;
  user_id: string;
  shop_name: string;
  description: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  partner_type: string | null;
  identity_number: string | null;
  province: string | null;
  district: string | null;
  address_detail: string | null;
  logo_url: string | null;
  verification_status: string;
  rating_average: number;
  is_active: boolean;
}

export interface UpdateShopPayload {
  shopName?: string;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
  province?: string;
  district?: string;
  addressDetail?: string;
  logoUrl?: string;
}

export async function getMyShop(): Promise<ShopProfileData> {
  const response = await fetchWithAuth("/vendors/my-shop");
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải thông tin cửa hàng.");
  }
  return response.json();
}

export async function updateMyShop(payload: UpdateShopPayload): Promise<ShopProfileData> {
  const response = await fetchWithAuth("/vendors/my-shop", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Cập nhật thông tin cửa hàng thất bại.");
  }
  return response.json();
}

// ─── Vendor Product Status API ───────────────────────────────────────────────

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

export async function getVendorOrders(status = "PENDING_VENDOR_APPROVAL"): Promise<VendorOrder[]> {
  const response = await fetchWithAuth(`/orders/vendor?status=${encodeURIComponent(status)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải danh sách đơn thuê.");
  }

  const payload = await response.json();
  return payload.orders ?? [];
}

export async function approveVendorOrder(orderId: string) {
  const response = await fetchWithAuth(`/orders/${orderId}/vendor-approve`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể chấp nhận đơn thuê.");
  }

  return response.json();
}

export async function rejectVendorOrder(orderId: string) {
  const response = await fetchWithAuth(`/orders/${orderId}/vendor-reject`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể từ chối đơn thuê.");
  }

  return response.json();
}
