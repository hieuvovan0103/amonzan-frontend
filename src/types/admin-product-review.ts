import type { ApiCategory, ApiImage, ApiVariant, VendorProductStatus } from "@/types/vendor";

export type AdminReviewShop = {
  shop_id: string;
  shop_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  province: string | null;
  district: string | null;
};

export type AdminProductReview = {
  product_id: string;
  shop_id: string;
  category_id: string;
  name: string;
  slug: string;
  description: string | null;
  status: VendorProductStatus;
  rejection_reason: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  categories: ApiCategory | null;
  shop_profiles: AdminReviewShop | null;
  product_images: ApiImage[];
  product_variants: ApiVariant[];
};
