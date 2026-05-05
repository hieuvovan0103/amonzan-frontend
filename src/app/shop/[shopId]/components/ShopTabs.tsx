import { Info, MessageSquare, Package } from "lucide-react";
import type { ShopTab } from "./ShopProfilePage";

type ShopTabsProps = {
    activeTab: ShopTab;
    onChangeTab: (tab: ShopTab) => void;
};

const tabs = [
    {
        id: "products",
        label: "Sản phẩm cho thuê",
        icon: Package,
    },
    {
        id: "intro",
        label: "Giới thiệu",
        icon: Info,
    },
    {
        id: "reviews",
        label: "Đánh giá",
        icon: MessageSquare,
    },
] as const;

export default function ShopTabs({ activeTab, onChangeTab }: ShopTabsProps) {
    return (
        <div className="flex overflow-x-auto border-b border-[#E6E6E6] bg-[#F7F7F7]">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onChangeTab(tab.id)}
                        className={[
                            "flex min-w-fit items-center gap-2 border-b-2 px-5 py-4 text-[14px] font-bold transition-colors",
                            isActive
                                ? "border-[#FF9900] bg-white text-[#111111]"
                                : "border-transparent text-[#565959] hover:bg-white hover:text-[#111111]",
                        ].join(" ")}
                    >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
