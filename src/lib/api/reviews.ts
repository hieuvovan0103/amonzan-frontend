import { BASE_URL, fetchWithAuth } from "@/lib/apiClient";

export type ProductReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewerName: string;
  reviewerAvatarUrl?: string | null;
  shopReply?: ReviewReply | null;
};

export type ReviewReply = {
  replyId: string;
  reviewId: string;
  shopId: string;
  shopName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductReviewSummary = {
  averageRating: number;
  count: number;
};

export type ProductReviewEligibility = {
  eligible: boolean;
  alreadyReviewed: boolean;
  orderId: string | null;
  review: ProductReview | null;
  message: string | null;
};

export type AdminReview = {
  review_id: string;
  order_id: string | null;
  target_type: "PRODUCT" | "SHOP" | string;
  target_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  is_hidden: boolean;
  hidden_at: string | null;
  reported_at: string | null;
  reported_by_user_id?: string | null;
  report_reason: string | null;
  report_status: string | null;
  reporter_name?: string | null;
  reporter_email?: string | null;
  reviewer_name: string;
  reviewer_email: string | null;
  product: {
    product_id: string;
    name: string;
    slug: string;
    shop_name: string | null;
  } | null;
  shop_reply?: ReviewReplyApi | null;
};

type ReviewApi = {
  review_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_name?: string | null;
  reviewer_avatar_url?: string | null;
  shop_reply?: ReviewReplyApi | null;
};

type ReviewReplyApi = {
  reply_id: string;
  review_id: string;
  shop_id: string;
  shop_name?: string | null;
  content: string;
  created_at: string;
  updated_at: string;
};

type ReviewsResponseApi = {
  reviews: ReviewApi[];
  summary: {
    averageRating: number;
    count: number;
  };
};

function mapReview(review: ReviewApi): ProductReview {
  return {
    id: review.review_id,
    rating: Number(review.rating ?? 0),
    comment: review.comment ?? "",
    createdAt: review.created_at,
    reviewerName: review.reviewer_name || "Người thuê Amonzan",
    reviewerAvatarUrl: review.reviewer_avatar_url ?? null,
    shopReply: mapReply(review.shop_reply),
  };
}

function mapReply(reply?: ReviewReplyApi | null): ReviewReply | null {
  if (!reply) return null;

  return {
    replyId: reply.reply_id,
    reviewId: reply.review_id,
    shopId: reply.shop_id,
    shopName: reply.shop_name || "Shop Amonzan",
    content: reply.content,
    createdAt: reply.created_at,
    updatedAt: reply.updated_at,
  };
}

export async function getProductReviews(productId: string) {
  const response = await fetch(`${BASE_URL}/products/${productId}/reviews`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải đánh giá sản phẩm.");
  }

  const payload = (await response.json()) as ReviewsResponseApi;
  return {
    reviews: (payload.reviews ?? []).map(mapReview),
    summary: payload.summary ?? { averageRating: 0, count: 0 },
  };
}

export async function getProductReviewEligibility(productId: string) {
  const response = await fetchWithAuth(`/products/${productId}/reviews/eligibility`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể kiểm tra quyền đánh giá.");
  }

  return response.json() as Promise<ProductReviewEligibility>;
}

export async function createProductReview(
  productId: string,
  payload: { rating: number; comment?: string },
) {
  const response = await fetchWithAuth(`/products/${productId}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể gửi đánh giá.");
  }

  return mapReview((await response.json()) as ReviewApi);
}

export async function updateMyProductReview(
  productId: string,
  payload: { rating: number; comment?: string },
) {
  const response = await fetchWithAuth(`/products/${productId}/reviews/mine`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể cập nhật đánh giá.");
  }

  return mapReview((await response.json()) as ReviewApi);
}

export async function getAdminReviews() {
  const response = await fetchWithAuth("/admin/reviews");

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể tải danh sách đánh giá.");
  }

  return response.json() as Promise<AdminReview[]>;
}

export async function hideAdminReview(reviewId: string) {
  const response = await fetchWithAuth(`/admin/reviews/${reviewId}/hide`, {
    method: "PATCH",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể ẩn đánh giá.");
  }
}

export async function updateAdminReviewReportStatus(
  reviewId: string,
  status: "RESOLVED" | "DISMISSED",
) {
  const response = await fetchWithAuth(`/admin/reviews/${reviewId}/report-status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể cập nhật trạng thái báo cáo.");
  }
}

export async function deleteAdminReview(reviewId: string) {
  const response = await fetchWithAuth(`/admin/reviews/${reviewId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể xóa đánh giá.");
  }
}

export async function reportReview(reviewId: string, reason: string) {
  const response = await fetchWithAuth(`/reviews/${reviewId}/report`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể báo cáo đánh giá.");
  }

  return response.json();
}

export async function replyToReview(reviewId: string, content: string) {
  const response = await fetchWithAuth(`/reviews/${reviewId}/reply`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Không thể phản hồi đánh giá.");
  }

  return mapReply((await response.json()) as ReviewReplyApi);
}
