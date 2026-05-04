"use client";

import { useState } from "react";
import { AdminOrder, AdminTab } from "@/types/admin";
import AdminSidebar from "@/components/dashboard/admin/AdminSidebar";
import AdminTopbar from "@/components/dashboard/admin/AdminTopbar";
import OverviewPage from "@/components/dashboard/admin/OverviewPage";
import AccountsPage from "@/components/dashboard/admin/AccountsPage";
import OrdersPage from "@/components/dashboard/admin/OrdersPage";
import ProductsPage from "@/components/dashboard/admin/ProductsPage";
import VendorVerificationSection from "@/components/dashboard/admin/vendor-verification/VendorVerificationSection";
import InventoryPage from "@/components/dashboard/admin/InventoryPage";
import PaymentsPage from "@/components/dashboard/admin/PaymentsPage";
import DisputesPage from "@/components/dashboard/admin/DisputesPage";
import OrderDetailDrawer from "@/components/dashboard/admin/OrderDetailDrawer";

export default function AdminDashboardShell() {
    const [activeTab, setActiveTab] = useState<AdminTab>("overview");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

    return (
        <div className="flex h-screen bg-[#F0F2F5] font-sans overflow-hidden">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopbar />

                <main className="flex-1 overflow-y-auto bg-[#F0F2F5] scroll-smooth relative">
                    {activeTab === "overview" && <OverviewPage />}
                    {activeTab === "accounts" && <AccountsPage />}
                    {activeTab === "orders" && (
                        <OrdersPage onSelectOrder={setSelectedOrder} />
                    )}
                    {activeTab === "products" && <ProductsPage />}
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
