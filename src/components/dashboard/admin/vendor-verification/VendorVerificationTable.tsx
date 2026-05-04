import { Eye, FileText, Store } from "lucide-react";
import type { AdminVendorVerificationRequest } from "@/types/admin-vendor";
import VendorVerificationStatusBadge from "./VendorVerificationStatusBadge";

type VendorVerificationTableProps = {
    vendors: AdminVendorVerificationRequest[];
    onViewDetail: (vendor: AdminVendorVerificationRequest) => void;
};

function getShopInitials(shopName: string) {
    return shopName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function formatDate(dateString: string | null) {
    if (!dateString) {
        return "Chưa có";
    }

    return new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getDocuments(vendor: AdminVendorVerificationRequest) {
    const documents: string[] = [];

    if (vendor.identityFrontPath || vendor.identityBackPath) {
        documents.push("CCCD");
    }

    if (vendor.businessLicenseNo) {
        documents.push("GPKD");
    }

    return documents;
}

export default function VendorVerificationTable({
    vendors,
    onViewDetail,
}: VendorVerificationTableProps) {
    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Thông tin Shop
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Người đại diện
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Giấy tờ
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Ngày gửi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Trạng thái
                            </th>
                            <th className="relative px-6 py-3">
                                <span className="sr-only">Hành động</span>
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-white">
                        {vendors.length > 0 ? (
                            vendors.map((vendor) => {
                                const documents = getDocuments(vendor);

                                return (
                                    <tr
                                        key={vendor.shopId}
                                        className="transition-colors hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-blue-50 text-sm font-bold text-blue-700">
                                                    {getShopInitials(vendor.shopName)}
                                                </div>

                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {vendor.shopName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {vendor.contactEmail || "Chưa có email liên hệ"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {vendor.ownerFullName || "Chưa cập nhật"}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {vendor.contactPhone ||
                                                    vendor.ownerPhoneNumber ||
                                                    "Chưa có SĐT"}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex gap-1.5">
                                                {documents.length > 0 ? (
                                                    documents.map((doc) => (
                                                        <span
                                                            key={doc}
                                                            className="inline-flex items-center rounded border border-indigo-100 bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700"
                                                        >
                                                            <FileText className="mr-1 h-3 w-3" />
                                                            {doc}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm italic text-gray-400">
                                                        Chưa cập nhật
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {formatDate(vendor.createdAt)}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <VendorVerificationStatusBadge
                                                status={vendor.verificationStatus}
                                            />
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                type="button"
                                                onClick={() => onViewDetail(vendor)}
                                                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                            >
                                                <Eye className="mr-2 h-4 w-4 text-gray-500" />
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Store className="mb-3 h-12 w-12 text-gray-300" />
                                        <p className="text-base font-medium text-gray-900">
                                            Không có hồ sơ nào
                                        </p>
                                        <p className="mt-1 text-sm">
                                            Không tìm thấy vendor nào trong trạng thái này.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">1</span> đến{" "}
                    <span className="font-medium">{vendors.length}</span> của{" "}
                    <span className="font-medium">{vendors.length}</span> kết quả
                </p>
            </div>
        </>
    );
}