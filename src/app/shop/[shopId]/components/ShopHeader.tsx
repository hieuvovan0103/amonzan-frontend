import {
    MapPin,
    MessageCircle,
    Package,
    ShieldCheck,
    Star,
    Store,
} from "lucide-react";
import type { ShopProfile } from "@/lib/api/shops";

type ShopHeaderProps = {
    shop: ShopProfile;
    onViewProducts: () => void;
};

function getInitials(name: string) {
    return (name || "Shop")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase() || "S";
}

export default function ShopHeader({ shop, onViewProducts }: ShopHeaderProps) {
    return (
        <section className="mb-6 overflow-hidden rounded-[6px] border border-[#E6E6E6] bg-white shadow-sm">
            <div className="relative h-[170px] w-full bg-[#232F3E] md:h-[220px]">
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#232F3E_0%,#37475A_52%,#FF9900_100%)]" />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="relative px-5 pb-6 md:px-6">
                <div className="absolute -top-[48px] flex h-[96px] w-[96px] items-center justify-center rounded-[6px] border-4 border-white bg-[#FF9900] text-[28px] font-bold text-[#111111] shadow-sm md:-top-[56px] md:h-[112px] md:w-[112px]">
                    {getInitials(shop.name)}
                </div>

                <div className="flex flex-col items-start justify-between gap-4 pt-[58px] md:flex-row md:pl-[136px] md:pt-4">
                    <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h1 className="text-[24px] font-bold leading-tight text-[#222222] md:text-[28px]">
                                {shop.name || "Cửa hàng"}
                            </h1>

                            {shop.isVerified && (
                                <span className="flex items-center gap-1 rounded-[4px] border border-[#007600]/20 bg-[#E6F4EA] px-2 py-0.5 text-[11px] font-bold text-[#007600]">
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    Đã xác minh
                                </span>
                            )}
                        </div>

                        <div className="mb-3 flex flex-wrap items-center gap-4 text-[13px] text-[#565959]">
                            <span className="flex items-center gap-1.5 font-bold text-[#222222]">
                                <Star className="h-4 w-4 fill-current text-[#FFA41C]" />
                                {Number(shop.rating ?? 0).toFixed(1)}
                                <span className="font-normal text-[#007185]">
                                    ({shop.reviewCount} đánh giá)
                                </span>
                            </span>

                            <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {shop.area}
                            </span>

                            <span className="flex items-center gap-1">
                                <Store className="h-4 w-4" />
                                {shop.type}
                            </span>
                        </div>

                        <p className="line-clamp-2 max-w-2xl text-[14px] leading-6 text-[#222222]">
                            {shop.shortDesc}
                        </p>
                    </div>

                    <div className="flex w-full flex-row gap-2 md:w-auto md:flex-col">
                        <button
                            type="button"
                            className="flex flex-1 items-center justify-center gap-2 rounded-[4px] border border-[#F0C14B] bg-[#FFD814] px-4 py-2.5 text-[14px] font-bold text-[#111111] shadow-sm transition-colors hover:bg-[#F0C14B] md:w-[180px]"
                        >
                            <MessageCircle className="h-4 w-4" />
                            Nhắn tin shop
                        </button>

                        <button
                            type="button"
                            onClick={onViewProducts}
                            className="flex flex-1 items-center justify-center gap-2 rounded-[4px] border border-[#D5D9D9] bg-white px-4 py-2.5 text-[14px] font-bold text-[#222222] shadow-sm transition-colors hover:bg-[#F7F7F7] md:w-[180px]"
                        >
                            <Package className="h-4 w-4" />
                            Xem sản phẩm
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
