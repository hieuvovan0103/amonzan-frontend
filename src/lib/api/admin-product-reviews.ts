import { fetchWithAuth } from "@/lib/apiClient";
import type { AdminProductReview } from "@/types/admin-product-review";

export async function getPendingProductReviews(): Promise<AdminProductReview[]> {
  const response = await fetchWithAuth("/admin/product-reviews");

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải danh sách sản phẩm chờ duyệt.");
  }

  return response.json();
}

export async function getProductReviewDetail(productId: string): Promise<AdminProductReview> {
  const response = await fetchWithAuth(`/admin/product-reviews/${productId}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải chi tiết sản phẩm.");
  }

  return response.json();
}

export async function approveProductReview(productId: string): Promise<AdminProductReview> {
  const response = await fetchWithAuth(`/admin/product-reviews/${productId}/approve`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể duyệt sản phẩm.");
  }

  return response.json();
}

export async function rejectProductReview(
  productId: string,
  reason: string,
): Promise<AdminProductReview> {
  const response = await fetchWithAuth(`/admin/product-reviews/${productId}/reject`, {
    method: "PATCH",
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể từ chối sản phẩm.");
  }

  return response.json();
}
