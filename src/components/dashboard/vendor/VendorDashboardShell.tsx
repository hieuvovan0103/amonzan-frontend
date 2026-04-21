"use client";

import { useState } from "react";
import VendorSidebar from "@/components/dashboard/vendor/VendorSidebar";
import VendorListingsView from "@/components/dashboard/vendor/VendorListingsView";
import VendorProductDetailView from "@/components/dashboard/vendor/VendorProductDetailView";
import VendorRentalsCalendarView from "@/components/dashboard/vendor/VendorRentalsCalendarView";
import { MOCK_VENDOR_EVENTS, MOCK_VENDOR_PRODUCTS } from "@/data/mockVendorDashboard";
import { VendorProduct, VendorTab } from "@/types/vendor";

export default function VendorDashboardShell() {
    const [activeTab, setActiveTab] = useState<VendorTab>("vendor_listings");
    const [selectedProduct, setSelectedProduct] = useState<VendorProduct | null>(null);

    const handleSelectProduct = (product: VendorProduct) => {
        setSelectedProduct(product);
        setActiveTab("vendor_detail");
    };

    const handleBackToList = () => {
        setSelectedProduct(null);
        setActiveTab("vendor_listings");
    };

    return (
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
                <VendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === "vendor_listings" && (
                    <VendorListingsView
                        products={MOCK_VENDOR_PRODUCTS}
                        onSelectProduct={handleSelectProduct}
                    />
                )}

                {activeTab === "vendor_detail" && selectedProduct && (
                    <VendorProductDetailView
                        product={selectedProduct}
                        onBack={handleBackToList}
                    />
                )}

                {activeTab === "rentals_calendar" && (
                    <VendorRentalsCalendarView events={MOCK_VENDOR_EVENTS} />
                )}
            </div>
        </div>
    );
}