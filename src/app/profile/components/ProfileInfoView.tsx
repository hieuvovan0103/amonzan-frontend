"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CheckCircle2, Loader2, Trash2 } from "lucide-react";
import DatePickerField from "@/components/ui/DatePickerField";
import PhoneOtpDialog from "@/components/signup/PhoneOtpDialog";
import { fetchWithAuth } from "@/lib/apiClient";
import { normalizePhoneNumber } from "@/lib/phone";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import VendorRegisterBanner from "./VendorRegisterBanner";

const GENDER_OPTIONS = ["Nam", "Nữ", "Khác"];
const AVATAR_BUCKET = "avatars";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function maskSensitive(value: string | null | undefined): string {
    if (!value) return "Chưa cập nhật";
    if (value.length <= 4) return "****";
    return `${value.slice(0, 2)}${"*".repeat(value.length - 4)}${value.slice(-2)}`;
}

export default function ProfileInfoView() {
    const profile = useAuthStore((state) => state.profile);
    const user = useAuthStore((state) => state.user);
    const setProfile = useAuthStore((state) => state.setProfile);
    const showToast = useToastStore((state) => state.show);

    const userRoles =
        profile?.user_roles
            ?.map((userRole: any) => {
                if (Array.isArray(userRole.roles)) return userRole.roles[0]?.role_name;
                return userRole.roles?.role_name;
            })
            .filter(Boolean) || [];

    const isVendor = userRoles.includes("SHOP_OWNER") || userRoles.includes("VENDOR");
    const hasVendorApplication = Array.isArray(profile?.shop_profiles)
        ? profile.shop_profiles.length > 0
        : Boolean(profile?.shop_profiles);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState("");
    const [gender, setGender] = useState("");
    const [idNumber, setIdNumber] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [isEditingId, setIsEditingId] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState("");
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!profile) return;

        setFullName(profile.full_name ?? "");
        setEmail(profile.email ?? "");
        setDob(profile.date_of_birth ?? "");
        setGender(profile.gender ?? "");
        setIdNumber(profile.id_number ?? "");
        setAvatarPreview(profile.avatar_url ?? null);
    }, [profile]);

    const displayName = profile?.full_name || profile?.email || "Người dùng";

    const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            showToast("Chỉ chấp nhận file JPG, PNG hoặc WebP.", "error");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            showToast("File quá lớn. Tối đa 5MB.", "error");
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
        setIsUploadingAvatar(true);

        try {
            if (!user?.id) throw new Error("Chưa xác thực người dùng.");

            const ext = file.name.split(".").pop() ?? "jpg";
            const storagePath = `${user.id}/avatar.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from(AVATAR_BUCKET)
                .upload(storagePath, file, { upsert: true, contentType: file.type });

            if (uploadError) throw new Error(uploadError.message);

            const {
                data: { publicUrl },
            } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(storagePath);

            const urlWithBuster = `${publicUrl}?t=${Date.now()}`;
            const response = await fetchWithAuth("/profile/me", {
                method: "PATCH",
                body: JSON.stringify({ avatar_url: urlWithBuster }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || "Không thể lưu ảnh đại diện.");
            }

            const updated = await response.json();
            setProfile({ ...profile, ...updated });
            setAvatarPreview(urlWithBuster);
            showToast("Cập nhật ảnh đại diện thành công.", "success");
        } catch (error: any) {
            setAvatarPreview(profile?.avatar_url ?? null);
            showToast(error.message || "Upload ảnh thất bại.", "error");
        } finally {
            setIsUploadingAvatar(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
            URL.revokeObjectURL(objectUrl);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!user?.id || !profile?.avatar_url) return;

        setIsUploadingAvatar(true);
        try {
            const match = profile.avatar_url.match(/avatar\.(\w+)\?/);
            const ext = match?.[1] ?? "jpg";
            const storagePath = `${user.id}/avatar.${ext}`;

            await supabase.storage.from(AVATAR_BUCKET).remove([storagePath]);
            const response = await fetchWithAuth("/profile/me", {
                method: "PATCH",
                body: JSON.stringify({ avatar_url: null }),
            });

            if (!response.ok) throw new Error("Không thể xóa ảnh đại diện.");

            const updated = await response.json();
            setProfile({ ...profile, ...updated, avatar_url: null });
            setAvatarPreview(null);
            showToast("Đã xóa ảnh đại diện.", "info");
        } catch (error: any) {
            showToast(error.message || "Xóa ảnh thất bại.", "error");
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaved(false);

        try {
            const response = await fetchWithAuth("/profile/me", {
                method: "PATCH",
                body: JSON.stringify({
                    full_name: fullName || undefined,
                    email: email || undefined,
                    date_of_birth: dob || undefined,
                    gender: gender || undefined,
                    id_number: idNumber || undefined,
                }),
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || "Lưu hồ sơ thất bại.");
            }

            const updated = await response.json();
            setProfile({ ...profile, ...updated });
            setSaved(true);
            setIsEditingId(false);
            showToast("Cập nhật hồ sơ thành công.", "success");
            setTimeout(() => setSaved(false), 3000);
        } catch (error: any) {
            showToast(error.message || "Có lỗi xảy ra khi lưu hồ sơ.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <section className="min-w-0 rounded-[8px] border border-[#E6E6E6] bg-white">
            <div className="border-b border-[#E6E6E6] px-4 py-4 sm:px-5 md:px-6">
                <h2 className="text-[18px] font-bold text-[#222222]">Hồ sơ cá nhân</h2>
                <p className="mt-1 text-[13px] text-[#565959]">
                    Quản lý thông tin định danh, liên hệ và ảnh đại diện.
                </p>
            </div>

            <div className="p-4 sm:p-5 md:p-6">
                {!isVendor && !hasVendorApplication && <VendorRegisterBanner />}

                <div className="mb-6 flex min-w-0 flex-col gap-5 rounded-[8px] border border-[#E6E6E6] bg-[#FAFAFA] p-4 sm:flex-row sm:items-center">
                    <button
                        type="button"
                        onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                        className="group relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#E6E6E6] shadow-sm"
                    >
                        {isUploadingAvatar ? (
                            <span className="flex h-full w-full items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                            </span>
                        ) : avatarPreview ? (
                            <img src={avatarPreview} alt="Ảnh đại diện" className="h-full w-full object-cover" />
                        ) : (
                            <span className="flex h-full w-full items-center justify-center text-[34px] font-bold text-[#565959]">
                                {displayName.charAt(0).toUpperCase()}
                            </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
                            <Camera className="h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                        </span>
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />

                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-[18px] font-bold text-[#222222]">{displayName}</h3>
                        <p className="mt-1 text-[13px] text-[#565959]">
                            Dùng ảnh JPG, PNG hoặc WebP. Kích thước tối đa 5MB.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                className="inline-flex items-center gap-2 rounded-[4px] border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-bold text-[#222222] transition-colors hover:bg-[#F7F7F7] disabled:opacity-60"
                            >
                                {isUploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                                Tải ảnh mới
                            </button>
                            {avatarPreview && !isUploadingAvatar ? (
                                <button
                                    type="button"
                                    onClick={handleDeleteAvatar}
                                    className="inline-flex items-center gap-2 rounded-[4px] border border-[#F3C7C7] bg-white px-4 py-2 text-[13px] font-bold text-[#C62828] transition-colors hover:bg-[#FFF5F5]"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Xóa ảnh
                                </button>
                            ) : null}
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                    <TextField label="Họ và tên" value={fullName} onChange={setFullName} placeholder="Nhập họ và tên" />
                    <TextField label="Email" value={email} onChange={setEmail} placeholder="Nhập email" type="email" />
                    <label className="block">
                        <span className="mb-1.5 block text-[13px] font-bold text-[#565959]">Ngày sinh</span>
                        <DatePickerField value={dob} onChange={setDob} />
                    </label>
                    <div>
                        <span className="mb-2 block text-[13px] font-bold text-[#565959]">Giới tính</span>
                        <div className="flex flex-wrap gap-3">
                            {GENDER_OPTIONS.map((option) => (
                                <label
                                    key={option}
                                    className="flex cursor-pointer items-center gap-2 rounded-[4px] border border-[#D5D9D9] bg-white px-3 py-2 text-[14px] text-[#222222]"
                                >
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={option}
                                        checked={gender === option}
                                        onChange={() => setGender(option)}
                                        className="h-4 w-4 accent-[#FF9900]"
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-[#E6E6E6] pt-6 lg:grid-cols-2">
                    <div className="rounded-[8px] border border-[#E6E6E6] p-4">
                        <div className="text-[13px] font-bold text-[#565959]">Số điện thoại</div>
                        {isEditingPhone ? (
                            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="tel"
                                    value={newPhone}
                                    onChange={(event) => setNewPhone(event.target.value)}
                                    placeholder="0912345678"
                                    className="min-w-0 flex-1 rounded-[4px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const normalized = normalizePhoneNumber(newPhone);
                                        if (!normalized) {
                                            showToast("Số điện thoại không hợp lệ.", "error");
                                            return;
                                        }
                                        setNewPhone(normalized);
                                        setShowOtpDialog(true);
                                    }}
                                    className="rounded-[4px] bg-[#FF9900] px-4 py-2 text-[13px] font-bold text-[#111111]"
                                >
                                    Gửi OTP
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingPhone(false)}
                                    className="rounded-[4px] border border-[#D5D9D9] px-4 py-2 text-[13px] font-bold text-[#222222]"
                                >
                                    Hủy
                                </button>
                            </div>
                        ) : (
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <span className="text-[15px] font-bold text-[#222222]">
                                    {maskSensitive(profile?.phone_number)}
                                </span>
                                {profile?.is_phone_verified ? (
                                    <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#007600]">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Đã xác thực
                                    </span>
                                ) : null}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNewPhone("");
                                        setIsEditingPhone(true);
                                    }}
                                    className="text-[13px] font-bold text-[#007185] hover:text-[#E47911] hover:underline"
                                >
                                    Thay đổi
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="rounded-[8px] border border-[#E6E6E6] p-4">
                        <div className="text-[13px] font-bold text-[#565959]">Số CCCD / ID</div>
                        {isEditingId ? (
                            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                                <input
                                    type="text"
                                    value={idNumber}
                                    onChange={(event) => setIdNumber(event.target.value)}
                                    placeholder="Nhập số CCCD/CMND"
                                    className="min-w-0 flex-1 rounded-[4px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/30"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIdNumber(profile?.id_number ?? "");
                                        setIsEditingId(false);
                                    }}
                                    className="rounded-[4px] border border-[#D5D9D9] px-4 py-2 text-[13px] font-bold text-[#222222]"
                                >
                                    Hủy
                                </button>
                            </div>
                        ) : (
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                                <span className="text-[15px] font-bold text-[#222222]">
                                    {maskSensitive(profile?.id_number)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsEditingId(true)}
                                    className="text-[13px] font-bold text-[#007185] hover:text-[#E47911] hover:underline"
                                >
                                    Cập nhật
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-end border-t border-[#E6E6E6] pt-5">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#FF9900] px-5 py-3 text-[14px] font-bold text-[#111111] transition-colors hover:bg-[#E47911] disabled:opacity-60 sm:w-auto"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {saved ? "Đã lưu" : "Lưu thay đổi"}
                    </button>
                </div>
            </div>

            {showOtpDialog && (
                <PhoneOtpDialog
                    phoneNumber={newPhone}
                    mode="update"
                    onSuccess={() => {
                        setShowOtpDialog(false);
                        setIsEditingPhone(false);
                        showToast("Cập nhật số điện thoại thành công.", "success");
                    }}
                    onClose={() => setShowOtpDialog(false)}
                />
            )}
        </section>
    );
}

function TextField({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}) {
    return (
        <label className="block">
            <span className="mb-1.5 block text-[13px] font-bold text-[#565959]">{label}</span>
            <input
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="w-full rounded-[4px] border border-[#D5D9D9] bg-white px-3 py-2.5 text-[14px] text-[#222222] outline-none transition-all focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/30"
            />
        </label>
    );
}
