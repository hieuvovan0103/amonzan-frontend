import {
    Bell,
    ClipboardList,
    CreditCard,
    Heart,
    MapPin,
    UserCircle,
} from "lucide-react";
import type { ComponentType } from "react";
import { ProfileTab } from "@/types/user-profile";

type ProfileSidebarProps = {
    activeTab: ProfileTab;
    onChangeTab: (tab: ProfileTab) => void;
};

const items: Array<{
    tab: ProfileTab;
    label: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
}> = [
    {
        tab: "profile",
        label: "Hồ sơ cá nhân",
        description: "Thông tin và xác thực",
        icon: UserCircle,
    },
    {
        tab: "my_orders",
        label: "Đơn hàng của tôi",
        description: "Theo dõi thuê và hoàn trả",
        icon: ClipboardList,
    },
    {
        tab: "favorites",
        label: "Yêu thích",
        description: "Sản phẩm đã lưu",
        icon: Heart,
    },
    {
        tab: "notifications",
        label: "Thông báo",
        description: "Cập nhật từ hệ thống",
        icon: Bell,
    },
    {
        tab: "addresses",
        label: "Địa chỉ giao nhận",
        description: "Nơi nhận và trả hàng",
        icon: MapPin,
    },
    {
        tab: "payments",
        label: "Thanh toán",
        description: "Thẻ và tài khoản ngân hàng",
        icon: CreditCard,
    },
];

export default function ProfileSidebar({ activeTab, onChangeTab }: ProfileSidebarProps) {
    return (
        <aside className="lg:sticky lg:top-[88px] lg:self-start">
            <nav className="flex gap-2 overflow-x-auto rounded-[8px] border border-[#D5D9D9] bg-white p-2 shadow-sm lg:flex-col lg:overflow-visible">
                {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.tab;

                    return (
                        <button
                            key={item.tab}
                            type="button"
                            onClick={() => onChangeTab(item.tab)}
                            className={`flex min-w-[170px] items-center gap-3 rounded-[6px] px-3 py-3 text-left transition-colors lg:min-w-0 ${
                                isActive
                                    ? "bg-[#FFF8E1] text-[#B12704]"
                                    : "text-[#222222] hover:bg-[#F7F7F7]"
                            }`}
                        >
                            <Icon
                                className={`h-5 w-5 flex-shrink-0 ${
                                    isActive ? "text-[#B12704]" : "text-[#565959]"
                                }`}
                            />
                            <span className="min-w-0">
                                <span className="block truncate text-[14px] font-bold">{item.label}</span>
                                <span className="hidden truncate text-[12px] text-[#565959] lg:block">
                                    {item.description}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
