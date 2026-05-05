import { formatPrice } from "@/app/utils/formatPrice";
import { BASE_URL } from "@/lib/config";

type PublicShopApi = {
    shop: {
        shop_id: string;
        shop_name: string;
        description?: string | null;
        contact_phone?: string | null;
        contact_email?: string | null;
        partner_type?: string | null;
        province?: string | null;
        district?: string | null;
        address_detail?: string | null;
        rating_average?: number | null;
        verification_status?: string | null;
    };
    productCount: number;
    products: Array<{
        product_id: string;
        name: string;
        slug: string;
        average_rating?: number | null;
        category_name?: string | null;
        primary_image_url?: string | null;
        min_daily_rate: number;
        available_stock: number;
    }>;
    reviews: Array<{
        review_id: string;
        rating: number;
        comment?: string | null;
        created_at: string;
    }>;
};

export type ShopProfileProduct = {
    id: string;
    slug: string;
    title: string;
    price: number;
    priceText: string;
    rating: number;
    stock: boolean;
    category: string;
    image: string;
};

export type ShopProfileReview = {
    id: string;
    author: string;
    rating: number;
    date: string;
    content: string;
};

export type ShopProfile = {
    id: string;
    name: string;
    isVerified: boolean;
    type: string;
    area: string;
    rating: number;
    reviewCount: number;
    productCount: number;
    completionRate: string;
    shortDesc: string;
    intro: string;
    contact: {
        email: string;
        phone: string;
        fullArea: string;
    };
    policyText: string;
    products: ShopProfileProduct[];
    reviews: ShopProfileReview[];
};

const fallbackProductImage = "/file.svg";

function buildUrl(path: string) {
    return new URL(path, BASE_URL).toString();
}

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(date);
}

export async function getPublicShopProfile(shopId: string): Promise<ShopProfile | null> {
    let res: Response;

    try {
        res = await fetch(buildUrl(`/shops/${shopId}`), {
            cache: "no-store",
        });
    } catch (error) {
        console.error(`[shops] Failed to fetch shop "${shopId}":`, error);
        return null;
    }

    if (!res.ok) {
        return null;
    }

    const payload = (await res.json()) as Partial<PublicShopApi>;
    const shop = payload.shop;

    if (!shop) {
        return null;
    }

    const products = Array.isArray(payload.products) ? payload.products : [];
    const reviews = Array.isArray(payload.reviews) ? payload.reviews : [];
    const area = [shop.district, shop.province].filter(Boolean).join(", ");
    const fullArea = [shop.address_detail, shop.district, shop.province]
        .filter(Boolean)
        .join(", ");
    const policyText = shop.description?.trim() || "Cửa hàng chưa cập nhật chính sách.";

    return {
        id: shop.shop_id,
        name: shop.shop_name,
        isVerified: shop.verification_status === "VERIFIED",
        type: shop.partner_type || "Đối tác",
        area: area || "Chưa cập nhật khu vực",
        rating: Number(shop.rating_average ?? 0),
        reviewCount: reviews.length,
        productCount: Number(payload.productCount ?? products.length),
        completionRate: "Chưa có dữ liệu",
        shortDesc: policyText,
        intro: policyText,
        contact: {
            email: shop.contact_email || "Chưa cập nhật",
            phone: shop.contact_phone || "Chưa cập nhật",
            fullArea: fullArea || "Chưa cập nhật",
        },
        policyText,
        products: products.map((product) => ({
            id: product.product_id,
            slug: product.slug,
            title: product.name,
            price: Number(product.min_daily_rate ?? 0),
            priceText: formatPrice(Number(product.min_daily_rate ?? 0)),
            rating: Number(product.average_rating ?? 0),
            stock: Number(product.available_stock ?? 0) > 0,
            category: product.category_name || "Sản phẩm",
            image: product.primary_image_url || fallbackProductImage,
        })),
        reviews: reviews.map((review) => ({
            id: review.review_id,
            author: "Người thuê",
            rating: Number(review.rating ?? 0),
            date: formatDate(review.created_at),
            content: review.comment || "Người thuê chưa để lại nội dung đánh giá.",
        })),
    };
}
