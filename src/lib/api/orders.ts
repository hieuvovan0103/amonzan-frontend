import { fetchWithAuth } from "@/lib/apiClient";

export type PaidOrderItem = {
    orderItemId: string;
    variantId: string;
    productId: string | null;
    productSlug: string | null;
    productName: string;
    productImage: string | null;
    variantName: string | null;
    shopName: string | null;
    quantity: number;
    unitPricePerDay: number;
    lineSubtotal: number;
    lineDeposit: number;
};

export type PaidOrder = {
    orderId: string;
    status: string;
    paymentStatus: string;
    rentalStart: string;
    rentalEnd: string;
    subtotal: number;
    depositAmount: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    note: string | null;
    createdAt: string;
    confirmedAt: string | null;
    completedAt: string | null;
    dispute: {
        disputeId: string;
        status: string;
        reason: string | null;
        resolution: string | null;
        openedAt: string | null;
        resolvedAt: string | null;
    } | null;
    earlyReturnRequest: EarlyReturnRequest | null;
    returnRecord: ReturnRecord | null;
    renterReview: {
        reviewId: string;
        orderId: string | null;
        rating: number;
        comment: string | null;
        createdAt: string;
        shopName: string;
        reportStatus?: string | null;
    } | null;
    address: {
        recipientName: string;
        phoneNumber: string;
        fullAddress: string;
    } | null;
    payment: {
        transactionId: string;
        method: string;
        amount: number;
        status: string;
        paidAt: string | null;
        provider: string | null;
    } | null;
    items: PaidOrderItem[];
};

export type ReturnRecord = {
    recordId: string;
    returnRequestedAt: string | null;
    returnRequestNote: string | null;
    returnConditionStatus: string | null;
    returnEvidenceUrls: string[];
    returnedAt: string | null;
    returnConditionNote: string | null;
    vendorReturnStatus: "PENDING" | "CONFIRMED" | "ISSUE_REPORTED" | string;
    vendorReturnNote: string | null;
    returnIssueReason: string | null;
    returnIssueDescription: string | null;
    returnIssueEvidenceUrls: string[];
    updatedAt: string | null;
};

export type EarlyReturnRequest = {
    requestId: string;
    orderId: string;
    requestedReturnAt: string;
    originalRentalEnd: string;
    reason: string | null;
    status: "PENDING" | "APPROVED" | "REJECTED" | "RECEIVED" | string;
    vendorResponseNote: string | null;
    estimatedRefundAmount: number;
    conditionImageUrls: string[];
    approvedAt: string | null;
    rejectedAt: string | null;
    receivedAt: string | null;
    returnConditionNote: string | null;
    createdAt: string;
};

export async function getMyPaidOrders() {
    const response = await fetchWithAuth("/orders/my-paid-orders");

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể tải lịch sử đơn hàng.");
    }

    const payload = (await response.json()) as { orders: PaidOrder[] };
    return payload.orders ?? [];
}

export async function estimateEarlyReturnRefund(params: {
    orderId: string;
    requestedReturnAt: string;
}) {
    const response = await fetchWithAuth(
        `/orders/${params.orderId}/early-return/estimate-refund?requestedReturnAt=${encodeURIComponent(params.requestedReturnAt)}`,
    );

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể ước tính hoàn tiền.");
    }

    return response.json() as Promise<{
        orderId: string;
        requestedReturnAt: string;
        estimatedRefundAmount: number;
        message: string;
    }>;
}

export async function requestEarlyReturn(params: {
    orderId: string;
    requestedReturnAt: string;
    reason?: string;
    conditionImageUrls?: string[];
}) {
    const response = await fetchWithAuth(`/orders/${params.orderId}/early-return/request`, {
        method: "POST",
        body: JSON.stringify({
            requestedReturnAt: params.requestedReturnAt,
            reason: params.reason,
            conditionImageUrls: params.conditionImageUrls,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể gửi yêu cầu trả hàng sớm.");
    }

    return response.json();
}

export async function confirmRenterReceived(orderId: string) {
    const response = await fetchWithAuth(`/orders/${orderId}/confirm-received`, {
        method: "PATCH",
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể xác nhận đã nhận hàng.");
    }

    return response.json();
}
