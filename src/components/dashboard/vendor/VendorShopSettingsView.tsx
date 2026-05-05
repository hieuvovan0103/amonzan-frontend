"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
    Camera,
    Check,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Save,
    Store,
    X,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToastStore } from "@/stores/useToastStore";
import {
    getMyShop,
    updateMyShop,
    type ShopProfileData,
} from "@/lib/api/vendor";

const LOGO_BUCKET = "shop-logos";
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type FieldKey =
    | "shop_name"
    | "description"
    | "contact_phone"
    | "contact_email"
    | "province"
    | "district"
    | "address_detail";

const FIELD_LABELS: Record<FieldKey, string> = {
    shop_name: "Tên cửa hàng",
    description: "Mô tả / Chính sách",
    contact_phone: "Số điện thoại",
    contact_email: "Email liên hệ",
    province: "Tỉnh / Thành phố",
    district: "Quận / Huyện",
    address_detail: "Địa chỉ chi tiết",
};

function getInitials(name: string) {
    return (name || "S")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
        .toUpperCase() || "S";
}

export default function VendorShopSettingsView() {
    const showToast = useToastStore((s) => s.show);

    const [shop, setShop] = useState<ShopProfileData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState<Record<FieldKey, string>>({
        shop_name: "",
        description: "",
        contact_phone: "",
        contact_email: "",
        province: "",
        district: "",
        address_detail: "",
    });
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Logo
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadShop = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getMyShop();
            setShop(data);
            setForm({
                shop_name: data.shop_name || "",
                description: data.description || "",
                contact_phone: data.contact_phone || "",
                contact_email: data.contact_email || "",
                province: data.province || "",
                district: data.district || "",
                address_detail: data.address_detail || "",
            });
            setLogoPreview(data.logo_url || null);
        } catch (err: any) {
            setError(err.message || "Không thể tải thông tin cửa hàng.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadShop();
    }, [loadShop]);

    // Track changes
    useEffect(() => {
        if (!shop) return;
        const changed =
            form.shop_name !== (shop.shop_name || "") ||
            form.description !== (shop.description || "") ||
            form.contact_phone !== (shop.contact_phone || "") ||
            form.contact_email !== (shop.contact_email || "") ||
            form.province !== (shop.province || "") ||
            form.district !== (shop.district || "") ||
            form.address_detail !== (shop.address_detail || "");
        setHasChanges(changed);
    }, [form, shop]);

    const handleFieldChange = (key: FieldKey, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        if (!shop || !hasChanges) return;
        setIsSaving(true);
        try {
            const payload: Record<string, string> = {};
            if (form.shop_name !== (shop.shop_name || "")) payload.shopName = form.shop_name;
            if (form.description !== (shop.description || "")) payload.description = form.description;
            if (form.contact_phone !== (shop.contact_phone || "")) payload.contactPhone = form.contact_phone;
            if (form.contact_email !== (shop.contact_email || "")) payload.contactEmail = form.contact_email;
            if (form.province !== (shop.province || "")) payload.province = form.province;
            if (form.district !== (shop.district || "")) payload.district = form.district;
            if (form.address_detail !== (shop.address_detail || "")) payload.addressDetail = form.address_detail;

            const updated = await updateMyShop(payload);
            setShop(updated);
            setHasChanges(false);
            showToast("Cập nhật thông tin cửa hàng thành công!", "success");
        } catch (err: any) {
            showToast(err.message || "Cập nhật thất bại.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !shop) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            showToast("Chỉ chấp nhận file JPG, PNG hoặc WebP.", "error");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            showToast("File quá lớn. Tối đa 5MB.", "error");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setLogoPreview(objectUrl);
        setIsUploadingLogo(true);

        try {
            const ext = file.name.split(".").pop() ?? "jpg";
            const storagePath = `${shop.shop_id}/logo.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from(LOGO_BUCKET)
                .upload(storagePath, file, { upsert: true, contentType: file.type });

            if (uploadError) throw new Error(uploadError.message);

            const {
                data: { publicUrl },
            } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(storagePath);

            const urlWithBuster = `${publicUrl}?t=${Date.now()}`;

            const updated = await updateMyShop({ logoUrl: urlWithBuster });
            setShop(updated);
            setLogoPreview(urlWithBuster);
            showToast("Cập nhật logo cửa hàng thành công!", "success");
        } catch (err: any) {
            setLogoPreview(shop.logo_url || null);
            showToast(err.message || "Upload logo thất bại.", "error");
        } finally {
            setIsUploadingLogo(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // ─── Loading / Error ──────────────────────────────────
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-6 w-6 animate-spin text-[#007185]" />
                <span className="ml-2 text-[14px] text-[#565959]">Đang tải thông tin cửa hàng...</span>
            </div>
        );
    }

    if (error || !shop) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <p className="text-[14px] text-[#C62828]">{error || "Không tìm thấy cửa hàng."}</p>
                <button
                    onClick={loadShop}
                    className="mt-3 rounded-lg bg-[#C62828] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#B71C1C]"
                >
                    Thử lại
                </button>
            </div>
        );
    }

    const verificationColor =
        shop.verification_status === "VERIFIED"
            ? "text-[#007600] bg-[#E6F4EA] border-[#007600]/20"
            : shop.verification_status === "REJECTED"
                ? "text-[#C62828] bg-red-50 border-red-200"
                : "text-[#B8860B] bg-[#FFF8E1] border-[#B8860B]/20";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[20px] font-bold text-[#222222]">Cài đặt cửa hàng</h1>
                    <p className="mt-0.5 text-[13px] text-[#565959]">
                        Quản lý thông tin và hình ảnh cửa hàng của bạn
                    </p>
                </div>
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold ${verificationColor}`}
                >
                    {shop.verification_status === "VERIFIED" && <Check className="h-3 w-3" />}
                    {shop.verification_status === "VERIFIED"
                        ? "Đã xác minh"
                        : shop.verification_status === "REJECTED"
                            ? "Bị từ chối"
                            : "Chờ xác minh"}
                </span>
            </div>

            {/* Logo / Avatar Section */}
            <div className="rounded-xl border border-[#E0E4E8] bg-white p-6">
                <h2 className="mb-4 text-[16px] font-bold text-[#222222]">Logo cửa hàng</h2>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        {logoPreview ? (
                            <img
                                src={logoPreview}
                                alt={shop.shop_name}
                                className="h-[100px] w-[100px] rounded-xl object-cover border-2 border-[#E0E4E8] shadow-sm"
                            />
                        ) : (
                            <div className="flex h-[100px] w-[100px] items-center justify-center rounded-xl border-2 border-dashed border-[#D5D9D9] bg-[#F7F7F7] text-[28px] font-bold text-[#565959]">
                                {getInitials(shop.shop_name)}
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingLogo}
                            className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            {isUploadingLogo ? (
                                <Loader2 className="h-6 w-6 animate-spin text-white" />
                            ) : (
                                <Camera className="h-6 w-6 text-white" />
                            )}
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={handleLogoUpload}
                        />
                    </div>

                    <div className="text-[13px] text-[#565959] space-y-1">
                        <p>
                            Nhấp vào ảnh để thay đổi logo.
                        </p>
                        <p>JPG, PNG hoặc WebP. Tối đa 5MB.</p>
                        <p className="text-[12px] text-[#9B9B9B]">
                            Khuyến nghị: ảnh vuông, tối thiểu 200×200px.
                        </p>
                    </div>
                </div>
            </div>

            {/* Info Form */}
            <div className="rounded-xl border border-[#E0E4E8] bg-white p-6">
                <h2 className="mb-5 text-[16px] font-bold text-[#222222]">Thông tin cửa hàng</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Shop Name — full width */}
                    <div className="md:col-span-2">
                        <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#222222]">
                            <Store className="h-3.5 w-3.5 text-[#007185]" />
                            {FIELD_LABELS.shop_name}
                        </label>
                        <input
                            type="text"
                            value={form.shop_name}
                            onChange={(e) => handleFieldChange("shop_name", e.target.value)}
                            className="w-full rounded-lg border border-[#D5D9D9] px-3 py-2.5 text-[14px] text-[#222222] outline-none transition-all focus:border-[#007185] focus:ring-2 focus:ring-[#007185]/10"
                            placeholder="Tên cửa hàng"
                        />
                    </div>

                    {/* Contact Phone */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#222222]">
                            <Phone className="h-3.5 w-3.5 text-[#007185]" />
                            {FIELD_LABELS.contact_phone}
                        </label>
                        <input
                            type="text"
                            value={form.contact_phone}
                            onChange={(e) => handleFieldChange("contact_phone", e.target.value)}
                            className="w-full rounded-lg border border-[#D5D9D9] px-3 py-2.5 text-[14px] text-[#222222] outline-none transition-all focus:border-[#007185] focus:ring-2 focus:ring-[#007185]/10"
                            placeholder="0912 345 678"
                        />
                    </div>

                    {/* Contact Email */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#222222]">
                            <Mail className="h-3.5 w-3.5 text-[#007185]" />
                            {FIELD_LABELS.contact_email}
                        </label>
                        <input
                            type="email"
                            value={form.contact_email}
                            onChange={(e) => handleFieldChange("contact_email", e.target.value)}
                            className="w-full rounded-lg border border-[#D5D9D9] px-3 py-2.5 text-[14px] text-[#222222] outline-none transition-all focus:border-[#007185] focus:ring-2 focus:ring-[#007185]/10"
                            placeholder="shop@email.com"
                        />
                    </div>

                    {/* Province */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#222222]">
                            <MapPin className="h-3.5 w-3.5 text-[#007185]" />
                            {FIELD_LABELS.province}
                        </label>
                        <input
                            type="text"
                            value={form.province}
                            onChange={(e) => handleFieldChange("province", e.target.value)}
                            className="w-full rounded-lg border border-[#D5D9D9] px-3 py-2.5 text-[14px] text-[#222222] outline-none transition-all focus:border-[#007185] focus:ring-2 focus:ring-[#007185]/10"
                            placeholder="Ví dụ: Phú Yên"
                        />
                    </div>

                    {/* District */}
                    <div>
                        <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#222222]">
                            <MapPin className="h-3.5 w-3.5 text-[#007185]" />
                            {FIELD_LABELS.district}
                        </label>
                        <input
                            type="text"
                            value={form.district}
                            onChange={(e) => handleFieldChange("district", e.target.value)}
                            className="w-full rounded-lg border border-[#D5D9D9] px-3 py-2.5 text-[14px] text-[#222222] outline-none transition-all focus:border-[#007185] focus:ring-2 focus:ring-[#007185]/10"
                            placeholder="Ví dụ: Thành phố Tuy Hòa"
                        />
                    </div>

                    {/* Address Detail — full width */}
                    <div className="md:col-span-2">
                        <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-[#222222]">
                            <MapPin className="h-3.5 w-3.5 text-[#007185]" />
                            {FIELD_LABELS.address_detail}
                        </label>
                        <input
                            type="text"
                            value={form.address_detail}
                            onChange={(e) => handleFieldChange("address_detail", e.target.value)}
                            className="w-full rounded-lg border border-[#D5D9D9] px-3 py-2.5 text-[14px] text-[#222222] outline-none transition-all focus:border-[#007185] focus:ring-2 focus:ring-[#007185]/10"
                            placeholder="Số nhà, đường, phường/xã"
                        />
                    </div>

                    {/* Description — full width textarea */}
                    <div className="md:col-span-2">
                        <label className="mb-1.5 text-[13px] font-semibold text-[#222222]">
                            {FIELD_LABELS.description}
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) => handleFieldChange("description", e.target.value)}
                            rows={5}
                            className="w-full rounded-lg border border-[#D5D9D9] px-3 py-2.5 text-[14px] text-[#222222] outline-none transition-all focus:border-[#007185] focus:ring-2 focus:ring-[#007185]/10 resize-none"
                            placeholder="Mô tả cửa hàng, chính sách thuê, hoàn trả..."
                        />
                    </div>
                </div>

                {/* Save button */}
                <div className="mt-6 flex items-center justify-end gap-3">
                    {hasChanges && (
                        <button
                            type="button"
                            onClick={loadShop}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 rounded-lg border border-[#D5D9D9] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#565959] transition-colors hover:bg-[#F7F7F7]"
                        >
                            <X className="h-4 w-4" />
                            Hủy thay đổi
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving || !hasChanges}
                        className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-all ${
                            hasChanges && !isSaving
                                ? "bg-[#FF9900] hover:bg-[#E47911]"
                                : "cursor-not-allowed bg-[#D5D9D9] text-[#9B9B9B]"
                        }`}
                    >
                        {isSaving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                    </button>
                </div>
            </div>

            {/* Read-only Info */}
            <div className="rounded-xl border border-[#E0E4E8] bg-[#FAFAFA] p-6">
                <h2 className="mb-3 text-[14px] font-bold text-[#565959]">Thông tin không thể sửa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[13px]">
                    <div>
                        <span className="text-[#9B9B9B]">Loại hình: </span>
                        <span className="font-medium text-[#222222]">
                            {shop.partner_type === "business" ? "Doanh nghiệp" : "Cá nhân"}
                        </span>
                    </div>
                    <div>
                        <span className="text-[#9B9B9B]">Số CCCD/GPKD: </span>
                        <span className="font-medium text-[#222222]">{shop.identity_number || "—"}</span>
                    </div>
                    <div>
                        <span className="text-[#9B9B9B]">Đánh giá TB: </span>
                        <span className="font-medium text-[#222222]">{Number(shop.rating_average ?? 0).toFixed(1)} ★</span>
                    </div>
                    <div>
                        <span className="text-[#9B9B9B]">Trạng thái: </span>
                        <span className="font-medium text-[#222222]">{shop.is_active ? "Đang hoạt động" : "Chưa hoạt động"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
