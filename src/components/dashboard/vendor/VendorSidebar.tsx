"use client";

import { Library, Package, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { VendorTab } from "@/types/vendor";
import { useAuthStore } from "@/stores/useAuthStore";

type VendorSidebarProps = {
    activeTab: VendorTab;
    setActiveTab: (tab: VendorTab) => void;
};

export default function VendorSidebar({
    activeTab,
    setActiveTab,
}: VendorSidebarProps) {
    const { signOut } = useAuthStore();

    return (
        <aside className="w-full md:w-[240px] flex-shrink-0">
            <nav className="flex flex-col gap-2 md:sticky md:top-[90px]">
                <div className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] border-l-4 border-[#007185] bg-white shadow-sm">
                    <Library className="w-5 h-5 text-[#007185]" />
                    <span className="font-bold text-[#007185]">Quản lý gian hàng</span>
                </div>

                <button
                    type="button"
                    onClick={() => setActiveTab("vendor_listings")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all font-medium ${activeTab === "vendor_listings" || activeTab === "vendor_detail"
                            ? "bg-white shadow-sm text-[#FF9900]"
                            : "text-[#222222] hover:bg-white hover:shadow-sm"
                        }`}
                >
                    <Package className="w-5 h-5" />
                    <span>Danh sách sản phẩm</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("rentals_calendar")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all font-medium ${activeTab === "rentals_calendar"
                            ? "bg-white shadow-sm text-[#FF9900]"
                            : "text-[#222222] hover:bg-white hover:shadow-sm"
                        }`}
                >
                    <Library className="w-5 h-5" />
                    <span>Lịch cho thuê</span>
                </button>
                <div className="mt-8 border-t border-[#E6E6E6] pt-4 flex flex-col gap-2">
                    <Link
                        href="/"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[#565959] hover:bg-[#F7F7F7] hover:text-[#222222] font-medium transition-all group"
                    >
                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Về trang chủ</span>
                    </Link>

                    <button
                        type="button"
                        onClick={signOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[#C62828] hover:bg-red-50 hover:shadow-sm font-medium transition-all group"
                    >
                        <LogOut className="w-5 h-5 group-hover:text-red-700 group-hover:scale-110 transition-all" />
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </nav>
        </aside>
    );
}