export type ReturnConditionStatus = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "DAMAGED";

export type ReturnVendorStatus = "PENDING" | "CONFIRMED" | "ISSUE_REPORTED";

export type ReturnRequestItem = {
    orderItemId: string;
    variantId: string;
    productId: string | null;
    productSlug: string | null;
    productName: string;
    productImage: string | null;
    variantName: string | null;
    shopName: string | null;
    quantity: number;
    lineSubtotal: number;
};

export type ReturnRecord = {
    recordId: string;
    pickupAt: string | null;
    returnedAt: string | null;
    pickupConditionNote: string | null;
    returnConditionNote: string | null;
    returnRequestedAt: string | null;
    returnRequestNote: string | null;
    returnConditionStatus: ReturnConditionStatus | null;
    returnEvidenceUrls: string[];
    vendorReturnStatus: ReturnVendorStatus;
    vendorReturnNote: string | null;
    returnIssueReason: string | null;
    returnIssueDescription: string | null;
    returnIssueEvidenceUrls: string[];
    updatedAt: string | null;
};

export type ReturnRequest = {
    orderId: string;
    status: string;
    paymentStatus: string;
    rentalStart: string;
    rentalEnd: string;
    totalAmount: number;
    lateFee: number;
    damageFee: number;
    createdAt: string;
    completedAt: string | null;
    renter: {
        fullName: string;
        email: string | null;
        phoneNumber: string | null;
    };
    returnRecord: ReturnRecord | null;
    items: ReturnRequestItem[];
};

export type ReturnRequestsResponse = {
    requests: ReturnRequest[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};
