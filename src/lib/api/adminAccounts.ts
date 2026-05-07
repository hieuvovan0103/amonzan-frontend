import { fetchWithAuth } from "@/lib/apiClient";

export type AdminAccount = {
  userId: string;
  fullName: string;
  email: string | null;
  phoneNumber: string | null;
  roles: string[];
  isAdmin: boolean;
  shopName: string | null;
  shopStatus: string | null;
  shopActive: boolean;
  renterStatus: string | null;
  reputationScore: number;
  penaltyPoints: number;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  joinedAt: string;
};

export async function getAdminAccounts(params: { search?: string; role?: string } = {}) {
  const search = new URLSearchParams();
  if (params.search) search.set("search", params.search);
  if (params.role && params.role !== "ALL") search.set("role", params.role);

  const response = await fetchWithAuth(`/admin/accounts${search.toString() ? `?${search}` : ""}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải danh sách tài khoản.");
  }

  return response.json() as Promise<{ accounts: AdminAccount[] }>;
}

export async function updateAdminAccountRoles(userId: string, roles: string[]) {
  const response = await fetchWithAuth(`/admin/accounts/${userId}/roles`, {
    method: "PATCH",
    body: JSON.stringify({ roles }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể cập nhật quyền tài khoản.");
  }

  return response.json() as Promise<{ success: boolean; roles: string[] }>;
}
