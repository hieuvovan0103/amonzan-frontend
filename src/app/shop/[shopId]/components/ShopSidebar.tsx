import {
    Clock,
    Mail,
    MapPin,
    Package,
    Phone,
    ShieldCheck,
} from "lucide-react";
import type { ShopProfile } from "@/lib/api/shops";

type ShopSidebarProps = {
    shop: ShopProfile;
};

export default function ShopSidebar({ shop }: ShopSidebarProps) {
    return (
        <aside className="flex flex-col gap-6 lg:w-[320px]">
            <div className="rounded-[6px] border border-[#E6E6E6] bg-white p-5 shadow-sm">
                <h3 className="mb-4 border-b border-[#E6E6E6] pb-2 text-[16px] font-bold text-[#222222]">
                    Độ tin cậy
                </h3>

                <div className="space-y-3 text-[13px]">
                    <InfoRow label="Đánh giá:" value={`${Number(shop.rating ?? 0).toFixed(1)}/5.0`} />
                    <InfoRow
                        label="Sản phẩm cho thuê:"
                        value={String(shop.productCount)}
                        valueClassName="text-[#007185]"
                    />
                    <InfoRow
                        label="Tỷ lệ hoàn tất đơn:"
                        value={shop.completionRate}
                        valueClassName="text-[#007600]"
                    />
                    <InfoRow
                        label="Trạng thái:"
                        value={shop.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                    />
                </div>
            </div>

            <div className="rounded-[6px] border border-[#E6E6E6] bg-white p-5 shadow-sm">
                <h3 className="mb-4 border-b border-[#E6E6E6] pb-2 text-[16px] font-bold text-[#222222]">
                    Thông tin liên hệ
                </h3>

                <div className="space-y-3 text-[13px] text-[#222222]">
                    <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#565959]" />
                        <span>{shop.contact.phone}</span>
                    </div>

                    <div className="flex items-start gap-3">
                        <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#565959]" />
                        {shop.contact.email?.includes("@") ? (
                            <a
                                href={`mailto:${shop.contact.email}`}
                                className="text-[#007185] hover:underline"
                            >
                                {shop.contact.email}
                            </a>
                        ) : (
                            <span>{shop.contact.email}</span>
                        )}
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#565959]" />
                        <span className="leading-[1.5]">{shop.contact.fullArea}</span>
                    </div>
                </div>
            </div>

            <div className="rounded-[6px] border border-[#E6E6E6] bg-white p-5 shadow-sm">
                <h3 className="mb-4 border-b border-[#E6E6E6] pb-2 text-[16px] font-bold text-[#222222]">
                    Chính sách cửa hàng
                </h3>

                <div className="space-y-4 text-[13px]">
                    <PolicyBlock
                        icon={<ShieldCheck className="h-3.5 w-3.5" />}
                        title="Thông tin từ shop:"
                        content={shop.policyText}
                    />

                    <PolicyBlock
                        icon={<Clock className="h-3.5 w-3.5" />}
                        title="Thời gian thuê:"
                        content="Thời gian thuê cụ thể được chọn ở trang chi tiết sản phẩm."
                    />

                    <PolicyBlock
                        icon={<Package className="h-3.5 w-3.5" />}
                        title="Sản phẩm:"
                        content={`${shop.productCount} sản phẩm đang hiển thị trên Amonzan.`}
                    />
                </div>
            </div>
        </aside>
    );
}

function InfoRow({
    label,
    value,
    valueClassName = "text-[#222222]",
}: {
    label: string;
    value: string;
    valueClassName?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-[#565959]">{label}</span>
            <span className={`text-right font-bold ${valueClassName}`}>{value}</span>
        </div>
    );
}

function PolicyBlock({
    icon,
    title,
    content,
}: {
    icon: React.ReactNode;
    title: string;
    content: string;
}) {
    return (
        <div>
            <span className="mb-1 flex items-center gap-1.5 font-bold text-[#222222]">
                {icon}
                {title}
            </span>

            <p className="whitespace-pre-line leading-6 text-[#565959]">{content}</p>
        </div>
    );
}
