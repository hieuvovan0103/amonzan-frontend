"use client";

import { MapPin, ShoppingCart, Star } from "lucide-react";
import Link from "next/link";
import type { ProductListItem } from "@/types/product";

type ProductCardProps = {
    data: ProductListItem;
};

export default function ProductCard({ data }: ProductCardProps) {
    const isOutOfStock = data.availableStock !== undefined && Number(data.availableStock) <= 0;

    return (
        <div className="group flex flex-col overflow-hidden rounded-sm border border-[#E6E6E6] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:border-[#FF9900] hover:shadow-[0_8px_24px_rgba(15,17,17,0.10)]">
            <Link
                href={`/products/${data.slug}`}
                className="block aspect-[4/5] w-full overflow-hidden bg-[#F7F7F7]"
            >
                <img
                    src={data.image}
                    alt={data.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="flex flex-1 flex-col p-4">
                <Link href={`/products/${data.slug}`}>
                    <h3 className="mb-2 line-clamp-2 text-[15px] font-bold leading-[1.35] text-[#222222] transition-colors group-hover:text-[#FF9900]">
                        {data.title}
                    </h3>
                </Link>

                <div className="mb-2 text-[13px] font-medium text-[#007185] hover:text-[#E47911] hover:underline">
                    {data.shopName}
                </div>

                <div className="mb-2 flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#222222]">
                        {data.rating.toFixed(1)}
                    </span>

                    <div className="flex text-[#FFA41C]">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <Star className="h-3.5 w-3.5 fill-current text-[#D5D9D9]" />
                    </div>

                    <span className="text-[12px] text-[#6B7280]">({data.reviews})</span>
                </div>

                <div className="mb-4 flex items-center gap-1 text-[12px] text-[#6B7280]">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{data.location}</span>
                </div>

                <div className="mt-auto border-t border-[#E6E6E6] pt-3">
                    <div className="mb-3 flex items-baseline gap-1">
                        <span className="text-[18px] font-bold text-[#C62828]">
                            {data.price}
                        </span>
                        <span className="text-[12px] font-bold text-[#C62828]">
                            vnđ/ngày
                        </span>
                    </div>

                    <Link
                        href={isOutOfStock && data.shopId ? `/shop/${data.shopId}` : `/products/${data.slug}`}
                        className={`flex w-full items-center justify-center gap-2 rounded-sm border py-2 text-[13px] font-bold transition-colors ${
                            isOutOfStock
                                ? "border-[#007185] bg-white text-[#007185] hover:bg-[#F0F8FF]"
                                : "border-[#F0C14B] bg-[#FFD814] text-[#111111] hover:bg-[#F0C14B]"
                        }`}
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {isOutOfStock ? "Liên hệ cửa hàng" : "Chọn ngày thuê"}
                    </Link>
                </div>
            </div>
        </div>
    );
}
