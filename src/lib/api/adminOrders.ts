import { fetchWithAuth } from "@/lib/apiClient";

export type AdminOrderListItem = {
  id: string;
  renter: string;
  shop: string;
  product: string;
  startDate: string;
  endDate: string;
  total: number;
  deposit: number;
  status: string;
  escrow: "HELD" | "RELEASED";
  paymentStatus: string;
  createdAt: string;
  itemCount: number;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AdminOrdersListResponse = {
  orders: AdminOrderListItem[];
  pagination: PaginationMeta;
};

export type AdminOrderDetail = {
  orderId: string;
  status: string;
  paymentStatus: string;
  createdAt: string;
  rentalStart: string;
  rentalEnd: string;
  note: string | null;
  amounts: {
    subtotal: number;
    discountAmount: number;
    depositAmount: number;
    shippingFee: number;
    lateFee: number;
    damageFee: number;
    totalAmount: number;
  };
  renter: {
    fullName: string;
    email: string | null;
    phoneNumber: string | null;
  };
  escrow: {
    escrowId: string;
    amountHeld: number;
    heldAt: string;
    releasedAt: string | null;
    releaseReason: string | null;
  } | null;
  payment: {
    transactionId: string;
    method: string;
    amount: number;
    status: string;
    paidAt: string | null;
  } | null;
  items: Array<{
    orderItemId: string;
    quantity: number;
    unitPricePerDay: number;
    lineSubtotal: number;
    lineDeposit: number;
    variantName: string | null;
    product: { productId: string; name: string; slug: string } | null;
    shop: { shopId: string; name: string } | null;
  }>;
};

export async function getAdminOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<AdminOrdersListResponse> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.status) qs.set("status", params.status);
  if (params.search) qs.set("search", params.search);

  const response = await fetchWithAuth(`/admin/orders?${qs.toString()}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải danh sách đơn thuê.");
  }

  return response.json() as Promise<AdminOrdersListResponse>;
}

export async function getAdminOrderDetail(orderId: string) {
  const response = await fetchWithAuth(`/admin/orders/${orderId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải chi tiết đơn thuê.");
  }

  return response.json() as Promise<{ order: AdminOrderDetail }>;
}

