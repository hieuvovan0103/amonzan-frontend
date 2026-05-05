import { getPublicProductDetail } from "@/lib/api/products";
import type { CartItem } from "@/types/cart";

export type CartStockIssue = {
    itemId: string;
    title: string;
    message: string;
    availableStock: number;
};

export async function getCartStockIssues(items: CartItem[]) {
    const issues: CartStockIssue[] = [];
    const productsBySlug = new Map<string, Awaited<ReturnType<typeof getPublicProductDetail>>>();

    await Promise.all(
        [...new Set(items.map((item) => item.slug).filter(Boolean))].map(async (slug) => {
            productsBySlug.set(slug, await getPublicProductDetail(slug));
        }),
    );

    for (const item of items) {
        const product = productsBySlug.get(item.slug);
        const variant = product?.variants.find((candidate) =>
            item.variantId
                ? candidate.variant_id === item.variantId
                : candidate.variant_name === item.size,
        );
        const availableStock = Number(variant?.available_stock ?? 0);

        if (!product || !variant || availableStock <= 0) {
            issues.push({
                itemId: item.id,
                title: item.title,
                availableStock: 0,
                message: `${item.title} đã hết hàng.`,
            });
            continue;
        }

        if (item.quantity > availableStock) {
            issues.push({
                itemId: item.id,
                title: item.title,
                availableStock,
                message: `${item.title} chỉ còn ${availableStock} sản phẩm.`,
            });
        }
    }

    return issues;
}

export function hasStockIssue(itemId: string, issues: CartStockIssue[]) {
    return issues.some((issue) => issue.itemId === itemId);
}

export function getStockIssue(itemId: string, issues: CartStockIssue[]) {
    return issues.find((issue) => issue.itemId === itemId);
}
