"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { getPublicCategories } from "@/lib/api/categories";
import type { ProductCategory } from "@/lib/api/categories";
import { createVendorProduct } from "@/lib/api/vendor";
import { uploadProductImage } from "@/lib/api/productImages";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { useVendorProductFormStore } from "@/stores/vendorProductFormStore";
import type { VendorProductVariantForm } from "@/stores/vendorProductFormStore";

type AddProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    const { user } = useAuthStore();
    const { show: showToast } = useToastStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const {
        formData,
        images,
        setField,
        updateVariant,
        addVariant,
        removeVariant,
        addImageFile,
        markImageUploading,
        markImageUploaded,
        markImageError,
        removeImage,
        resetForm,
    } = useVendorProductFormStore();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [categoryError, setCategoryError] = useState("");
    const { name, description, categoryId, variants } = formData;

    useEffect(() => {
        if (!isOpen) return;

        let isMounted = true;
        setIsLoadingCategories(true);
        setCategoryError("");

        getPublicCategories()
            .then((data) => {
                if (isMounted) {
                    setCategories(data);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    setCategoryError(error.message || "Không thể tải danh mục.");
                }
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoadingCategories(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const generateSlug = (str: string) => {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/([^0-9a-z-\s])/g, "")
            .replace(/(\s+)/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-+|-+$/g, "");
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        if (!user) {
            showToast("Bạn cần đăng nhập để tải ảnh sản phẩm.", "error");
            return;
        }

        addImageFile(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const latestState = useVendorProductFormStore.getState();
        const latestFormData = latestState.formData;
        const latestImages = latestState.images;
        const latestName = latestFormData.name;
        const latestDescription = latestFormData.description;
        const latestCategoryId = latestFormData.categoryId;
        const latestVariants = latestFormData.variants;

        const hasInvalidVariant = latestVariants.some(
            (variant) =>
                !variant.size.trim() ||
                !variant.sku.trim() ||
                !variant.basePrice ||
                !variant.stock ||
                Number(variant.stock) < 1,
        );

        if (!latestName.trim() || !latestCategoryId || latestVariants.length === 0 || hasInvalidVariant) {
            showToast("Vui lòng điền đầy đủ thông tin sản phẩm, danh mục và size.", "error");
            return;
        }

        const uniqueSkus = new Set(latestVariants.map((variant) => variant.sku.trim()));
        if (uniqueSkus.size !== latestVariants.length) {
            showToast("Mỗi size cần có mã SKU riêng.", "error");
            return;
        }

        if (!user) {
            showToast("Bạn cần đăng nhập để thực hiện", "error");
            return;
        }

        if (latestImages.length === 0) {
            showToast("Vui lòng tải lên ít nhất một ảnh sản phẩm.", "error");
            return;
        }

        if (latestImages.some((image) => image.error)) {
            showToast("Có ảnh tải lên thất bại. Vui lòng xóa ảnh lỗi hoặc tải lại.", "error");
            return;
        }

        setIsSubmitting(true);
        setIsUploading(true);
        try {
            const uploadedImages = [];

            for (let index = 0; index < latestImages.length; index += 1) {
                const image = latestImages[index];
                let imageUrl = image.uploadedUrl;

                if (!imageUrl) {
                    const file = latestState.imageFiles[index];
                    if (!file) {
                        throw new Error("Không tìm thấy file ảnh. Vui lòng xóa ảnh này và chọn lại.");
                    }

                    markImageUploading(image.id);
                    try {
                        imageUrl = await uploadProductImage(user.id, file);
                        markImageUploaded(image.id, imageUrl);
                    } catch (error: any) {
                        markImageError(image.id, error.message || "Tải ảnh thất bại.");
                        throw error;
                    }
                }

                uploadedImages.push({
                    image_url: imageUrl,
                    sort_order: index,
                    is_primary: image.isPrimary,
                });
            }

            const payload = {
                name: latestName,
                slug: `${generateSlug(latestName)}-${Math.random().toString(36).substring(2, 6)}`,
                description: latestDescription || undefined,
                category_id: latestCategoryId,
                images: uploadedImages,
                variants: latestVariants.map((variant) => ({
                    sku: variant.sku.trim(),
                    variant_name: variant.size.trim(),
                    base_daily_rate: Number(variant.basePrice),
                    deposit_requirement: 0,
                    condition: variant.condition,
                    total_stock: Number(variant.stock),
                })),
            };

            await createVendorProduct(payload);

            showToast("Tạo sản phẩm thành công", "success");
            resetForm();
            onSuccess();
            onClose();
        } catch (error: any) {
            showToast(error.message || "Tạo sản phẩm thất bại", "error");
        } finally {
            setIsUploading(false);
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white rounded-[6px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E6E6]">
                    <h2 className="text-[18px] font-bold text-[#222222]">Thêm sản phẩm mới</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 text-[#565959] hover:bg-[#F7F7F7] rounded-[4px] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <form id="add-product-form" onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-bold text-[#222222] border-b border-[#E6E6E6] pb-2">
                                Thông tin cơ bản
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                        Tên sản phẩm <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setField("name", e.target.value)}
                                        className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                        placeholder="Ví dụ: Váy dạ hội satin"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                        Danh mục <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={categoryId}
                                        onChange={(e) => setField("categoryId", e.target.value)}
                                        disabled={isLoadingCategories}
                                        className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] disabled:bg-[#F7F7F7]"
                                    >
                                        <option value="">
                                            {isLoadingCategories ? "Đang tải danh mục..." : "Chọn danh mục"}
                                        </option>
                                        {categories.map((item) => (
                                            <option key={item.category_id} value={item.category_id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                    {categoryError && (
                                        <p className="mt-1 text-[12px] text-[#C62828]">{categoryError}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                    Mô tả sản phẩm
                                </label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setField("description", e.target.value)}
                                    className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[15px] font-bold text-[#222222] border-b border-[#E6E6E6] pb-2">
                                Hình ảnh sản phẩm
                            </h3>

                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <div key={index} className="relative w-24 h-24 rounded-[4px] border border-[#E6E6E6] overflow-hidden flex-shrink-0 group">
                                        <img src={img.previewUrl} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        {img.isUploading && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/75 text-[#222222]">
                                                <Loader2 className="mb-1 h-5 w-5 animate-spin" />
                                                <span className="text-[10px] font-bold">Đang tải</span>
                                            </div>
                                        )}
                                        {img.error && !img.isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-[#FCF4F4]/90 px-2 text-center text-[10px] font-bold text-[#C62828]">
                                                Tải lỗi
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-[4px] text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        {img.isPrimary && (
                                            <span className="absolute bottom-0 left-0 right-0 bg-[#FF9900] text-white text-[10px] font-bold text-center py-0.5">
                                                Ảnh bìa
                                            </span>
                                        )}
                                    </div>
                                ))}

                                <label
                                    className={`w-24 h-24 rounded-[4px] border-2 border-dashed border-[#D5D9D9] flex flex-col items-center justify-center text-[#565959] hover:bg-[#F7F7F7] hover:border-[#FF9900] hover:text-[#FF9900] transition-colors flex-shrink-0 ${
                                        isUploading ? "pointer-events-none opacity-60" : "cursor-pointer"
                                    }`}
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-6 h-6 mb-1 animate-spin" />
                                    ) : (
                                        <Upload className="w-6 h-6 mb-1" />
                                    )}
                                    <span className="text-[11px] font-medium">Tải ảnh lên</span>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/jpeg, image/png, image/webp"
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-2">
                                <h3 className="text-[15px] font-bold text-[#222222]">
                                    Size, giá & tồn kho
                                </h3>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#D5D9D9] bg-white px-3 py-1.5 text-[13px] font-bold text-[#222222] transition-colors hover:bg-[#F7F7F7]"
                                >
                                    <Plus className="w-4 h-4" />
                                    Thêm size
                                </button>
                            </div>

                            <div className="space-y-4">
                                {variants.map((variant, index) => (
                                    <div key={index} className="rounded-[6px] border border-[#E6E6E6] bg-[#FAFAFA] p-4">
                                        <div className="mb-4 flex items-center justify-between">
                                            <div className="text-[14px] font-bold text-[#222222]">
                                                Size #{index + 1}
                                            </div>
                                            {variants.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeVariant(index)}
                                                    className="inline-flex items-center gap-1 text-[13px] font-medium text-[#C62828] hover:underline"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    Xóa size
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                                    Size <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={variant.size}
                                                    onChange={(e) => updateVariant(index, "size", e.target.value)}
                                                    className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                                    placeholder="S, M, L, XL, One Size..."
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                                    Mã SKU <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={variant.sku}
                                                    onChange={(e) => updateVariant(index, "sku", e.target.value)}
                                                    className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                                    placeholder="Ví dụ: DRESS-S-01"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                                    Tình trạng
                                                </label>
                                                <select
                                                    value={variant.condition}
                                                    onChange={(e) => updateVariant(index, "condition", e.target.value as VendorProductVariantForm["condition"])}
                                                    className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                                >
                                                    <option value="NEW">Mới 100%</option>
                                                    <option value="GOOD">Rất tốt</option>
                                                    <option value="FAIR">Bình thường</option>
                                                    <option value="DAMAGED">Có trầy xước/cũ</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                                    Giá thuê / Ngày (VNĐ) <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="0"
                                                    value={variant.basePrice}
                                                    onChange={(e) => updateVariant(index, "basePrice", e.target.value)}
                                                    className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                                    placeholder="Ví dụ: 150000"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                                    Số lượng tồn kho <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    required
                                                    min="1"
                                                    value={variant.stock}
                                                    onChange={(e) => updateVariant(index, "stock", e.target.value)}
                                                    className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </form>
                </div>

                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E6E6E6] bg-[#F7F7F7]">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-[4px] text-[14px] font-bold text-[#222222] border border-[#D5D9D9] bg-white hover:bg-[#F7F7F7] disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        form="add-product-form"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-[4px] text-[14px] font-bold text-[#111111] bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] flex items-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {isUploading ? "Đang tải ảnh..." : "Đang lưu..."}
                            </>
                        ) : (
                            "Thêm sản phẩm"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
