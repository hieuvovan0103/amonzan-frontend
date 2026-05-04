"use client";

import { useState, useRef } from "react";
import { X, Upload, Plus, Trash2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { createVendorProduct } from "@/lib/api/vendor";
import { uploadProductImage } from "@/lib/api/productImages";

type AddProductModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

export default function AddProductModal({ isOpen, onClose, onSuccess }: AddProductModalProps) {
    const { user } = useAuthStore();
    const { show: showToast } = useToastStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState<"DRAFT" | "ACTIVE">("DRAFT");
    
    // Images
    const [images, setImages] = useState<{ url: string; file?: File; isPrimary: boolean }[]>([]);

    // Variant
    const [sku, setSku] = useState("");
    const [basePrice, setBasePrice] = useState("");
    const [deposit, setDeposit] = useState("");
    const [stock, setStock] = useState("1");
    const [condition, setCondition] = useState<"NEW" | "GOOD" | "FAIR" | "DAMAGED">("NEW");

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
            setImages(prev => [
                ...prev,
                { url: tempUrl, file, isPrimary: prev.length === 0 }
            ]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || !sku || !basePrice || !stock) {
            showToast("Vui lòng điền đầy đủ các thông tin bắt buộc", "error");
            return;
        }

        if (!user) {
            showToast("Bạn cần đăng nhập để thực hiện", "error");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Upload images
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

            // 2. Create product payload
            const payload = {
                name,
                slug: generateSlug(name) + "-" + Math.random().toString(36).substring(2, 6),
                description: description || undefined,
                category_id: category || undefined,
                status,
                images: uploadedImages,
                variants: [
                    {
                        sku,
                        variant_name: "Mặc định",
                        base_daily_rate: Number(basePrice),
                        deposit_requirement: Number(deposit) || 0,
                        condition,
                        total_stock: Number(stock),
                    }
                ]
            };

            // 3. Call API
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
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E6E6]">
                    <h2 className="text-[18px] font-bold text-[#222222]">Thêm sản phẩm mới</h2>
                    <button 
                        onClick={onClose}
                        className="p-2 text-[#565959] hover:bg-[#F7F7F7] rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form id="add-product-form" onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Section 1: Thông tin cơ bản */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-bold text-[#222222] border-b border-[#E6E6E6] pb-2">Thông tin cơ bản</h3>
                            
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
                                        className="w-full border border-[#D5D9D9] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                        placeholder="Ví dụ: Lều cắm trại Naturehike"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[13px] font-bold text-[#222222] mb-1">Trạng thái</label>
                                    <select 
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as any)}
                                        className="w-full border border-[#D5D9D9] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                    >
                                        <option value="DRAFT">Bản nháp</option>
                                        <option value="ACTIVE">Đăng ngay</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-[#222222] mb-1">Mô tả sản phẩm</label>
                                <textarea 
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border border-[#D5D9D9] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                    placeholder="Nhập mô tả chi tiết về sản phẩm..."
                                />
                            </div>
                        </div>

                        {/* Section 2: Hình ảnh */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-bold text-[#222222] border-b border-[#E6E6E6] pb-2">Hình ảnh sản phẩm</h3>
                            
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <div key={index} className="relative w-24 h-24 rounded-lg border border-[#E6E6E6] overflow-hidden flex-shrink-0 group">
                                        <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-white/80 p-1 rounded-md text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
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
                                    className="w-24 h-24 rounded-lg border-2 border-dashed border-[#D5D9D9] flex flex-col items-center justify-center text-[#565959] hover:bg-[#F7F7F7] hover:border-[#FF9900] hover:text-[#FF9900] transition-colors flex-shrink-0"
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

                        {/* Section 3: Cho thuê & Tồn kho */}
                        <div className="space-y-4">
                            <h3 className="text-[15px] font-bold text-[#222222] border-b border-[#E6E6E6] pb-2">Giá & Tồn kho</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                        Mã SKU <span className="text-red-500">*</span>
                                    </label>
                                    <input 
                                        type="text" 
                                        required
                                        value={sku}
                                        onChange={(e) => setSku(e.target.value)}
                                        className="w-full border border-[#D5D9D9] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                        placeholder="Ví dụ: TENT-NH-01"
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-[13px] font-bold text-[#222222] mb-1">Tình trạng</label>
                                    <select 
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value as any)}
                                        className="w-full border border-[#D5D9D9] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                    >
                                        <option value="NEW">Mới 100%</option>
                                        <option value="GOOD">Rất tốt (Ít sử dụng)</option>
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
                                        value={basePrice}
                                        onChange={(e) => setBasePrice(e.target.value)}
                                        className="w-full border border-[#D5D9D9] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
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
                                        value={deposit}
                                        onChange={(e) => setDeposit(e.target.value)}
                                        className="w-full border border-[#D5D9D9] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
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
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        className="w-full border border-[#D5D9D9] rounded-lg px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                    />
                                </div>
                            </div>
                        </div>

                    </form>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#E6E6E6] bg-[#F7F7F7]">
                    <button 
                        type="button" 
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-lg text-[14px] font-bold text-[#222222] border border-[#D5D9D9] bg-white hover:bg-[#F7F7F7] disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button 
                        type="submit" 
                        form="add-product-form"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-lg text-[14px] font-bold text-[#111111] bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] flex items-center gap-2 disabled:opacity-70"
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
