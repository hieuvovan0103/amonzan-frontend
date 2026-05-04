"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { AdminVendorVerificationRequest } from "@/types/admin-vendor";
import { createVendorDocumentSignedUrl } from "@/lib/storage/vendor-documents";

type VendorVerificationDetailModalProps = {
    vendor: AdminVendorVerificationRequest | null;
    onClose: () => void;
    onApprove?: (vendor: AdminVendorVerificationRequest) => Promise<void>;
    onReject?: (vendor: AdminVendorVerificationRequest) => Promise<void>;
    isSubmitting?: boolean;
};

export default function VendorVerificationDetailModal({
    vendor,
    onClose,
    onApprove,
    onReject,
    isSubmitting = false,
}: VendorVerificationDetailModalProps) {
    const [frontImageUrl, setFrontImageUrl] = useState<string | null>(null);
    const [backImageUrl, setBackImageUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);

    useEffect(() => {
        async function loadImages() {
            if (!vendor) return;

            try {
                setImageError(null);
                setFrontImageUrl(null);
                setBackImageUrl(null);

                if (vendor.identityFrontPath) {
                    const signedUrl = await createVendorDocumentSignedUrl(
                        vendor.identityFrontPath
                    );
                    setFrontImageUrl(signedUrl);
                }

                if (vendor.identityBackPath) {
                    const signedUrl = await createVendorDocumentSignedUrl(
                        vendor.identityBackPath
                    );
                    setBackImageUrl(signedUrl);
                }
            } catch {
                setImageError("Không thể tải ảnh minh chứng.");
            }
        }

        loadImages();
    }, [vendor]);

    if (!vendor) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">
                <div className="flex items-start justify-between border-b px-6 py-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            Chi tiết hồ sơ vendor
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">{vendor.shopName}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-6 p-6">
                    <section>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Thông tin cửa hàng
                        </h3>

                        <div className="grid gap-4 text-sm md:grid-cols-2">
                            <p>
                                <span className="font-medium text-gray-700">Tên shop:</span>{" "}
                                {vendor.shopName}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Loại đối tác:</span>{" "}
                                {vendor.partnerType || "Chưa cung cấp"}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Email liên hệ:</span>{" "}
                                {vendor.contactEmail || "Chưa cung cấp"}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">SĐT liên hệ:</span>{" "}
                                {vendor.contactPhone || "Chưa cung cấp"}
                            </p>
                            <p className="md:col-span-2">
                                <span className="font-medium text-gray-700">Địa chỉ:</span>{" "}
                                {[vendor.addressDetail, vendor.district, vendor.province]
                                    .filter(Boolean)
                                    .join(", ") || "Chưa cung cấp"}
                            </p>
                        </div>

                        {vendor.description && (
                            <p className="mt-4 text-sm text-gray-600">
                                {vendor.description}
                            </p>
                        )}
                    </section>

                    <section>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Người đại diện
                        </h3>

                        <div className="grid gap-4 text-sm md:grid-cols-2">
                            <p>
                                <span className="font-medium text-gray-700">Họ tên:</span>{" "}
                                {vendor.ownerFullName || "Chưa cập nhật"}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Email:</span>{" "}
                                {vendor.ownerEmail || vendor.contactEmail || "Chưa cập nhật"}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">SĐT:</span>{" "}
                                {vendor.ownerPhoneNumber ||
                                    vendor.contactPhone ||
                                    "Chưa cập nhật"}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">Số định danh:</span>{" "}
                                {vendor.identityNumber || "Chưa cung cấp"}
                            </p>
                            <p>
                                <span className="font-medium text-gray-700">
                                    Giấy phép kinh doanh:
                                </span>{" "}
                                {vendor.businessLicenseNo || "Không có"}
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                            Ảnh minh chứng
                        </h3>

                        {imageError && (
                            <p className="mb-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                                {imageError}
                            </p>
                        )}

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-700">
                                    Mặt trước
                                </p>

                                {frontImageUrl ? (
                                    <img
                                        src={frontImageUrl}
                                        alt="Ảnh minh chứng mặt trước"
                                        className="h-64 w-full rounded-xl border object-cover"
                                    />
                                ) : (
                                    <div className="flex h-64 items-center justify-center rounded-xl border bg-gray-50 text-sm text-gray-500">
                                        Chưa có ảnh
                                    </div>
                                )}
                            </div>

                            <div>
                                <p className="mb-2 text-sm font-medium text-gray-700">
                                    Mặt sau
                                </p>

                                {backImageUrl ? (
                                    <img
                                        src={backImageUrl}
                                        alt="Ảnh minh chứng mặt sau"
                                        className="h-64 w-full rounded-xl border object-cover"
                                    />
                                ) : (
                                    <div className="flex h-64 items-center justify-center rounded-xl border bg-gray-50 text-sm text-gray-500">
                                        Chưa có ảnh
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t px-6 py-4">
                    {vendor.verificationStatus === "PENDING" && onReject && (
                        <button
                            type="button"
                            onClick={() => onReject(vendor)}
                            disabled={isSubmitting}
                            className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Từ chối
                        </button>
                    )}
                    {vendor.verificationStatus === "PENDING" && onApprove && (
                        <button
                            type="button"
                            onClick={() => onApprove(vendor)}
                            disabled={isSubmitting}
                            className="rounded-lg border border-emerald-300 bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Duyệt vendor
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
