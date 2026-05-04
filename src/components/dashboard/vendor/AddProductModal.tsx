"use client";

import { useRef, useState } from "react";
import { Loader2, Plus, Trash2, Upload, X } from "lucide-react";
import { createVendorProduct } from "@/lib/api/vendor";
import { uploadProductImage } from "@/lib/api/productImages";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";

type AddProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

type VariantForm = {
    size: string;
    sku: string;
    basePrice: string;
    deposit: string;
    stock: string;
    condition: "NEW" | "GOOD" | "FAIR" | "DAMAGED";
};

const createEmptyVariant = (index: number): VariantForm => ({
    size: index === 0 ? "Mặc định" : "",
    sku: "",
    basePrice: "",
    deposit: "",
    stock: "1",
    condition: "NEW",
});

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    const { user } = useAuthStore();
    const { show: showToast } = useToastStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("DRAFT");
    const [images, setImages] = useState<{ url: string; file?: File; isPrimary: boolean }[]>([]);
    const [variants, setVariants] = useState<VariantForm[]>([createEmptyVariant(0)]);

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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const tempUrl = URL.createObjectURL(file);
            setImages((prev) => [
                ...prev,
                { url: tempUrl, file, isPrimary: prev.length === 0 },
            ]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, imageIndex) => imageIndex !== index));
    };

    const updateVariant = <K extends keyof VariantForm>(
        index: number,
        field: K,
        value: VariantForm[K],
    ) => {
        setVariants((prev) =>
            prev.map((variant, variantIndex) =>
                variantIndex === index ? { ...variant, [field]: value } : variant,
            ),
        );
    };

    const addVariant = () => {
        setVariants((prev) => [...prev, createEmptyVariant(prev.length)]);
    };

    const removeVariant = (index: number) => {
        setVariants((prev) => prev.filter((_, variantIndex) => variantIndex !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const hasInvalidVariant = variants.some(
            (variant) =>
                !variant.size.trim() ||
                !variant.sku.trim() ||
                !variant.basePrice ||
                !variant.stock ||
                Number(variant.stock) < 1,
        );

        if (!name.trim() || variants.length === 0 || hasInvalidVariant) {
            showToast("Vui lòng điền đầy đủ thông tin sản phẩm và size.", "error");
            return;
        }

        const uniqueSkus = new Set(variants.map((variant) => variant.sku.trim()));
        if (uniqueSkus.size !== variants.length) {
            showToast("Mỗi size cần có mã SKU riêng.", "error");
            return;
        }

        if (!user) {
            showToast("Bạn cần đăng nhập để thực hiện", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            setIsUploading(true);
            const uploadedImages = [];
            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                if (img.file) {
                    const url = await uploadProductImage(user.id, img.file);
                    uploadedImages.push({
                        image_url: url,
                        sort_order: i,
                        is_primary: img.isPrimary,
                    });
                }
            }
            setIsUploading(false);

            const payload = {
                name,
                slug: `${generateSlug(name)}-${Math.random().toString(36).substring(2, 6)}`,
                description: description || undefined,
                category_id: category || undefined,
                status,
                images: uploadedImages,
                variants: variants.map((variant) => ({
                    sku: variant.sku.trim(),
                    variant_name: variant.size.trim(),
                    base_daily_rate: Number(variant.basePrice),
                    deposit_requirement: Number(variant.deposit) || 0,
                    condition: variant.condition,
                    total_stock: Number(variant.stock),
                })),
            };

            await createVendorProduct(payload);

            showToast("Tạo sản phẩm thành công", "success");
            onSuccess();
            onClose();
        } catch (error: any) {
            setIsUploading(false);
            showToast(error.message || "Tạo sản phẩm thất bại", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white rounded-[6px] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E6E6]">
                    <h2 className="text-[18px] font-bold text-[#222222]">Thêm sản phẩm mới</h2>
                    <button
                        type="button"
                        onClick={onClose}
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
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                        placeholder="Ví dụ: Váy dạ hội satin"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                        Trạng thái
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as "DRAFT" | "ACTIVE")}
                                        className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                    >
                                        <option value="DRAFT">Bản nháp</option>
                                        <option value="ACTIVE">Đăng ngay</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                    Mô tả sản phẩm
                                </label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
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
                                        <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
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

                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-24 h-24 rounded-[4px] border-2 border-dashed border-[#D5D9D9] flex flex-col items-center justify-center text-[#565959] hover:bg-[#F7F7F7] hover:border-[#FF9900] hover:text-[#FF9900] transition-colors flex-shrink-0"
                                >
                                    <Upload className="w-6 h-6 mb-1" />
                                    <span className="text-[11px] font-medium">Tải ảnh lên</span>
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/jpeg, image/png, image/webp"
                                    className="hidden"
                                />
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
                                                    onChange={(e) => updateVariant(index, "condition", e.target.value as VariantForm["condition"])}
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
                                                    Tiền cọc (VNĐ)
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={variant.deposit}
                                                    onChange={(e) => updateVariant(index, "deposit", e.target.value)}
                                                    className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                                    placeholder="Ví dụ: 500000"
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
                        onClick={onClose}
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
