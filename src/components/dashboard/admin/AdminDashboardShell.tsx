"use client";

import { useEffect, useState } from "react";
import { AdminOrder, AdminTab } from "@/types/admin";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminTopbar from "@/components/dashboard/admin/AdminTopbar";
import OverviewPage from "@/components/dashboard/admin/OverviewPage";
import AccountsPage from "@/components/dashboard/admin/AccountsPage";
import OrdersPage from "@/components/dashboard/admin/OrdersPage";
import ProductsPage from "@/components/dashboard/admin/ProductsPage";
import CategoriesPage from "@/components/dashboard/admin/CategoriesPage";
import ReviewsPage from "@/components/dashboard/admin/ReviewsPage";
import VendorVerificationSection from "@/components/dashboard/admin/vendor-verification/VendorVerificationSection";
import InventoryPage from "@/components/dashboard/admin/InventoryPage";
import PaymentsPage from "@/components/dashboard/admin/PaymentsPage";
import DisputesPage from "@/components/dashboard/admin/DisputesPage";
import OrderDetailDrawer from "@/components/dashboard/admin/OrderDetailDrawer";

const ADMIN_TAB_STORAGE_KEY = "amonzan-admin-active-tab";
const adminTabs: AdminTab[] = [
    "overview",
    "accounts",
    "orders",
    "products",
    "categories",
    "reviews",
    "vendor_verification",
    "inventory",
    "payments",
    "disputes",
];

function isAdminTab(value: string | null): value is AdminTab {
    return Boolean(value && adminTabs.includes(value as AdminTab));
}

function getInitialAdminTab(): AdminTab {
    if (typeof window === "undefined") {
        return "overview";
    }

    const params = new URLSearchParams(window.location.search);
    if (window.location.pathname.includes("/dashboard/admin/disputes")) {
        return "disputes";
    }

    const tabFromUrl = params.get("tab");
    if (isAdminTab(tabFromUrl)) {
        return tabFromUrl;
    }

    const storedTab = window.localStorage.getItem(ADMIN_TAB_STORAGE_KEY);
    if (isAdminTab(storedTab)) {
        return storedTab;
    }

    return "overview";
}

function persistAdminTab(tab: AdminTab) {
    if (typeof window === "undefined") return;

    window.localStorage.setItem(ADMIN_TAB_STORAGE_KEY, tab);

    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.replaceState(window.history.state, "", url.toString());
}

export default function AdminDashboardShell() {
    const [activeTab, setActiveTabState] = useState<AdminTab>("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

    useEffect(() => {
        setActiveTabState(getInitialAdminTab());
    }, []);

    useEffect(() => {
        persistAdminTab(activeTab);
    }, [activeTab]);

    useEffect(() => {
        const handlePopState = () => {
            const params = new URLSearchParams(window.location.search);
            const tabFromUrl = params.get("tab");
            if (isAdminTab(tabFromUrl)) {
                setActiveTabState(tabFromUrl);
            }
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, []);

    const setActiveTab = (tab: AdminTab) => {
        setActiveTabState(tab);
        setIsMobileOpen(false); // Close mobile sidebar when navigating
    };

    return (
        <div className="flex h-screen bg-[#F0F2F5] font-sans overflow-hidden">
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 md:hidden" 
                    onClick={() => setIsMobileOpen(false)} 
                />
            )}

            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar onOpenMobile={() => setIsMobileOpen(true)} />

                <main className="flex-1 overflow-y-auto bg-[#F0F2F5] scroll-smooth relative">
                    {activeTab === "overview" && <OverviewPage />}
                    {activeTab === "accounts" && <AccountsPage />}
                    {activeTab === "orders" && (
                        <OrdersPage onSelectOrder={setSelectedOrder} />
                    )}
                    {activeTab === "products" && <ProductsPage />}
                    {activeTab === "categories" && <CategoriesPage />}
                    {activeTab === "reviews" && <ReviewsPage />}
                    {activeTab === "vendor_verification" && (
                        <div className="p-6">
                            <VendorVerificationSection />
                        </div>
                    )}
                    {activeTab === "inventory" && <InventoryPage />}
                    {activeTab === "payments" && <PaymentsPage />}
                    {activeTab === "disputes" && <DisputesPage />}
                </main>
            </div>

            <OrderDetailDrawer
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />
        </div>
    );
}
