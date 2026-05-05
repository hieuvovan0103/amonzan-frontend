import { CheckCircle, FileText, ShieldCheck, Store } from "lucide-react";
import type { ShopProfile } from "@/lib/api/shops";

type ShopIntroTabProps = {
    shop: ShopProfile;
};

export default function ShopIntroTab({ shop }: ShopIntroTabProps) {
    return (
        <div>
            <h2 className="mb-4 text-[20px] font-bold text-[#222222]">
                Giới thiệu cửa hàng
            </h2>

            <div className="rounded-[6px] border border-[#E6E6E6] bg-[#FAFAFA] p-5">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#FFF7E6] text-[#FF9900]">
                        <Store className="h-5 w-5" />
                    </div>

                    <div>
                        <h3 className="text-[16px] font-bold text-[#222222]">
                            {shop.name}
                        </h3>
                        <p className="text-[13px] text-[#565959]">
                            {shop.type} trên Amonzan
                        </p>
                    </div>
                </div>

                <p className="whitespace-pre-line text-[14px] leading-7 text-[#222222]">
                    {shop.intro}
                </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <IntroStat
                    icon={<FileText className="h-5 w-5" />}
                    title="Khu vực"
                    value={shop.area}
                />

                <IntroStat
                    icon={<CheckCircle className="h-5 w-5" />}
                    title="Sản phẩm"
                    value={`${shop.productCount} sản phẩm`}
                />

                <IntroStat
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title="Trạng thái"
                    value={shop.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                />
            </div>
        </div>
    );
}

function IntroStat({
    icon,
    title,
    value,
}: {
    icon: React.ReactNode;
    title: string;
    value: string;
}) {
    return (
        <div className="rounded-[6px] border border-[#E6E6E6] bg-white p-4">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[6px] bg-[#F7F7F7] text-[#007185]">
                {icon}
            </div>

            <p className="text-[13px] text-[#565959]">{title}</p>
            <p className="mt-1 text-[15px] font-bold text-[#222222]">{value}</p>
        </div>
    );
}
