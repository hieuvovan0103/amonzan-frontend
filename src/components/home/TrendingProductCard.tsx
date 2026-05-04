import Link from "next/link";
import { MapPin, Star } from "lucide-react";
import type { ProductListItem } from "@/types/product";

type TrendingProductCardProps = {
    item: ProductListItem;
};

export default function TrendingProductCard({ item }: TrendingProductCardProps) {
    return (
        <Link
            href={`/products/${item.slug}`}
            className="group flex flex-col overflow-hidden rounded-sm border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#FF9900] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
        >
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute left-3 top-3 flex items-center gap-1 bg-white px-2 py-1 text-xs font-semibold text-gray-900 border border-gray-200 rounded-sm">
                    <Star className="h-3 w-3 fill-current text-[#FF9900]" />
                    {item.rating.toFixed(1)} ({item.reviews})
                </div>
            </div>

            <div className="flex flex-grow flex-col p-4">
                <div className="mb-1 text-xs text-gray-500">{item.shopName}</div>

                <h3 className="mb-2 min-h-[40px] line-clamp-2 font-medium text-gray-900 transition-colors group-hover:text-[#FF9900]">
                    {item.title}
                </h3>

                <div className="mt-auto border-t border-gray-100 pt-3">
                    <span className="text-lg font-bold text-[#B12704]">
                        {item.price}
                    </span>
                    <span className="text-sm text-gray-500"> / ngày</span>
                </div>

                <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{item.location}</span>
                </div>
            </div>
        </Link>
    );
}