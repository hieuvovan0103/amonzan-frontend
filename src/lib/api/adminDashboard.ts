import { fetchWithAuth } from "@/lib/apiClient";

export type AdminOverview = {
  metrics: {
    totalUsers: number;
    pendingReviewReports: number;
    openDisputes: number;
    vendorRequests: number;
    activeOrders: number;
    totalOrders: number;
    hiddenReviews: number;
    recentOrders: number;
  };
  generatedAt: string;
};

export async function getAdminOverview() {
  const response = await fetchWithAuth("/admin/dashboard/overview");

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải tổng quan admin.");
  }

  return response.json() as Promise<AdminOverview>;
}
