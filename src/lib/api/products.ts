import { BASE_URL } from "@/lib/config";
import { formatPrice } from "@/app/utils/formatPrice";
import type { ProductListItem } from "@/types/product";

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type PublicProductCardApi = {
  product_id: string;
  name: string;
  slug: string;
  description: string | null;
  average_rating: number | null;
  category: {
    category_id: string;
    name: string;
    slug: string;
  } | null;
  shop: {
    shop_id: string;
    shop_name: string;
    rating_average?: number | null;
    province?: string | null;
    district?: string | null;
  } | null;
  primary_image_url: string | null;
  min_daily_rate: number;
  available_stock: number;
  created_at: string;
};

type PublicProductDetailApi = {
  product_id: string;
  shop_id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  average_rating: number | null;
  categories: {
    category_id: string;
    name: string;
    slug: string;
    description?: string | null;
  } | null;
  shop_profiles: {
    shop_id: string;
    shop_name: string;
    description?: string | null;
    rating_average?: number | null;
    province?: string | null;
    district?: string | null;
    contact_phone?: string | null;
    contact_email?: string | null;
  } | null;
  product_images: Array<{
    image_id: string;
    image_url: string;
    sort_order: number;
    is_primary: boolean;
  }>;
  product_variants: Array<{
    variant_id: string;
    sku?: string;
    variant_name: string;
    base_daily_rate: number;
    base_weekly_rate?: number | null;
    deposit_requirement: number;
    condition: string;
    total_stock: number;
    available_stock: number;
  }>;
  reviews?: Array<{
    review_id: string;
    rating: number;
    comment: string | null;
    created_at: string;
  }>;
};

export type ProductListResult = {
  products: ProductListItem[];
  pagination: PaginationMeta;
};

export type ProductSizeOption = {
  variantId: string;
  name: string;
  availableStock: number;
  priceValue: number;
};

export type ProductReview = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type ProductDetail = {
  id: string;
  slug: string;
  title: string;
  rating: number;
  reviewsCount: number;
  price: string;
  priceValue: number;
  description: string[];
  sizes: string[];
  availableSizes: ProductSizeOption[];
  images: string[];
  categorySlug?: string;
  categoryName?: string;
  location: string;
  storeName: string;
  shopDescription?: string | null;
  reviews: ProductReview[];
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
  variants: PublicProductDetailApi["product_variants"];
};

const fallbackImage = "/file.svg";

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, BASE_URL);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

function mapProductCard(product: PublicProductCardApi): ProductListItem {
  return {
    id: product.product_id,
    slug: product.slug,
    title: product.name,
    shopName: product.shop?.shop_name ?? "Amonzan vendor",
    rating: Number(product.average_rating ?? product.shop?.rating_average ?? 0),
    reviews: 0,
    price: formatPrice(Number(product.min_daily_rate ?? 0)),
    image: product.primary_image_url ?? fallbackImage,
    category: product.category?.name,
    location: [product.shop?.district, product.shop?.province].filter(Boolean).join(", "),
  };
}

export async function getPublicProducts(params?: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "rating_desc";
}): Promise<ProductListResult> {
  let res: Response;

  try {
    res = await fetch(buildUrl("/products", params), {
      cache: "no-store",
    });
  } catch (error) {
    console.error("[products] Failed to fetch public products:", error);
    return {
      products: [],
      pagination: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 12,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  if (!res.ok) {
    return {
      products: [],
      pagination: {
        page: params?.page ?? 1,
        limit: params?.limit ?? 12,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  const payload = (await res.json()) as {
    data: PublicProductCardApi[];
    pagination: PaginationMeta;
  };

  return {
    products: payload.data.map(mapProductCard),
    pagination: payload.pagination,
  };
}

export async function getPublicProductDetail(slug: string): Promise<ProductDetail | null> {
  let res: Response;

  try {
    res = await fetch(buildUrl(`/products/${slug}`), {
      cache: "no-store",
    });
  } catch (error) {
    console.error(`[products] Failed to fetch product detail for "${slug}":`, error);
    return null;
  }

  if (!res.ok) {
    return null;
  }

  const product = (await res.json()) as PublicProductDetailApi;
  const images = [...(product.product_images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => image.image_url);
  const availableVariants = (product.product_variants ?? []).filter(
    (variant) => Number(variant.available_stock) > 0,
  );
  const availableSizes = availableVariants.map((variant) => ({
    variantId: variant.variant_id,
    name: variant.variant_name,
    availableStock: Number(variant.available_stock ?? 0),
    priceValue: Number(variant.base_daily_rate ?? 0),
  }));
  const minDailyRate = availableVariants.length
    ? Math.min(...availableVariants.map((variant) => Number(variant.base_daily_rate)))
    : 0;
  const reviews = (product.reviews ?? []).map((review) => ({
    id: review.review_id,
    rating: Number(review.rating ?? 0),
    comment: review.comment ?? "",
    createdAt: review.created_at,
  }));
  const ratingDistribution = reviews.reduce<Record<1 | 2 | 3 | 4 | 5, number>>(
    (acc, review) => {
      const rating = Math.round(review.rating) as 1 | 2 | 3 | 4 | 5;
      if (rating >= 1 && rating <= 5) {
        acc[rating] += 1;
      }
      return acc;
    },
    { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  );

  return {
    id: product.product_id,
    slug: product.slug,
    title: product.name,
    rating: Number(product.average_rating ?? product.shop_profiles?.rating_average ?? 0),
    reviewsCount: reviews.length,
    price: formatPrice(minDailyRate),
    priceValue: minDailyRate,
    description: product.description
      ? product.description.split(/\r?\n/).filter(Boolean)
      : ["Sản phẩm đang được cho thuê trên Amonzan."],
    sizes: availableSizes.map((size) => size.name),
    availableSizes,
    images: images.length ? images : [fallbackImage],
    categorySlug: product.categories?.slug,
    categoryName: product.categories?.name,
    location: [product.shop_profiles?.district, product.shop_profiles?.province]
      .filter(Boolean)
      .join(", "),
    storeName: product.shop_profiles?.shop_name ?? "Amonzan vendor",
    shopDescription: product.shop_profiles?.description ?? null,
    reviews,
    ratingDistribution,
    variants: product.product_variants ?? [],
  };
}
