import { Star } from "lucide-react";
import { ApiProduct } from "@/types/vendor";

type VendorProductCardProps = {
    product: ApiProduct;
    onSelect: (product: ApiProduct) => void;
};

export default function VendorProductCard({
    product,
    onSelect,
}: VendorProductCardProps) {
    const primaryImage = product.product_images?.find(i => i.is_primary)?.image_url 
        || product.product_images?.[0]?.image_url 
        || "https://placehold.co/400x500?text=No+Image";
        
    const basePrice = product.product_variants?.[0]?.base_daily_rate || 0;
    const totalStock = product.product_variants?.reduce((sum, v) => sum + v.available_stock, 0) || 0;

    return (
        <div
            onClick={() => onSelect(product)}
            className="bg-white border border-[#E6E6E6] rounded-[16px] overflow-hidden shadow-sm hover:shadow-[0_6px_20px_rgba(15,17,17,0.10)] transition-all cursor-pointer group flex flex-col"
        >
            <div className="w-full aspect-[4/5] bg-[#F7F7F7] overflow-hidden">
                <img
                    src={primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-[14px] font-bold text-[#222222] leading-[1.3] mb-1 line-clamp-2">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1 mb-2">
                    <span className="text-[12px] font-bold text-[#222222]">
                        0.0
                    </span>
                    <div className="flex text-[#FFA41C]">
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current" />
                        <Star className="w-3 h-3 fill-current text-[#D5D9D9]" />
                    </div>
                </div>

                <div className="text-[12px] text-[#565959] mb-2">
                    Tồn kho: <span className="font-bold text-[#222222]">{totalStock}</span>
                </div>

                <div className="flex items-baseline gap-1 mb-4 mt-auto pt-2 border-t border-[#E6E6E6]">
                    <span className="text-[16px] font-bold text-[#C62828]">
                        {new Intl.NumberFormat('vi-VN').format(basePrice)}
                    </span>
                    <span className="text-[11px] font-bold text-[#C62828]">vnđ/ngày</span>
                </div>

                {product.status === "ACTIVE" && (
                    <button
                        type="button"
                        className="w-full bg-[#E6F4EA] border border-[#007600] text-[#007600] font-bold text-[13px] py-1.5 rounded-[8px]"
                    >
                        Đang hoạt động
                    </button>
                )}

                {product.status === "DRAFT" && (
                    <button
                        type="button"
                        className="w-full bg-[#F7F7F7] border border-[#D5D9D9] text-[#565959] font-bold text-[13px] py-1.5 rounded-[8px]"
                    >
                        Bản nháp
                    </button>
                )}

                {product.status === "ARCHIVED" && (
                    <button
                        type="button"
                        className="w-full bg-[#FCF4F4] border border-[#C62828] text-[#C62828] font-bold text-[13px] py-1.5 rounded-[8px]"
                    >
                        Đã lưu trữ
                    </button>
                )}
            </div>
        </div>
    );
}