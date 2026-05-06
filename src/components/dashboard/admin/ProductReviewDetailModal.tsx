"use client";

import { useState } from "react";
import { CheckCircle, Loader2, X, XCircle } from "lucide-react";
import {
    approveProductReview,
    rejectProductReview,
} from "@/lib/api/admin-product-reviews";
import { useProductReviewModalStore } from "@/stores/useProductReviewModalStore";
import { useToastStore } from "@/stores/useToastStore";

type ProductReviewDetailModalProps = {
    onReviewed: () => void;
};

function formatPrice(value: number) {
    return `${new Intl.NumberFormat("vi-VN").format(Number(value ?? 0))} vnđ`;
}

export default function ProductReviewDetailModal({ onReviewed }: ProductReviewDetailModalProps) {
    const { product, isOpen, close } = useProductReviewModalStore();
    const { show: showToast } = useToastStore();
    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen || !product) return null;

    const images = [...(product.product_images ?? [])].sort(
        (a, b) => a.sort_order - b.sort_order,
    );
    const primaryImage =
        images.find((image) => image.is_primary)?.image_url ??
        images[0]?.image_url ??
        "https://placehold.co/500x650?text=No+Image";

    const totalStock = (product.product_variants ?? []).reduce(
        (sum, variant) => sum + Number(variant.total_stock ?? 0),
        0,
    );

    const handleApprove = async () => {
        setIsSubmitting(true);
        try {
            await approveProductReview(product.product_id);
            showToast("Đã duyệt sản phẩm.", "success");
            close();
            onReviewed();
        } catch (error: any) {
            showToast(error.message || "Không thể duyệt sản phẩm.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (reason.trim().length < 5) {
            showToast("Vui lòng nhập lý do từ chối rõ ràng.", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            await rejectProductReview(product.product_id, reason.trim());
            showToast("Đã từ chối sản phẩm.", "success");
            setReason("");
            close();
            onReviewed();
        } catch (error: any) {
            showToast(error.message || "Không thể từ chối sản phẩm.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4">
            <div className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[8px] bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#E6E6E6] px-6 py-4">
                    <div>
                        <h2 className="text-[18px] font-bold text-[#222222]">
                            Chi tiết sản phẩm chờ duyệt
                        </h2>
                        <p className="text-[13px] text-[#565959]">
                            Mã sản phẩm: {product.product_id.split("-")[0]}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={close}
                        className="rounded-[4px] p-2 text-[#565959] hover:bg-[#F7F7F7]"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="grid flex-1 gap-6 overflow-y-auto p-6 lg:grid-cols-[320px_1fr]">
                    <div className="space-y-4">
                        <div className="aspect-[4/5] overflow-hidden rounded-[6px] border border-[#E6E6E6] bg-[#F7F7F7]">
                            <img src={primaryImage} alt={product.name} className="h-full w-full object-cover" />
                        </div>
                        {images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {images.slice(0, 8).map((image) => (
                                    <img
                                        key={image.image_id}
                                        src={image.image_url}
                                        alt={product.name}
                                        className="aspect-square rounded-[4px] border border-[#E6E6E6] object-cover"
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h3 className="text-[22px] font-bold text-[#222222]">{product.name}</h3>
                            <div className="mt-2 grid gap-2 text-[14px] text-[#565959] md:grid-cols-2">
                                <div>Danh mục: <span className="font-bold text-[#222222]">{product.categories?.name ?? "Chưa có"}</span></div>
                                <div>Shop: <span className="font-bold text-[#222222]">{product.shop_profiles?.shop_name ?? "Không rõ"}</span></div>
                                <div>Tồn kho tổng: <span className="font-bold text-[#222222]">{totalStock}</span></div>
                                <div>Trạng thái: <span className="font-bold text-[#C05621]">Chờ duyệt</span></div>
                            </div>
                        </section>

                        <section>
                            <h4 className="mb-2 text-[14px] font-bold text-[#222222]">Mô tả</h4>
                            <p className="whitespace-pre-line rounded-[6px] border border-[#E6E6E6] bg-[#FAFAFA] p-4 text-[14px] leading-6 text-[#222222]">
                                {product.description || "Vendor chưa nhập mô tả sản phẩm."}
                            </p>
                        </section>

                        <section>
                            <h4 className="mb-2 text-[14px] font-bold text-[#222222]">Biến thể sản phẩm</h4>
                            <div className="overflow-hidden rounded-[6px] border border-[#E6E6E6]">
                                <table className="w-full text-left text-[13px]">
                                    <thead className="bg-[#F7F7F7] text-[#565959]">
                                        <tr>
                                            <th className="p-3 font-semibold">SKU</th>
                                            <th className="p-3 font-semibold">Biến thể</th>
                                            <th className="p-3 font-semibold text-right">Giá/ngày</th>
                                            <th className="p-3 font-semibold text-right">Tiền cọc</th>
                                            <th className="p-3 font-semibold text-center">Tồn kho</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(product.product_variants ?? []).map((variant) => (
                                            <tr key={variant.variant_id} className="border-t border-[#E6E6E6]">
                                                <td className="p-3">{variant.sku}</td>
                                                <td className="p-3">{variant.variant_name}</td>
                                                <td className="p-3 text-right font-bold">{formatPrice(variant.base_daily_rate)}</td>
                                                <td className="p-3 text-right">{formatPrice(variant.deposit_requirement)}</td>
                                                <td className="p-3 text-center">{variant.total_stock}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <label className="mb-2 block text-[14px] font-bold text-[#222222]">
                                Lý do từ chối <span className="text-[#C62828]">*</span>
                            </label>
                            <textarea
                                rows={3}
                                value={reason}
                                onChange={(event) => setReason(event.target.value)}
                                className="w-full rounded-[4px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                placeholder="Nhập lý do nếu từ chối sản phẩm..."
                            />
                        </section>
                    </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-[#E6E6E6] bg-[#F7F7F7] px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={handleReject}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#C62828] bg-white px-5 py-2.5 text-[14px] font-bold text-[#C62828] hover:bg-[#FCF4F4] disabled:opacity-60"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        Từ chối
                    </button>
                    <button
                        type="button"
                        onClick={handleApprove}
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-green-700 bg-green-700 px-5 py-2.5 text-[14px] font-bold text-white hover:bg-green-800 disabled:opacity-60"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Duyệt sản phẩm
                    </button>
                </div>
            </div>
        </div>
    );
}
