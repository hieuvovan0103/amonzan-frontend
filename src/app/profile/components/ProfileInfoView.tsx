'use client';

import { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useToastStore } from '@/stores/useToastStore';
import { fetchWithAuth } from '@/lib/apiClient';
import { supabase } from '@/lib/supabase';
import VendorRegisterBanner from './VendorRegisterBanner';
import DatePickerField from '@/components/ui/DatePickerField';
import PhoneOtpDialog from '@/components/signup/PhoneOtpDialog';
import { normalizePhoneNumber } from '@/lib/phone';

const GENDER_OPTIONS = ['Nam', 'Nữ', 'Khác'];
const AVATAR_BUCKET = 'avatars';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function maskSensitive(value: string | null | undefined): string {
    if (!value) return '—';
    if (value.length <= 4) return '****';
    return value.slice(0, 2) + '*'.repeat(value.length - 4) + value.slice(-2);
}

export default function ProfileInfoView() {
    const profile = useAuthStore((s) => s.profile);
    const user = useAuthStore((s) => s.user);
    const setProfile = useAuthStore((s) => s.setProfile);

    const userRoles =
        profile?.user_roles
            ?.map((userRole: any) => {
                if (Array.isArray(userRole.roles)) {
                    return userRole.roles[0]?.role_name;
                }

                return userRole.roles?.role_name;
            })
            .filter(Boolean) || [];

    const isVendor =
        userRoles.includes('SHOP_OWNER') || userRoles.includes('VENDOR');
    const hasVendorApplication = Array.isArray(profile?.shop_profiles)
        ? profile.shop_profiles.length > 0
        : Boolean(profile?.shop_profiles);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // States for inline editing
    const [isEditingId, setIsEditingId] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [newPhone, setNewPhone] = useState('');
    const [showOtpDialog, setShowOtpDialog] = useState(false);

    // Avatar state
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name ?? '');
            setEmail(profile.email ?? '');
            setDob(profile.date_of_birth ?? '');
            setGender(profile.gender ?? '');
            setIdNumber(profile.id_number ?? '');
            setAvatarPreview(profile.avatar_url ?? null);
        }
    }, [profile]);

    // ─── Upload avatar lên Supabase Storage ───────────────────────────────────
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate
        if (!ALLOWED_TYPES.includes(file.type)) {
            useToastStore.getState().show('Chỉ chấp nhận file JPG, PNG hoặc WebP.', 'error');
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            useToastStore.getState().show('File quá lớn. Tối đa 5MB.', 'error');
            return;
        }

        // Preview ngay trước khi upload để UX mượt mà
        const objectUrl = URL.createObjectURL(file);
        setAvatarPreview(objectUrl);
        setIsUploadingAvatar(true);

        try {
            if (!user?.id) throw new Error('Chưa xác thực người dùng');

            const ext = file.name.split('.').pop() ?? 'jpg';
            // Path: {user_id}/avatar.{ext} — ghi đè file cũ mỗi lần upload
            const storagePath = `${user.id}/avatar.${ext}`;

            const { error: uploadError } = await supabase.storage
                .from(AVATAR_BUCKET)
                .upload(storagePath, file, { upsert: true, contentType: file.type });

            if (uploadError) throw new Error(uploadError.message);

            // Lấy public URL
            const { data: { publicUrl } } = supabase.storage
                .from(AVATAR_BUCKET)
                .getPublicUrl(storagePath);

            // Thêm cache buster để browser không dùng ảnh cũ từ cache
            const urlWithBuster = `${publicUrl}?t=${Date.now()}`;

            // Lưu URL vào DB qua backend
            const res = await fetchWithAuth('/profile/me', {
                method: 'PATCH',
                body: JSON.stringify({ avatar_url: urlWithBuster }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Không thể lưu ảnh đại diện');
            }

            const updated = await res.json();
            setProfile({ ...profile, ...updated });
            setAvatarPreview(urlWithBuster);
            useToastStore.getState().show('Cập nhật ảnh đại diện thành công!', 'success');
        } catch (e: any) {
            // Rollback preview về ảnh cũ nếu lỗi
            setAvatarPreview(profile?.avatar_url ?? null);
            useToastStore.getState().show(e.message || 'Upload ảnh thất bại.', 'error');
        } finally {
            setIsUploadingAvatar(false);
            // Reset input để có thể chọn lại cùng file
            if (fileInputRef.current) fileInputRef.current.value = '';
            URL.revokeObjectURL(objectUrl);
        }
    };

    // ─── Xóa avatar ──────────────────────────────────────────────────────────
    const handleDeleteAvatar = async () => {
        if (!user?.id || !profile?.avatar_url) return;
        setIsUploadingAvatar(true);
        try {
            // Tìm extension từ URL hiện tại
            const match = profile.avatar_url.match(/avatar\.(\w+)\?/);
            const ext = match?.[1] ?? 'jpg';
            const storagePath = `${user.id}/avatar.${ext}`;

            await supabase.storage.from(AVATAR_BUCKET).remove([storagePath]);

            const res = await fetchWithAuth('/profile/me', {
                method: 'PATCH',
                body: JSON.stringify({ avatar_url: null }),
            });

            if (!res.ok) throw new Error('Không thể xóa ảnh đại diện');

            const updated = await res.json();
            setProfile({ ...profile, ...updated, avatar_url: null });
            setAvatarPreview(null);
            useToastStore.getState().show('Đã xóa ảnh đại diện.', 'info');
        } catch (e: any) {
            useToastStore.getState().show(e.message || 'Xóa ảnh thất bại.', 'error');
        } finally {
            setIsUploadingAvatar(false);
        }
    };

    // ─── Lưu thông tin hồ sơ ─────────────────────────────────────────────────
    const handleSave = async () => {
        setIsSaving(true);
        setSaved(false);
        try {
            const res = await fetchWithAuth('/profile/me', {
                method: 'PATCH',
                body: JSON.stringify({
                    full_name: fullName || undefined,
                    email: email || undefined,
                    date_of_birth: dob || undefined,
                    gender: gender || undefined,
                    id_number: idNumber || undefined,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.message || 'Lưu thất bại');
            }

            const updated = await res.json();
            setProfile({ ...profile, ...updated });
            setSaved(true);
            setIsEditingId(false);
            useToastStore.getState().show('Cập nhật hồ sơ thành công!', 'success');
            setTimeout(() => setSaved(false), 3000);
        } catch (e: any) {
            useToastStore.getState().show(e.message || 'Có lỗi xảy ra khi lưu.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const displayName = profile?.full_name || profile?.email || 'Người dùng';

    return (
        <div className="flex-1 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8 animate-in fade-in duration-300">
            <div className="mb-8 border-b border-[#E6E6E6] pb-4">
                <h1 className="text-[20px] font-bold text-[#222222] uppercase mb-1">
                    Hồ sơ của tôi
                </h1>
                <p className="text-[14px] text-[#565959]">
                    Quản lý và bảo vệ tài khoản của bạn
                </p>
            </div>

            <div className="max-w-[800px]">
                {!isVendor && !hasVendorApplication && <VendorRegisterBanner />}

                {/* ── Avatar ── */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#E6E6E6]">

                    {/* Vòng tròn avatar — click để chọn file */}
                    <div
                        className="relative group cursor-pointer"
                        onClick={() => !isUploadingAvatar && fileInputRef.current?.click()}
                        title="Nhấn để thay đổi ảnh đại diện"
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md bg-[#F7F7F7] flex items-center justify-center">
                            {isUploadingAvatar ? (
                                <Loader2 className="w-8 h-8 text-[#FF9900] animate-spin" />
                            ) : avatarPreview ? (
                                <img
                                    src={avatarPreview}
                                    alt="Ảnh đại diện"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-[36px] font-bold text-[#D5D9D9] select-none">
                                    {displayName.charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>

                        {/* Overlay camera icon khi hover */}
                        {!isUploadingAvatar && (
                            <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                            </div>
                        )}

                        {/* Badge camera góc phải dưới */}
                        <div className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-[#D5D9D9] rounded-full flex items-center justify-center text-[#565959] group-hover:text-[#FF9900] group-hover:border-[#FF9900] transition-colors shadow-sm">
                            <Camera className="w-4 h-4" />
                        </div>
                    </div>

                    {/* Input file ẩn */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                    />

                    <div>
                        <h3 className="text-[18px] font-bold text-[#222222] mb-1">
                            {displayName}
                        </h3>
                        <p className="text-[13px] text-[#565959] mb-3">
                            Định dạng JPG, PNG, WebP. Tối đa 5MB.
                        </p>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploadingAvatar}
                                className="bg-white hover:bg-[#F7F7F7] disabled:opacity-60 border border-[#D5D9D9] text-[#222222] font-semibold text-[13px] px-4 py-1.5 rounded-[8px] transition-colors shadow-sm flex items-center gap-1.5"
                            >
                                {isUploadingAvatar && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                                Tải ảnh mới
                            </button>

                            {avatarPreview && !isUploadingAvatar && (
                                <button
                                    onClick={handleDeleteAvatar}
                                    className="flex items-center gap-1 text-[13px] font-medium text-[#C62828] hover:underline"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Xóa ảnh
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Form thông tin ── */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <label className="sm:w-[140px] text-[14px] text-[#565959] sm:text-right font-medium">
                            Họ & tên
                        </label>
                        <div className="flex-1 max-w-[450px]">
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Nhập họ và tên..."
                                className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <label className="sm:w-[140px] text-[14px] text-[#565959] sm:text-right font-medium">
                            Email
                        </label>
                        <div className="flex-1 max-w-[450px]">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email..."
                                className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <label className="sm:w-[140px] text-[14px] text-[#565959] sm:text-right font-medium">
                            Ngày sinh
                        </label>
                        <div className="flex-1 max-w-[450px]">
                            <DatePickerField
                                value={dob}
                                onChange={setDob}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <label className="sm:w-[140px] text-[14px] text-[#565959] sm:text-right font-medium">
                            Giới tính
                        </label>
                        <div className="flex-1 flex items-center gap-6">
                            {GENDER_OPTIONS.map((g) => (
                                <label key={g} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value={g}
                                        checked={gender === g}
                                        onChange={() => setGender(g)}
                                        className="w-4 h-4 accent-[#FF9900]"
                                    />
                                    <span className="text-[14px] text-[#222222]">{g}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Số điện thoại */}
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 mt-10 pt-6 border-t border-[#E6E6E6]">
                        <label className="sm:w-[140px] text-[14px] text-[#565959] sm:text-right font-medium mt-2">
                            Số điện thoại
                        </label>
                        <div className="flex-1 max-w-[450px]">
                            {isEditingPhone ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="tel"
                                        value={newPhone}
                                        onChange={(e) => setNewPhone(e.target.value)}
                                        placeholder="0912345678"
                                        className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all shadow-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            const normalized = normalizePhoneNumber(newPhone);
                                            if (!normalized) {
                                                useToastStore.getState().show("Số điện thoại không hợp lệ.", "error");
                                                return;
                                            }
                                            setNewPhone(normalized);
                                            setShowOtpDialog(true);
                                        }}
                                        className="bg-[#F7F7F7] hover:bg-[#E6E6E6] border border-[#D5D9D9] text-[#222222] font-semibold text-[13px] px-4 py-2 rounded-[8px] transition-colors whitespace-nowrap"
                                    >
                                        Gửi OTP
                                    </button>
                                    <button
                                        onClick={() => setIsEditingPhone(false)}
                                        className="text-[#565959] hover:text-[#222222] text-[13px] font-medium whitespace-nowrap px-2"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-[14px] mt-2">
                                    <span className="text-[#222222] font-semibold">
                                        {maskSensitive(profile?.phone_number)}
                                    </span>
                                    {profile?.is_phone_verified && (
                                        <span className="flex items-center gap-1 text-[12px] text-[#007600] font-medium">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Đã xác thực
                                        </span>
                                    )}
                                    <button 
                                        onClick={() => {
                                            setNewPhone('');
                                            setIsEditingPhone(true);
                                        }}
                                        className="text-[#007185] hover:text-[#E47911] hover:underline font-bold ml-2 transition-colors text-[13px]"
                                    >
                                        Thay đổi
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Số CCCD */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <label className="sm:w-[140px] text-[14px] text-[#565959] sm:text-right font-medium">
                            Số CCCD / ID
                        </label>
                        <div className="flex-1 max-w-[450px]">
                            {isEditingId ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={idNumber}
                                        onChange={(e) => setIdNumber(e.target.value)}
                                        placeholder="Nhập số CCCD/CMND..."
                                        className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900] transition-all shadow-sm"
                                    />
                                    <button
                                        onClick={() => {
                                            setIdNumber(profile?.id_number ?? '');
                                            setIsEditingId(false);
                                        }}
                                        className="text-[#565959] hover:text-[#222222] text-[13px] font-medium whitespace-nowrap px-2"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-[14px]">
                                    <span className="text-[#222222] font-semibold">
                                        {maskSensitive(profile?.id_number)}
                                    </span>
                                    <button 
                                        onClick={() => setIsEditingId(true)}
                                        className="text-[#007185] hover:text-[#E47911] hover:underline font-bold ml-2 transition-colors text-[13px]"
                                    >
                                        Cập nhật
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nút lưu */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-6">
                        <div className="sm:w-[140px]" />
                        <div className="flex-1 flex items-center gap-4">
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="bg-[#FF9900] hover:bg-[#E47911] disabled:opacity-60 text-[#111111] font-bold text-[14px] px-10 py-3 rounded-[10px] transition-colors shadow-sm flex items-center gap-2"
                            >
                                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {saved ? 'Đã lưu!' : 'Lưu thay đổi'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showOtpDialog && (
                <PhoneOtpDialog
                    phoneNumber={newPhone}
                    mode="update"
                    onSuccess={() => {
                        setShowOtpDialog(false);
                        setIsEditingPhone(false);
                        useToastStore.getState().show('Cập nhật số điện thoại thành công!', 'success');
                    }}
                    onClose={() => setShowOtpDialog(false)}
                />
            )}
        </div>
    );
}
