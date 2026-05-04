"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, ChevronDown, LogOut, Search, Settings, Store, UserCircle } from "lucide-react";
import VendorSidebar from "@/components/dashboard/vendor/VendorSidebar";
import VendorListingsView from "@/components/dashboard/vendor/VendorListingsView";
import VendorProductDetailView from "@/components/dashboard/vendor/VendorProductDetailView";
import VendorRentalsCalendarView from "@/components/dashboard/vendor/VendorRentalsCalendarView";
import { MOCK_VENDOR_EVENTS } from "@/data/mockVendorDashboard";
import { ApiProduct, VendorTab } from "@/types/vendor";
import { getVendorProducts } from "@/lib/api/vendor";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useCallback } from "react";

const TAB_LABELS: Record<VendorTab, string> = {
    vendor_listings: "Danh sách sản phẩm",
    vendor_detail: "Chi tiết sản phẩm",
    rentals_calendar: "Lịch cho thuê",
};

export default function VendorDashboardShell() {
    const [activeTab, setActiveTab] = useState<VendorTab>("vendor_listings");
    const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { profile, signOut } = useAuthStore();

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getVendorProducts();
            setProducts(data);
        } catch (err: any) {
            setError(err.message || "Không thể tải danh sách sản phẩm");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSelectProduct = (product: ApiProduct) => {
        setSelectedProduct(product);
        setActiveTab("vendor_detail");
    };

    const handleBackToList = () => {
        setSelectedProduct(null);
        setActiveTab("vendor_listings");
    };

    return (
        <div className="min-h-screen bg-[#F4F6F8]">

            {/* ── Top Header Bar ───────────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-[#E0E4E8] bg-white shadow-sm">
                <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 md:px-6 h-[60px]">

                    {/* Left: Logo + Breadcrumb */}
                    <div className="flex items-center gap-3 min-w-0">
                        <Link
                            href="/products"
                            className="flex items-center gap-2 text-[15px] font-bold text-[#232F3E] tracking-tight hover:text-[#FF9900] transition-colors flex-shrink-0"
                        >
                            AMONZAN
                        </Link>

                        <span className="text-[#D5D9D9] select-none">/</span>

                        <div className="flex items-center gap-1.5 text-[13px] text-[#565959]">
                            <Store className="h-3.5 w-3.5 flex-shrink-0 text-[#007185]" />
                            <span className="font-semibold text-[#007185] hidden sm:block">Quản lý cửa hàng</span>
                        </div>

                        <span className="text-[#D5D9D9] select-none hidden sm:block">/</span>

                        <span className="text-[13px] font-medium text-[#222222] truncate hidden sm:block">
                            {TAB_LABELS[activeTab]}
                        </span>
                    </div>

                    {/* Center: Search */}
                    <div className="hidden md:flex flex-1 max-w-[360px] mx-4">
                        <div className="flex w-full items-center gap-2 rounded-xl border border-[#E0E4E8] bg-[#F4F6F8] px-3 py-2 text-[13px] text-[#9B9B9B] transition-all focus-within:border-[#007185] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#007185]/10">
                            <Search className="h-4 w-4 flex-shrink-0" />
                            <input
                                type="text"
                                placeholder="Tìm sản phẩm, đơn thuê..."
                                className="flex-1 bg-transparent outline-none text-[#222222] placeholder:text-[#9B9B9B]"
                            />
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1">

                        {/* Notification bell */}
                        <button
                            type="button"
                            className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[#565959] transition-all hover:bg-[#F4F6F8] hover:text-[#222222]"
                            aria-label="Thông báo"
                        >
                            <Bell className="h-5 w-5" />
                            {/* Unread dot */}
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#FF9900] ring-2 ring-white" />
                        </button>

                        {/* Settings */}
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-[#565959] transition-all hover:bg-[#F4F6F8] hover:text-[#222222]"
                            aria-label="Cài đặt"
                        >
                            <Settings className="h-5 w-5" />
                        </button>

                        {/* Divider */}
                        <div className="mx-1 h-6 w-px bg-[#E0E4E8]" />

                        {/* User avatar dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowUserMenu((v) => !v)}
                                className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-[#F4F6F8]"
                            >
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#007185] to-[#004f5e] text-[12px] font-bold text-white flex-shrink-0">
                                    {(profile?.full_name || "V").charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden text-[13px] font-medium text-[#222222] max-w-[100px] truncate md:block">
                                    {profile?.full_name || "Vendor"}
                                </span>
                                <ChevronDown className={`hidden md:block h-3.5 w-3.5 text-[#9B9B9B] transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
                            </button>

                            {/* Dropdown */}
                            {showUserMenu && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setShowUserMenu(false)}
                                    />
                                    <div className="absolute right-0 top-full z-40 mt-2 w-[200px] overflow-hidden rounded-2xl border border-[#E0E4E8] bg-white shadow-xl">
                                        <div className="border-b border-[#F0F0F0] px-4 py-3">
                                            <p className="text-[12px] font-semibold text-[#222222] truncate">
                                                {profile?.full_name || "Vendor"}
                                            </p>
                                            <p className="text-[11px] text-[#9B9B9B] truncate">{profile?.email || ""}</p>
                                        </div>

                                        <div className="p-1.5">
                                            <Link
                                                href="/profile"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-[#444444] transition-colors hover:bg-[#F4F6F8]"
                                            >
                                                <UserCircle className="h-4 w-4" />
                                                Tài khoản của tôi
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => { setShowUserMenu(false); signOut(); }}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] text-[#C62828] transition-colors hover:bg-red-50"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                Đăng xuất
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Main Content ─────────────────────────────────────────── */}
            <div className="mx-auto max-w-[1440px] px-4 md:px-6 py-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    <VendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                    <main className="flex-1 min-w-0">
                        {activeTab === "vendor_listings" && (
                            <VendorListingsView
                                products={products}
                                isLoading={isLoading}
                                error={error}
                                onSelectProduct={handleSelectProduct}
                                onRefresh={fetchProducts}
                            />
                        )}

                        {activeTab === "vendor_detail" && selectedProduct && (
                            <VendorProductDetailView
                                product={selectedProduct}
                                onBack={handleBackToList}
                                onUpdate={fetchProducts}
                            />
                        )}

                        {activeTab === "rentals_calendar" && (
                            <VendorRentalsCalendarView events={MOCK_VENDOR_EVENTS} />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}