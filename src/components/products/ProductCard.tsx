import { MapPin, ShoppingCart, Star } from "lucide-react";
import { ProductListItem } from "@/types/product";

type ProductCardProps = {
    data: ProductListItem;
};

export default function ProductCard({ data }: ProductCardProps) {
    return (
        <div className="bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm hover:shadow-[0_8px_24px_rgba(15,17,17,0.10)] transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col">
            <div className="w-full aspect-[4/5] bg-[#F7F7F7] overflow-hidden">
                <img
                    src={data.image}
                    alt={data.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[15px] font-bold text-[#222222] leading-[1.35] line-clamp-2 mb-2">
                    {data.title}
                </h3>

                <div className="text-[13px] text-[#007185] hover:text-[#E47911] hover:underline mb-2 font-medium">
                    {data.shopName}
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[13px] font-bold text-[#222222]">
                        {data.rating.toFixed(1)}
                    </span>

                    <div className="flex text-[#FFA41C]">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 text-[#D5D9D9] fill-current" />
                    </div>

                    <span className="text-[12px] text-[#6B7280]">({data.reviews})</span>
                </div>

                <div className="flex items-center gap-1 text-[12px] text-[#6B7280] mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{data.location}</span>
                </div>

                <div className="mt-auto pt-3 border-t border-[#E6E6E6]">
                    <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-[18px] font-bold text-[#C62828]">
                            {data.price}
                        </span>
                        <span className="text-[12px] font-bold text-[#C62828]">
                            vnđ/ngày
                        </span>
                    </div>

                    <button
                        type="button"
                        className="w-full bg-[#FFD814] hover:bg-[#F0C14B] text-[#111111] border border-[#F0C14B] font-bold text-[13px] py-2 rounded-[10px] transition-colors flex items-center justify-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
}