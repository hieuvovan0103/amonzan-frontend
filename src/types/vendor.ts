export type VendorProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED";

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
  created_at: string;
  updated_at: string;
  categories: ApiCategory | null;
  product_images: ApiImage[];
  product_variants: ApiVariant[];
}

export type VendorCalendarEvent = {
  id: number;
  title: string;
  start: number;
  end: number;
  color: string;
};

export type VendorTab = "vendor_listings" | "vendor_detail" | "rentals_calendar";
