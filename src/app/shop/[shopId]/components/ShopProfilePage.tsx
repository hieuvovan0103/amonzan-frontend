"use client";

import { useState } from "react";
import type { ShopProfile } from "@/lib/api/shops";
import ShopHeader from "./ShopHeader";
import ShopSidebar from "./ShopSidebar";
import ShopTabs from "./ShopTabs";
import ShopProductsTab from "./ShopProductsTab";
import ShopIntroTab from "./ShopIntroTab";
import ShopReviewsTab from "./ShopReviewsTab";

type ShopProfilePageProps = {
    shop: ShopProfile;
};

export type ShopTab = "products" | "intro" | "reviews";

export default function ShopProfilePage({ shop }: ShopProfilePageProps) {
    const [activeTab, setActiveTab] = useState<ShopTab>("products");
    const products = shop.products ?? [];
    const reviews = shop.reviews ?? [];

    return (
        <main className="min-h-screen bg-[#F3F4F6] px-4 py-6 text-[#222222] md:px-8">
            <div className="mx-auto w-full max-w-[1280px]">
                <ShopHeader shop={shop} onViewProducts={() => setActiveTab("products")} />

                <div className="flex flex-col gap-6 lg:flex-row">
                    <ShopSidebar shop={shop} />

                    <section className="flex flex-1 flex-col overflow-hidden rounded-[6px] border border-[#E6E6E6] bg-white shadow-sm">
                        <ShopTabs activeTab={activeTab} onChangeTab={setActiveTab} />

                        <div className="p-5 md:p-6">
                            {activeTab === "products" && (
                                <ShopProductsTab products={products} />
                            )}

                            {activeTab === "intro" && <ShopIntroTab shop={shop} />}

                            {activeTab === "reviews" && (
                                <ShopReviewsTab reviews={reviews} />
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
