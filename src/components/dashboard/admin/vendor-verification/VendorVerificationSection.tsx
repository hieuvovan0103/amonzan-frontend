"use client";

import { useEffect, useMemo, useState } from "react";
import type {
    AdminVendorVerificationRequest,
    VendorVerificationTab,
} from "@/types/admin-vendor";
import {
    approveVendorVerification,
    getVendorVerificationRequests,
    rejectVendorVerification,
} from "@/lib/api/admin-vendors";
import VendorVerificationTabs from "./VendorVerificationTabs";
import VendorVerificationToolbar from "./VendorVerificationToolbar";
import VendorVerificationTable from "./VendorVerificationTable";
import VendorVerificationDetailModal from "./VendorVerificationDetailModal";

export default function VendorVerificationSection() {
    const [activeTab, setActiveTab] =
        useState<VendorVerificationTab>("PENDING");

    const [vendors, setVendors] = useState<AdminVendorVerificationRequest[]>([]);
    const [selectedVendor, setSelectedVendor] =
        useState<AdminVendorVerificationRequest | null>(null);

    const [searchValue, setSearchValue] = useState("");
    const [sortValue, setSortValue] = useState<"newest" | "oldest">("newest");

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function loadVendors() {
        try {
            setIsLoading(true);
            setErrorMessage(null);

            const data = await getVendorVerificationRequests("ALL");
            setVendors(data);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Không thể tải danh sách hồ sơ vendor.";

            setErrorMessage(message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadVendors();
    }, []);

    async function handleReviewAction(
        vendor: AdminVendorVerificationRequest,
        action: "approve" | "reject"
    ) {
        try {
            setIsSubmittingReview(true);
            setErrorMessage(null);

            const updatedVendor =
                action === "approve"
                    ? await approveVendorVerification(vendor.shopId)
                    : await rejectVendorVerification(vendor.shopId);

            setVendors((currentVendors) =>
                currentVendors.map((item) =>
                    item.shopId === updatedVendor.shopId ? updatedVendor : item
                )
            );
            setSelectedVendor(updatedVendor);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Khong the cap nhat trang thai ho so vendor.";
            setErrorMessage(message);
        } finally {
            setIsSubmittingReview(false);
        }
    }

    const filteredVendors = useMemo(() => {
        const keyword = searchValue.trim().toLowerCase();

        const result = vendors.filter((vendor) => {
            if (
                activeTab !== "ALL" &&
                vendor.verificationStatus !== activeTab
            ) {
                return false;
            }

            if (!keyword) return true;

            return [
                vendor.shopName,
                vendor.contactPhone,
                vendor.contactEmail,
                vendor.ownerFullName,
                vendor.ownerPhoneNumber,
                vendor.ownerEmail,
            ]
                .filter(Boolean)
                .some((value) => value!.toLowerCase().includes(keyword));
        });

        return result.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;

            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();

            return sortValue === "newest" ? timeB - timeA : timeA - timeB;
        });
    }, [activeTab, vendors, searchValue, sortValue]);

    const pendingCount = vendors.filter(
        (vendor) => vendor.verificationStatus === "PENDING"
    ).length;
    const approvedCount = vendors.filter(
        (vendor) => vendor.verificationStatus === "VERIFIED"
    ).length;
    const rejectedCount = vendors.filter(
        (vendor) => vendor.verificationStatus === "REJECTED"
    ).length;

    return (
        <section className="space-y-6">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Duyệt hồ sơ Vendor
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Kiểm tra và phê duyệt các cửa hàng đăng ký trở thành đối tác.
                    </p>
                </div>

                <button
                    type="button"
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                    Xuất báo cáo
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <VendorVerificationTabs
                    activeTab={activeTab}
                    pendingCount={pendingCount}
                    approvedCount={approvedCount}
                    rejectedCount={rejectedCount}
                    onTabChange={setActiveTab}
                />

                <VendorVerificationToolbar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    sortValue={sortValue}
                    onSortChange={setSortValue}
                />

                {isLoading ? (
                    <div className="p-8 text-center text-sm text-gray-500">
                        Đang tải danh sách hồ sơ vendor...
                    </div>
                ) : errorMessage ? (
                    <div className="p-8 text-center text-sm text-red-600">
                        {errorMessage}
                    </div>
                ) : (
                    <VendorVerificationTable
                        vendors={filteredVendors}
                        onViewDetail={setSelectedVendor}
                    />
                )}
            </div>

            <VendorVerificationDetailModal
                vendor={selectedVendor}
                onClose={() => setSelectedVendor(null)}
                onApprove={(vendor) => handleReviewAction(vendor, "approve")}
                onReject={(vendor) => handleReviewAction(vendor, "reject")}
                isSubmitting={isSubmittingReview}
            />
        </section>
    );
}
