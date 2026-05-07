import { BASE_URL, fetchWithAuth } from "@/lib/apiClient";

export type ProductCategory = {
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CategoryPayload = {
  name: string;
  slug: string;
  description?: string | null;
  is_active?: boolean;
};

export async function getPublicCategories(): Promise<ProductCategory[]> {
  const response = await fetch(`${BASE_URL}/categories`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Không thể tải danh sách danh mục.");
  }

  return response.json();
}

export async function getAdminCategories(): Promise<ProductCategory[]> {
  const response = await fetchWithAuth("/admin/categories");

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải danh sách danh mục.");
  }

  return response.json();
}

export async function createAdminCategory(payload: CategoryPayload): Promise<ProductCategory> {
  const response = await fetchWithAuth("/admin/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tạo danh mục.");
  }

  return response.json();
}

export async function updateAdminCategory(
  categoryId: string,
  payload: Partial<CategoryPayload>,
): Promise<ProductCategory> {
  const response = await fetchWithAuth(`/admin/categories/${categoryId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể cập nhật danh mục.");
  }

  return response.json();
}

export async function deactivateAdminCategory(categoryId: string): Promise<ProductCategory> {
  const response = await fetchWithAuth(`/admin/categories/${categoryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tắt danh mục.");
  }

  return response.json();
}
