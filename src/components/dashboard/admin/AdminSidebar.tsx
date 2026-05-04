"use client";

import {
    Box,
    LayoutDashboard,
    Menu,
    Package,
    Settings,
    ShieldAlert,
    ShoppingBag,
    Store,
    Users,
    Wallet,
} from "lucide-react";
import { AdminTab } from "@/types/admin";
import AdminNavItem from "@/components/dashboard/admin/AdminNavItem";

type AdminSidebarProps = {
    activeTab: AdminTab;
    setActiveTab: (tab: AdminTab) => void;
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
};

export default function AdminSidebar({
    activeTab,
    setActiveTab,
    isSidebarOpen,
    setIsSidebarOpen,
}: AdminSidebarProps) {
    return (
        <aside
            className={`bg-white border-r border-[#E6E6E6] flex flex-col transition-all duration-300 ease-in-out shadow-lg z-50 ${isSidebarOpen ? "w-[260px]" : "w-[80px]"
                }`}
        >
            <div className="p-5 border-b border-[#E6E6E6] flex items-center justify-between h-[64px]">
                {isSidebarOpen && (
                    <div className="text-xl font-bold tracking-tighter text-[#232F3E] animate-in slide-in-from-left-2">
                        AMONZAN<span className="text-[#FF9900]">.AD</span>
                    </div>
                )}

                <button
                    type="button"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-[#F7F7F7] rounded-xl transition-all"
                >
                    <Menu className="w-5 h-5 text-[#222222]" />
                </button>
            </div>

            <nav className="p-3 flex-1 space-y-1 overflow-y-auto no-scrollbar">
                <AdminNavItem
                    icon={LayoutDashboard}
                    label="Tổng quan"
                    active={activeTab === "overview"}
                    onClick={() => setActiveTab("overview")}
                    collapsed={!isSidebarOpen}
                />
                <AdminNavItem
                    icon={Users}
                    label="Tài khoản & Phân quyền"
                    active={activeTab === "accounts"}
                    onClick={() => setActiveTab("accounts")}
                    collapsed={!isSidebarOpen}
                />

                <div className="pt-6 pb-2 px-3 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                    {isSidebarOpen ? "Vận hành hệ thống" : "---"}
                </div>

                <AdminNavItem
                    icon={ShoppingBag}
                    label="Đơn thuê"
                    active={activeTab === "orders"}
                    onClick={() => setActiveTab("orders")}
                    collapsed={!isSidebarOpen}
                />
                <AdminNavItem
                    icon={Package}
                    label="Sản phẩm"
                    active={activeTab === "products"}
                    onClick={() => setActiveTab("products")}
                    collapsed={!isSidebarOpen}
                />
                <AdminNavItem
                    icon={Store}
                    label="Duyệt vendor"
                    active={activeTab === "vendor_verification"}
                    onClick={() => setActiveTab("vendor_verification")}
                    collapsed={!isSidebarOpen}
                />
                <AdminNavItem
                    icon={Box}
                    label="Tồn kho"
                    active={activeTab === "inventory"}
                    onClick={() => setActiveTab("inventory")}
                    collapsed={!isSidebarOpen}
                />

                <div className="pt-6 pb-2 px-3 text-[10px] font-black text-[#6B7280] uppercase tracking-widest">
                    {isSidebarOpen ? "Tài chính & Rủi ro" : "---"}
                </div>

                <AdminNavItem
                    icon={Wallet}
                    label="Ví & Escrow"
                    active={activeTab === "payments"}
                    onClick={() => setActiveTab("payments")}
                    collapsed={!isSidebarOpen}
                />
                <AdminNavItem
                    icon={ShieldAlert}
                    label="Tranh chấp"
                    active={activeTab === "disputes"}
                    onClick={() => setActiveTab("disputes")}
                    collapsed={!isSidebarOpen}
                    badge="12"
                />
            </nav>

            <div className="p-3 border-t border-[#E6E6E6]">
                <AdminNavItem
                    icon={Settings}
                    label="Cài đặt hệ thống"
                    collapsed={!isSidebarOpen}
                />
            </div>
        </aside>
    );
}
