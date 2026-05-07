export type AdminTab =
    | "overview"
    | "accounts"
    | "orders"
    | "products"
    | "categories"
    | "reviews"
    | "vendor_verification"
    | "inventory"
    | "payments"
    | "disputes";

export type AdminOrderStatus =
    | "ACTIVE_RENTAL"
    | "DISPUTED"
    | "PENDING"
    | "COMPLETED"
    | "IN_TRANSIT";

export type AdminEscrowStatus = "HELD" | "RELEASED" | "PENDING";

export type AdminInventoryStatus =
    | "AVAILABLE"
    | "RENTED"
    | "MAINTENANCE"
    | "DAMAGED";

export type AdminProductStatus =
    | "APPROVED"
    | "PENDING"
    | "REJECTED";

export type AdminUserType = "SHOP" | "RENTER";
export type AdminUserStatus = "VERIFIED" | "WARNING";
export type AdminDisputeStatus = "PENDING" | "RESOLVED";

export type AdminOrder = {
    id: string;
    renter: string;
    shop: string;
    product: string;
    startDate: string;
    endDate: string;
    total: number;
    deposit: number;
    status: AdminOrderStatus;
    escrow: AdminEscrowStatus;
};

export type AdminInventoryItem = {
    id: string;
    product: string;
    variant: string;
    status: AdminInventoryStatus;
    condition: string;
    lastCheck: string;
};

export type AdminDispute = {
    id: string;
    orderId: string;
    renter: string;
    shop: string;
    type: "DAMAGE_REPORT" | "NON_DELIVERY";
    status: AdminDisputeStatus;
    createdAt: string;
};

export type AdminTransaction = {
    id: string;
    orderId: string;
    type: "RENTAL_FEE" | "DEPOSIT" | "REFUND";
    amount: number;
    method: string;
    status: "SUCCESS";
    escrow: "HELD" | "RELEASED";
};

export type AdminProduct = {
    id: string;
    name: string;
    shop: string;
    category: string;
    price: string;
    deposit: string;
    status: AdminProductStatus;
    stock: number;
};

export type AdminUser = {
    id: string;
    name: string;
    type: AdminUserType;
    rating: number;
    status: AdminUserStatus;
    activeOrders: number;
    escrowBalance: number;
    joined: string;
};

export type AdminReturnDispute = {
    disputeId: string;
    orderId: string;
    type: "RETURN_DISPUTE" | "EARLY_RETURN_DISPUTE" | string;
    reason: string | null;
    resolution: string | null;
    status: string;
    evidenceUrls: string[];
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
        totalAmount: number;
        lateFee: number;
        damageFee: number;
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
        productName: string;
        variantName: string | null;
        quantity: number;
        shopName: string | null;
        shopOwnerName: string | null;
    }>;
};
