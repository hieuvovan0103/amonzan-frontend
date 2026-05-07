export type VendorProductStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "ARCHIVED";

export type MockVendorProductStatus = "ENABLE" | "IN_USE" | "DISABLE";

export interface VendorProduct {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  shop: string;
  status: MockVendorProductStatus;
  stock: number;
}

export interface ApiCategory {
  category_id: string;
  name: string;
  slug: string;
}

export interface ApiImage {
  image_id: string;
  image_url: string;
  sort_order: number;
  is_primary: boolean;
}

export interface ApiVariant {
  variant_id: string;
  sku: string;
  variant_name: string;
  base_daily_rate: number;
  base_weekly_rate: number | null;
  deposit_requirement: number;
  condition: "NEW" | "GOOD" | "FAIR" | "DAMAGED";
  total_stock: number;
  available_stock: number;
}

export interface ApiProduct {
  product_id: string;
  shop_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  status: VendorProductStatus;
  rejection_reason?: string | null;
  created_at: string;
  updated_at: string;
  categories: ApiCategory | null;
  product_images: ApiImage[];
  product_variants: ApiVariant[];
}

export type VendorOrder = {
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
  renter: {
    fullName: string;
    email: string | null;
    phoneNumber: string | null;
    reputationScore: number;
    penaltyPoints: number;
    verificationStatus: string;
    reviewSummary?: VendorRenterReviewSummary;
    reviews?: VendorRenterReview[];
  };
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
    provider: string | null;
    paidAt: string | null;
  } | null;
  items: Array<{
    orderItemId: string;
    variantId: string;
    productId: string | null;
    productSlug: string | null;
    productName: string;
    productImage: string | null;
    variantName: string | null;
    quantity: number;
    unitPricePerDay: number;
    lineSubtotal: number;
    lineDeposit: number;
  }>;
};

export type VendorRenterReview = {
  reviewId: string;
  orderId: string | null;
  rating: number;
  comment: string | null;
  createdAt: string;
  shopName: string;
};

export type VendorRenterReviewSummary = {
  averageRating: number;
  count: number;
};

export type VendorEarlyReturnRequest = {
  requestId: string;
  orderId: string;
  requestedReturnAt: string;
  originalRentalEnd: string;
  reason: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "RECEIVED" | string;
  vendorResponseNote: string | null;
  estimatedRefundAmount: number;
  conditionImageUrls: string[];
  createdAt: string;
  order: {
    orderId: string;
    status: string;
    paymentStatus: string;
    rentalStart: string;
    rentalEnd: string;
    subtotal: number;
    totalAmount: number;
  };
  renter: {
    fullName: string;
    email: string | null;
    phoneNumber: string | null;
    reputationScore: number;
    penaltyPoints: number;
    reviewSummary?: VendorRenterReviewSummary;
    reviews?: VendorRenterReview[];
  };
  items: Array<{
    orderItemId: string;
    variantId: string;
    productId: string | null;
    productSlug: string | null;
    productName: string;
    productImage: string | null;
    variantName: string | null;
    quantity: number;
    lineSubtotal: number;
  }>;
};

export type VendorCalendarEvent = {
  id: string;
  orderId: string;
  title: string;
  status: string;
  paymentStatus: string;
  rentalStart: string;
  rentalEnd: string;
  renterName: string;
  totalAmount: number;
  items: VendorOrder["items"];
  color: string;
};

export type VendorTab =
  | "vendor_listings"
  | "vendor_detail"
  | "vendor_orders"
  | "vendor_returns"
  | "rentals_calendar"
  | "shop_settings";
