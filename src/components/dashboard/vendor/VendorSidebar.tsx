"use client";

import {
    BarChart3,
    CalendarDays,
    ChevronRight,
    ClipboardCheck,
    Home,
    Package,
    RotateCcw,
    Settings,
    Store,
} from "lucide-react";
import Link from "next/link";
import { VendorTab } from "@/types/vendor";
import { useAuthStore } from "@/stores/useAuthStore";

type VendorSidebarProps = {
    activeTab: VendorTab;
    setActiveTab: (tab: VendorTab) => void;
};

const NAV_ITEMS: { id: VendorTab | null; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: "vendor_listings", label: "Sản phẩm", icon: Package },
    { id: "vendor_orders", label: "Duyệt đơn thuê", icon: ClipboardCheck },
    { id: "vendor_returns", label: "Yêu cầu hoàn trả", icon: RotateCcw },
    { id: "rentals_calendar", label: "Lịch cho thuê", icon: CalendarDays },
    { id: null, label: "Thống kê", icon: BarChart3, badge: "Soon" },
    { id: "shop_settings", label: "Cài đặt shop", icon: Settings },
];

export default function VendorSidebar({ activeTab, setActiveTab }: VendorSidebarProps) {
    const { profile } = useAuthStore();
    const shopName = profile?.full_name || "Cửa hàng của tôi";
    const initial = shopName.charAt(0).toUpperCase();

    const isActive = (id: VendorTab | null) => {
        if (!id) return false;
        if (id === "vendor_listings") return activeTab === "vendor_listings" || activeTab === "vendor_detail";
        return activeTab === id;
    };

    return (
        <aside className="w-full flex-shrink-0 md:w-[260px]">
            <nav className="flex flex-col gap-1 md:sticky md:top-[76px]">
                <div className="mb-4 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-[#007185] to-[#004f5e] px-4 py-4 shadow-md">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/20 text-[18px] font-bold text-white shadow-inner">
                        {initial}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold text-white">{shopName}</p>
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold text-white/90">
                            <Store className="h-2.5 w-2.5" />
                            Vendor
                        </span>
                    </div>
                </div>

                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#9B9B9B]">
                    Quản lý
                </p>

                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.id);
                    const disabled = item.id === null;

                    return (
                        <button
                            key={item.label}
                            type="button"
                            disabled={disabled}
                            onClick={() => item.id && setActiveTab(item.id)}
                            className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                                active
                                    ? "bg-gradient-to-r from-[#FF9900]/10 to-[#FFD814]/5 text-[#E47911] shadow-sm ring-1 ring-[#FF9900]/20"
                                    : disabled
                                      ? "cursor-not-allowed text-[#C0C0C0]"
                                      : "text-[#444444] hover:bg-[#F5F5F5] hover:text-[#222222]"
                            }`}
                        >
                            {active ? (
                                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-[#FF9900]" />
                            ) : null}

                            <Icon className={`h-4 w-4 flex-shrink-0 transition-transform duration-200 ${active ? "text-[#FF9900]" : ""} ${!disabled && !active ? "group-hover:scale-110" : ""}`} />
                            <span className="flex-1 text-left">{item.label}</span>

                            {item.badge ? (
                                <span className="rounded-full bg-[#E6E6E6] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#9B9B9B]">
                                    {item.badge}
                                </span>
                            ) : null}

                            {active && !item.badge ? <ChevronRight className="h-3.5 w-3.5 text-[#FF9900]" /> : null}
                        </button>
                    );
                })}

                <div className="mt-6 flex flex-col gap-1 border-t border-[#EBEBEB] pt-4">
                    <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#9B9B9B]">
                        Điều hướng
                    </p>

                    <Link
                        href="/products"
                        className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium text-[#565959] transition-all hover:bg-[#F5F5F5] hover:text-[#222222]"
                    >
                        <Home className="h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                        <span>Về trang chủ</span>
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
