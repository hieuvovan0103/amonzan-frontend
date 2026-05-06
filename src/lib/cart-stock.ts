import {
    getPublicProductAvailability,
    getPublicProductDetail,
} from "@/lib/api/products";
import type { CartItem } from "@/types/cart";

export type CartStockIssue = {
    itemId: string;
    title: string;
    message: string;
    availableStock: number;
};

type CartStockIssueOptions = {
    failOpen?: boolean;
    silent?: boolean;
};

export async function getCartStockIssues(
    items: CartItem[],
    options: CartStockIssueOptions = {},
) {
    const issues: CartStockIssue[] = [];
    const productsBySlug = new Map<string, Awaited<ReturnType<typeof getPublicProductDetail>>>();

    await Promise.all(
        [...new Set(items.map((item) => item.slug).filter(Boolean))].map(async (slug) => {
            productsBySlug.set(
                slug,
                await getPublicProductDetail(slug, { silent: options.silent }),
            );
        }),
    );

    for (const item of items) {
        const product = productsBySlug.get(item.slug);
        const variant = product?.variants.find((candidate) =>
            item.variantId
                ? candidate.variant_id === item.variantId
                : candidate.variant_name === item.size,
        );
        let availableStock = Number(variant?.total_stock ?? variant?.available_stock ?? 0);

        if (!product && options.failOpen) {
            continue;
        }

        if (!product || !variant || availableStock <= 0) {
            issues.push({
                itemId: item.id,
                title: item.title,
                availableStock: 0,
                message: `${item.title} đã hết hàng.`,
            });
            continue;
        }

        if (item.variantId && item.rentalStart && item.rentalEnd) {
            const availability = await getPublicProductAvailability({
                slug: item.slug,
                variantId: item.variantId,
                start: item.rentalStart,
                end: item.rentalEnd,
            }, { silent: options.silent });

            if (!availability) {
                if (options.failOpen) {
                    continue;
                }

                issues.push({
                    itemId: item.id,
                    title: item.title,
                    availableStock: 0,
                    message: `Không thể kiểm tra lịch thuê của ${item.title}.`,
                });
                continue;
            }

            availableStock = availability.availableStock;

            if (!availability.available) {
                issues.push({
                    itemId: item.id,
                    title: item.title,
                    availableStock,
                    message:
                        availability.message ||
                        `${item.title} không khả dụng trong thời gian đã chọn.`,
                });
                continue;
            }
        }

        if (item.quantity > availableStock) {
            issues.push({
                itemId: item.id,
                title: item.title,
                availableStock,
                message: `${item.title} chỉ còn ${availableStock} sản phẩm trong thời gian đã chọn.`,
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
