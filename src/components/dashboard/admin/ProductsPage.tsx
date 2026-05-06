"use client";

import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Eye, Loader2, PackageOpen } from "lucide-react";
import { getPendingProductReviews } from "@/lib/api/admin-product-reviews";
import type { AdminProductReview } from "@/types/admin-product-review";
import { useProductReviewModalStore } from "@/stores/useProductReviewModalStore";
import ProductReviewDetailModal from "@/components/dashboard/admin/ProductReviewDetailModal";

function formatPrice(value: number) {
    return `${new Intl.NumberFormat("vi-VN").format(Number(value ?? 0))} vnđ`;
}

export default function ProductsPage() {
    const openReviewModal = useProductReviewModalStore((state) => state.open);
    const [products, setProducts] = useState<AdminProductReview[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProducts = async () => {
        setIsLoading(true);
        setError("");

        try {
            setProducts(await getPendingProductReviews());
        } catch (err: any) {
            setError(err.message || "Không thể tải sản phẩm chờ duyệt.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-[22px] font-bold text-[#222222]">
                        Kiểm duyệt sản phẩm
                    </h2>
                    <p className="text-[14px] text-[#565959]">
                        Duyệt các sản phẩm vendor gửi lên trước khi hiển thị ở marketplace.
                    </p>
                </div>

                <div className="inline-flex items-center gap-2 rounded-[6px] border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-bold text-[#222222]">
                    <CheckCircle className="h-4 w-4 text-[#007185]" />
                    {products.length} sản phẩm chờ duyệt
                </div>
            </div>

            {error ? (
                <div className="rounded-[8px] border border-red-100 bg-white p-8 text-center">
                    <AlertCircle className="mx-auto mb-3 h-10 w-10 text-[#C62828]" />
                    <div className="mb-3 text-[15px] font-bold text-[#222222]">Không thể tải dữ liệu</div>
                    <p className="mb-4 text-[14px] text-[#565959]">{error}</p>
                    <button
                        type="button"
                        onClick={loadProducts}
                        className="rounded-[4px] border border-[#D5D9D9] px-4 py-2 text-[14px] font-bold hover:bg-[#F7F7F7]"
                    >
                        Thử lại
                    </button>
                </div>
            ) : isLoading ? (
                <div className="rounded-[8px] border border-[#E6E6E6] bg-white p-10 text-center text-[14px] text-[#565959]">
                    <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                    Đang tải sản phẩm chờ duyệt...
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-[8px] border border-[#E6E6E6] bg-white p-12 text-center">
                    <PackageOpen className="mx-auto mb-4 h-14 w-14 text-[#D5D9D9]" />
                    <h3 className="mb-2 text-[18px] font-bold text-[#222222]">
                        Không có sản phẩm chờ duyệt
                    </h3>
                    <p className="text-[14px] text-[#565959]">
                        Khi vendor bấm “Gửi duyệt”, sản phẩm sẽ xuất hiện tại đây.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-[8px] border border-[#E6E6E6] bg-white shadow-sm">
                    <table className="w-full text-left text-[13px]">
                        <thead className="border-b border-[#E6E6E6] bg-[#F7F7F7] text-[#565959]">
                            <tr>
                                <th className="p-4 font-semibold">Sản phẩm</th>
                                <th className="p-4 font-semibold">Shop</th>
                                <th className="p-4 font-semibold">Danh mục</th>
                                <th className="p-4 font-semibold text-right">Giá từ</th>
                                <th className="p-4 font-semibold text-center">Tồn kho</th>
                                <th className="p-4 font-semibold text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => {
                                const variants = product.product_variants ?? [];
                                const minPrice = variants.length
                                    ? Math.min(...variants.map((variant) => Number(variant.base_daily_rate ?? 0)))
                                    : 0;
                                const stock = variants.reduce(
                                    (sum, variant) => sum + Number(variant.total_stock ?? 0),
                                    0,
                                );
                                const image =
                                    product.product_images?.find((item) => item.is_primary)?.image_url ??
                                    product.product_images?.[0]?.image_url;

                                return (
                                    <tr
                                        key={product.product_id}
                                        className="border-b border-[#E6E6E6] hover:bg-[#F9FAFB]"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-14 w-14 overflow-hidden rounded-[4px] border border-[#E6E6E6] bg-[#F7F7F7]">
                                                    {image ? (
                                                        <img src={image} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : null}
                                                </div>
                                                <div>
                                                    <div className="line-clamp-1 font-bold text-[#222222]">
                                                        {product.name}
                                                    </div>
                                                    <div className="text-[12px] text-[#6B7280]">
                                                        {product.product_id.split("-")[0]}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-[#565959]">
                                            {product.shop_profiles?.shop_name ?? "Không rõ"}
                                        </td>
                                        <td className="p-4 text-[#565959]">
                                            {product.categories?.name ?? "Chưa có"}
                                        </td>
                                        <td className="p-4 text-right font-bold text-[#222222]">
                                            {formatPrice(minPrice)}
                                        </td>
                                        <td className="p-4 text-center font-bold text-[#007185]">{stock}</td>
                                        <td className="p-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => openReviewModal(product)}
                                                className="inline-flex items-center gap-2 rounded-[4px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] font-bold text-[#007185] hover:bg-[#F7F7F7]"
                                            >
                                                <Eye className="h-4 w-4" />
                                                Xem duyệt
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <ProductReviewDetailModal onReviewed={loadProducts} />
        </div>
    );
}
