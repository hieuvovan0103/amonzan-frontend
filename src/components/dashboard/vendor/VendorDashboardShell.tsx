"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, LogOut, Search, Settings, Store, UserCircle } from "lucide-react";
import VendorSidebar from "@/components/dashboard/vendor/VendorSidebar";
import VendorListingsView from "@/components/dashboard/vendor/VendorListingsView";
import VendorProductDetailView from "@/components/dashboard/vendor/VendorProductDetailView";
import VendorRentalsCalendarView from "@/components/dashboard/vendor/VendorRentalsCalendarView";
import VendorShopSettingsView from "@/components/dashboard/vendor/VendorShopSettingsView";
import VendorOrdersView from "@/components/dashboard/vendor/VendorOrdersView";
import ReturnRequestList from "@/components/returns/ReturnRequestList";
import { MOCK_VENDOR_EVENTS } from "@/data/mockVendorDashboard";
import { ApiProduct, VendorTab } from "@/types/vendor";
import { getVendorProducts } from "@/lib/api/vendor";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useCallback } from "react";
import NotificationBell from "@/components/notifications/NotificationBell";

const TAB_LABELS: Record<VendorTab, string> = {
    vendor_listings: "Danh sách sản phẩm",
    vendor_detail: "Chi tiết sản phẩm",
    vendor_orders: "Duyệt đơn thuê",
    vendor_returns: "Yêu cầu hoàn trả",
    rentals_calendar: "Lịch cho thuê",
    shop_settings: "Cài đặt cửa hàng",
};

const VENDOR_TAB_STORAGE_KEY = "amonzan-vendor-active-tab";
const VENDOR_PRODUCT_STORAGE_KEY = "amonzan-vendor-selected-product-id";
const vendorTabs: VendorTab[] = [
    "vendor_listings",
    "vendor_detail",
    "vendor_orders",
    "vendor_returns",
    "rentals_calendar",
    "shop_settings",
];

function isVendorTab(value: string | null): value is VendorTab {
    return Boolean(value && vendorTabs.includes(value as VendorTab));
}

function getInitialVendorTab(): VendorTab {
    if (typeof window === "undefined") {
        return "vendor_listings";
    }

    const params = new URLSearchParams(window.location.search);
    if (window.location.pathname.includes("/dashboard/vendor/returns")) {
        return "vendor_returns";
    }

    const tabFromUrl = params.get("tab");
    if (isVendorTab(tabFromUrl)) {
        return tabFromUrl;
    }

    const storedTab = window.localStorage.getItem(VENDOR_TAB_STORAGE_KEY);
    if (isVendorTab(storedTab)) {
        return storedTab;
    }

    return "vendor_listings";
}

function persistVendorState(tab: VendorTab, productId?: string | null) {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(VENDOR_TAB_STORAGE_KEY, tab);

    if (productId) {
        window.localStorage.setItem(VENDOR_PRODUCT_STORAGE_KEY, productId);
    } else if (tab !== "vendor_detail") {
        window.localStorage.removeItem(VENDOR_PRODUCT_STORAGE_KEY);
    }

    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);

    if (tab === "vendor_detail" && productId) {
        url.searchParams.set("productId", productId);
    } else {
        url.searchParams.delete("productId");
    }

    window.history.replaceState(window.history.state, "", url.toString());
}

function getRestoredSelectedProduct(products: ApiProduct[]) {
    if (typeof window === "undefined" || products.length === 0) {
        return null;
    }

    const params = new URLSearchParams(window.location.search);
    const productId =
        params.get("productId") ??
        window.localStorage.getItem(VENDOR_PRODUCT_STORAGE_KEY);

    if (!productId) {
        return null;
    }

    return products.find((product) => product.product_id === productId) ?? null;
}

export default function VendorDashboardShell() {
    const [activeTab, setActiveTabState] = useState<VendorTab>("vendor_listings");
    const [selectedProduct, setSelectedProduct] = useState<ApiProduct | null>(null);
    const [products, setProducts] = useState<ApiProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { profile, signOut } = useAuthStore();

    useEffect(() => {
        setActiveTabState(getInitialVendorTab());
    }, []);

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getVendorProducts();
            setProducts(data);
            setSelectedProduct((current) =>
                current
                    ? data.find((product) => product.product_id === current.product_id) ?? current
                    : getRestoredSelectedProduct(data),
            );
        } catch (err: any) {
            setError(err.message || "Không thể tải danh sách sản phẩm");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        persistVendorState(activeTab, selectedProduct?.product_id);
    }, [activeTab, selectedProduct?.product_id]);

    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const tabFromUrl = params.get("tab");
            const productId = params.get("productId");

            if (isVendorTab(tabFromUrl)) {
                setActiveTabState(tabFromUrl);
            }

            if (productId) {
                setSelectedProduct(
                    products.find((product) => product.product_id === productId) ?? null,
                );
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [products]);

    useEffect(() => {
        if (activeTab !== "vendor_detail") return;
        if (selectedProduct || products.length === 0) return;

        const restoredProduct = getRestoredSelectedProduct(products);
        if (restoredProduct) {
            setSelectedProduct(restoredProduct);
        } else {
            setActiveTabState("vendor_listings");
        }
    }, [activeTab, products, selectedProduct]);

    const setActiveTab = (tab: VendorTab) => {
        if (tab !== "vendor_detail") {
            setSelectedProduct(null);
        }
        setActiveTabState(tab);
    };

    const handleSelectProduct = (product: ApiProduct) => {
        setSelectedProduct(product);
        setActiveTabState("vendor_detail");
    };

    const handleBackToList = () => {
        setSelectedProduct(null);
        setActiveTabState("vendor_listings");
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

                        <NotificationBell
                            buttonClassName="flex h-9 w-9 items-center justify-center rounded-xl text-[#565959] hover:bg-[#F4F6F8] hover:text-[#222222]"
                            iconClassName="h-5 w-5"
                        />

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

                        {activeTab === "vendor_orders" && (
                            <VendorOrdersView />
                        )}

                        {activeTab === "vendor_returns" && (
                            <ReturnRequestList />
                        )}

                        {activeTab === "shop_settings" && (
                            <VendorShopSettingsView />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
