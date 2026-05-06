export type AdminDisputeStatus =
    | "OPEN"
    | "UNDER_REVIEW"
    | "NEED_MORE_EVIDENCE"
    | "RESOLVED"
    | "REJECTED";

export type AdminDisputeDecision =
    | "FULL_REFUND"
    | "PARTIAL_REFUND"
    | "NO_REFUND"
    | "RELEASE_TO_VENDOR"
    | "DEDUCT_DEPOSIT"
    | "REFUND_DEPOSIT"
    | "SPLIT_AMOUNT";

export type EvidenceRequestTarget = "RENTER" | "VENDOR" | "BOTH";

export type AdminDispute = {
    disputeId: string;
    orderId: string;
    type: string;
    reason: string | null;
    resolution: string | null;
    status: AdminDisputeStatus | string;
    decision: AdminDisputeDecision | null;
    adminNote: string | null;
    refundAmount: number;
    resolvedDamageFee: number | null;
    resolvedLateFee: number | null;
    evidenceRequestTarget: EvidenceRequestTarget | null;
    evidenceRequestMessage: string | null;
    evidenceRequestedAt: string | null;
    evidenceUrls: string[];
    renterEvidenceUrls: string[];
    vendorEvidenceUrls: string[];
    openedAt: string;
    resolvedAt: string | null;
    complaint: {
        complaintId: string;
        title: string;
        description: string | null;
        status: string;
        type: string;
        evidenceUrls: string[];
        createdAt: string;
        complainantName: string;
        complainantEmail: string | null;
        complainantPhone: string | null;
    } | null;
    order: {
        status: string;
        paymentStatus: string;
        rentalStart: string;
        rentalEnd: string;
        subtotal: number;
        totalAmount: number;
        depositAmount: number;
        shippingFee: number;
        lateFee: number;
        damageFee: number;
        createdAt: string;
        completedAt: string | null;
    };
    renter: {
        fullName: string;
        email: string | null;
        phoneNumber: string | null;
    };
    shop: {
        name: string;
        ownerName: string | null;
    };
    items: Array<{
        orderItemId: string;
        productName: string;
        variantName: string | null;
        quantity: number;
        lineSubtotal: number;
        lineDeposit: number;
        shopName: string | null;
        shopOwnerName: string | null;
    }>;
};

export type AdminDisputeDetail = AdminDispute & {
    returnRecord: {
        returnRequestedAt: string | null;
        returnRequestNote: string | null;
        returnConditionStatus: string | null;
        vendorReturnStatus: string | null;
        vendorReturnNote: string | null;
        returnIssueReason: string | null;
        returnIssueDescription: string | null;
        returnedAt: string | null;
        updatedAt: string | null;
    } | null;
    earlyReturnRequest: {
        requestId: string;
        status: string;
        reason: string | null;
        vendorResponseNote: string | null;
        conditionImageUrls: string[];
        createdAt: string;
    } | null;
    timeline: Array<{
        eventId: string;
        actorName: string;
        eventType: string;
        message: string | null;
        metadata: Record<string, unknown>;
        createdAt: string;
    }>;
};

export type AdminDisputePagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ResolveDisputePayload = {
    decision: AdminDisputeDecision;
    refundAmount?: number;
    damageFee?: number;
    lateFee?: number;
    resolution: string;
    adminNote?: string;
};

export type RequestEvidencePayload = {
    target: EvidenceRequestTarget;
    message: string;
};
