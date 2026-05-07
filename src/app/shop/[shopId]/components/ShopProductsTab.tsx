"use client";

import { useMemo, useState } from "react";
import type { ShopProfileProduct } from "@/lib/api/shops";
import ShopProductCard from "./ShopProductCard";

type ShopProductsTabProps = {
    products: ShopProfileProduct[];
};

type ShopProductSort = "featured" | "price_asc" | "price_desc" | "rating_desc";

export default function ShopProductsTab({ products }: ShopProductsTabProps) {
    const [sortValue, setSortValue] = useState<ShopProductSort>("featured");
    const safeProducts = products ?? [];
    const sortedProducts = useMemo(() => {
        const result = [...safeProducts];

        switch (sortValue) {
            case "price_asc":
                return result.sort((a, b) => a.price - b.price);
            case "price_desc":
                return result.sort((a, b) => b.price - a.price);
            case "rating_desc":
                return result.sort((a, b) => b.rating - a.rating);
            case "featured":
            default:
                return result.sort((a, b) => Number(b.stock) - Number(a.stock));
        }
    }, [safeProducts, sortValue]);

    return (
        <div>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-[20px] font-bold text-[#222222]">
                        Sản phẩm đang cho thuê
                    </h2>

                    <p className="mt-1 text-[13px] text-[#565959]">
                        Danh sách sản phẩm đang hoạt động của cửa hàng.
                    </p>
                </div>

                <select
                    value={sortValue}
                    onChange={(event) => setSortValue(event.target.value as ShopProductSort)}
                    className="rounded-[4px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] text-[#222222] outline-none focus:ring-2 focus:ring-[#FF9900]/40"
                >
                    <option value="featured">Sắp xếp: Nổi bật</option>
                    <option value="price_asc">Giá thấp đến cao</option>
                    <option value="price_desc">Giá cao đến thấp</option>
                    <option value="rating_desc">Đánh giá cao nhất</option>
                </select>
            </div>

            {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {sortedProducts.map((product) => (
                        <ShopProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="rounded-[6px] border border-dashed border-[#D5D9D9] bg-[#FAFAFA] p-6 text-[14px] text-[#565959]">
                    Cửa hàng chưa có sản phẩm đang hiển thị.
                </div>
            )}
        </div>
    );
}
