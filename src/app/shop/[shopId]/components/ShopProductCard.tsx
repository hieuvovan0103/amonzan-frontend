import Link from "next/link";
import { Star } from "lucide-react";
import type { ShopProfileProduct } from "@/lib/api/shops";

type ShopProductCardProps = {
    product: ShopProfileProduct;
};

export default function ShopProductCard({ product }: ShopProductCardProps) {
    return (
        <Link
            href={`/products/${product.slug}`}
            className="group overflow-hidden rounded-[6px] border border-[#E6E6E6] bg-white transition-shadow hover:shadow-md"
        >
            <div className="relative aspect-[4/3] bg-[#F7F7F7]">
                <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 rounded-[4px] bg-white/95 px-2 py-1 text-[11px] font-bold text-[#222222] shadow-sm">
                    {product.category}
                </span>

                <span
                    className={[
                        "absolute bottom-3 left-3 rounded-[4px] px-2 py-1 text-[11px] font-bold shadow-sm",
                        product.stock
                            ? "bg-[#E6F4EA] text-[#007600]"
                            : "bg-[#FDECEC] text-[#C62828]",
                    ].join(" ")}
                >
                    {product.stock ? "Còn hàng" : "Tạm hết"}
                </span>
            </div>

            <div className="p-4">
                <h3 className="line-clamp-2 min-h-[40px] text-[14px] font-semibold leading-5 text-[#222222] group-hover:text-[#007185]">
                    {product.title}
                </h3>

                <div className="mt-3 flex items-center gap-1 text-[13px]">
                    <Star className="h-4 w-4 fill-current text-[#FFA41C]" />
                    <span className="font-bold text-[#222222]">
                        {Number(product.rating ?? 0).toFixed(1)}
                    </span>
                </div>

                <div className="mt-3">
                    <span className="text-[20px] font-bold text-[#B12704]">
                        {product.priceText}
                    </span>
                    <span className="text-[13px] font-bold text-[#B12704]"> vnđ</span>
                    <span className="text-[13px] text-[#565959]"> / ngày</span>
                </div>
            </div>
        </Link>
    );
}
