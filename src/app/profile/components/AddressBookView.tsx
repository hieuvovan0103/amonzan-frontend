"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, Loader2, Plus, Star, Trash2, X } from "lucide-react";
import {
    createProfileAddress,
    deleteProfileAddress,
    getProfileAddresses,
    updateProfileAddress,
    type AddressPayload,
    type ProfileAddress,
} from "@/lib/api/profile";
import { useToastStore } from "@/stores/useToastStore";

type AddressFormState = {
    recipient_name: string;
    phone_number: string;
    line1: string;
    line2: string;
    ward: string;
    district: string;
    city: string;
    province: string;
    postal_code: string;
    country: string;
    is_default: boolean;
};

const emptyForm: AddressFormState = {
    recipient_name: "",
    phone_number: "",
    line1: "",
    line2: "",
    ward: "",
    district: "",
    city: "",
    province: "",
    postal_code: "",
    country: "Vietnam",
    is_default: false,
};

function toFormState(address: ProfileAddress): AddressFormState {
    return {
        recipient_name: address.recipient_name ?? "",
        phone_number: address.phone_number ?? "",
        line1: address.line1 ?? "",
        line2: address.line2 ?? "",
        ward: address.ward ?? "",
        district: address.district ?? "",
        city: address.city ?? "",
        province: address.province ?? "",
        postal_code: address.postal_code ?? "",
        country: address.country ?? "Vietnam",
        is_default: address.is_default,
    };
}

function compactPayload(form: AddressFormState): AddressPayload {
    return {
        recipient_name: form.recipient_name.trim(),
        phone_number: form.phone_number.trim(),
        line1: form.line1.trim(),
        line2: form.line2.trim() || undefined,
        ward: form.ward.trim() || undefined,
        district: form.district.trim() || undefined,
        city: form.city.trim() || undefined,
        province: form.province.trim() || undefined,
        postal_code: form.postal_code.trim() || undefined,
        country: form.country.trim() || "Vietnam",
        is_default: form.is_default,
    };
}

function formatAddress(address: ProfileAddress) {
    return [
        address.line1,
        address.line2,
        address.ward,
        address.district,
        address.city,
        address.province,
        address.country,
    ]
        .filter(Boolean)
        .join(", ");
}

export default function AddressBookView() {
    const showToast = useToastStore((state) => state.show);
    const [addresses, setAddresses] = useState<ProfileAddress[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [form, setForm] = useState<AddressFormState>(emptyForm);

    const sortedAddresses = useMemo(() => {
        return [...addresses].sort((a, b) => Number(b.is_default) - Number(a.is_default));
    }, [addresses]);

    async function loadAddresses() {
        setIsLoading(true);

        try {
            const data = await getProfileAddresses();
            setAddresses(data);
        } catch (error: any) {
            showToast(error?.message || "Không thể tải địa chỉ giao nhận.", "error");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadAddresses();
    }, []);

    const openCreateForm = () => {
        setEditingAddressId(null);
        setForm({ ...emptyForm, is_default: addresses.length === 0 });
        setIsFormOpen(true);
    };

    const openEditForm = (address: ProfileAddress) => {
        setEditingAddressId(address.address_id);
        setForm(toFormState(address));
        setIsFormOpen(true);
    };

    const closeForm = () => {
        if (isSaving) return;
        setIsFormOpen(false);
        setEditingAddressId(null);
        setForm(emptyForm);
    };

    const updateForm = <K extends keyof AddressFormState>(
        key: K,
        value: AddressFormState[K],
    ) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const validateForm = () => {
        if (!form.recipient_name.trim()) return "Vui lòng nhập tên người nhận.";
        if (!form.phone_number.trim()) return "Vui lòng nhập số điện thoại.";
        if (!form.line1.trim()) return "Vui lòng nhập địa chỉ chi tiết.";
        return null;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validationMessage = validateForm();
        if (validationMessage) {
            showToast(validationMessage, "warning");
            return;
        }

        setIsSaving(true);

        try {
            const payload = compactPayload(form);

            if (editingAddressId) {
                await updateProfileAddress(editingAddressId, payload);
                showToast("Đã cập nhật địa chỉ giao nhận.", "success");
            } else {
                await createProfileAddress(payload);
                showToast("Đã thêm địa chỉ giao nhận.", "success");
            }

            setIsFormOpen(false);
            setEditingAddressId(null);
            setForm(emptyForm);
            await loadAddresses();
        } catch (error: any) {
            showToast(error?.message || "Không thể lưu địa chỉ giao nhận.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSetDefault = async (address: ProfileAddress) => {
        if (address.is_default) return;

        try {
            await updateProfileAddress(address.address_id, { is_default: true });
            showToast("Đã đặt làm địa chỉ mặc định.", "success");
            await loadAddresses();
        } catch (error: any) {
            showToast(error?.message || "Không thể đặt địa chỉ mặc định.", "error");
        }
    };

    const handleDelete = async (address: ProfileAddress) => {
        const confirmed = window.confirm("Bạn có chắc muốn xóa địa chỉ này?");
        if (!confirmed) return;

        try {
            await deleteProfileAddress(address.address_id);
            showToast("Đã xóa địa chỉ giao nhận.", "info");
            await loadAddresses();
        } catch (error: any) {
            showToast(error?.message || "Không thể xóa địa chỉ giao nhận.", "error");
        }
    };

    return (
        <div className="flex-1 rounded-[16px] border border-[#E6E6E6] bg-white p-6 shadow-sm animate-in fade-in duration-300 md:p-8">
            <div className="mb-6 flex items-center justify-between border-b border-[#E6E6E6] pb-4">
                <div>
                    <h2 className="text-[20px] font-bold text-[#222222]">
                        Địa chỉ của tôi
                    </h2>
                    <p className="mt-1 text-[13px] text-[#565959]">
                        Quản lý địa chỉ giao nhận dùng khi đặt thuê.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={openCreateForm}
                    className="flex items-center gap-1.5 rounded-[8px] bg-[#FF9900] px-4 py-2 text-[13px] font-semibold text-[#111111]"
                >
                    <Plus className="h-4 w-4" />
                    Thêm địa chỉ
                </button>
            </div>

            {isFormOpen && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-6 rounded-[10px] border border-[#D5D9D9] bg-[#F7F7F7] p-4"
                >
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <h3 className="text-[16px] font-bold text-[#222222]">
                            {editingAddressId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                        </h3>

                        <button
                            type="button"
                            onClick={closeForm}
                            className="rounded-full p-1 text-[#565959] hover:bg-white hover:text-[#222222]"
                            aria-label="Đóng form địa chỉ"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <TextField
                            label="Người nhận"
                            value={form.recipient_name}
                            onChange={(value) => updateForm("recipient_name", value)}
                            required
                        />
                        <TextField
                            label="Số điện thoại"
                            value={form.phone_number}
                            onChange={(value) => updateForm("phone_number", value)}
                            required
                        />
                        <TextField
                            label="Địa chỉ chi tiết"
                            value={form.line1}
                            onChange={(value) => updateForm("line1", value)}
                            required
                            className="md:col-span-2"
                        />
                        <TextField
                            label="Tòa nhà, tầng, ghi chú"
                            value={form.line2}
                            onChange={(value) => updateForm("line2", value)}
                            className="md:col-span-2"
                        />
                        <TextField
                            label="Phường/Xã"
                            value={form.ward}
                            onChange={(value) => updateForm("ward", value)}
                        />
                        <TextField
                            label="Quận/Huyện"
                            value={form.district}
                            onChange={(value) => updateForm("district", value)}
                        />
                        <TextField
                            label="Tỉnh/Thành phố"
                            value={form.city}
                            onChange={(value) => updateForm("city", value)}
                        />
                        <TextField
                            label="Tỉnh/Bang"
                            value={form.province}
                            onChange={(value) => updateForm("province", value)}
                        />
                        <TextField
                            label="Mã bưu chính"
                            value={form.postal_code}
                            onChange={(value) => updateForm("postal_code", value)}
                        />
                        <TextField
                            label="Quốc gia"
                            value={form.country}
                            onChange={(value) => updateForm("country", value)}
                        />
                    </div>

                    <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-[13px] font-medium text-[#222222]">
                        <input
                            type="checkbox"
                            checked={form.is_default}
                            onChange={(event) => updateForm("is_default", event.target.checked)}
                            className="h-4 w-4 accent-[#FF9900]"
                        />
                        Đặt làm địa chỉ mặc định
                    </label>

                    <div className="mt-5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeForm}
                            disabled={isSaving}
                            className="rounded-[8px] border border-[#D5D9D9] bg-white px-5 py-2 text-[13px] font-semibold text-[#222222] hover:bg-[#F7F7F7] disabled:opacity-60"
                        >
                            Hủy
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 rounded-[8px] bg-[#FF9900] px-5 py-2 text-[13px] font-bold text-[#111111] hover:bg-[#E47911] disabled:opacity-60"
                        >
                            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                            {editingAddressId ? "Lưu thay đổi" : "Thêm địa chỉ"}
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <div className="flex items-center justify-center gap-2 py-12 text-[14px] text-[#565959]">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Đang tải địa chỉ...
                </div>
            ) : sortedAddresses.length === 0 ? (
                <div className="rounded-[10px] border border-dashed border-[#D5D9D9] bg-[#F7F7F7] px-6 py-10 text-center">
                    <p className="text-[15px] font-bold text-[#222222]">
                        Bạn chưa có địa chỉ giao nhận
                    </p>
                    <p className="mt-1 text-[13px] text-[#565959]">
                        Thêm địa chỉ để có thể tạo đơn thuê và giao nhận sản phẩm.
                    </p>
                    <button
                        type="button"
                        onClick={openCreateForm}
                        className="mt-5 rounded-[8px] bg-[#FF9900] px-5 py-2 text-[13px] font-bold text-[#111111]"
                    >
                        Thêm địa chỉ đầu tiên
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-0">
                    {sortedAddresses.map((address, index) => (
                        <div
                            key={address.address_id}
                            className={`flex flex-col justify-between gap-4 py-5 sm:flex-row ${
                                index !== sortedAddresses.length - 1
                                    ? "border-b border-[#E6E6E6]"
                                    : ""
                            }`}
                        >
                            <div className="min-w-0">
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <span className="text-[15px] font-bold text-[#222222]">
                                        {address.recipient_name}
                                    </span>
                                    <span className="text-[14px] text-[#565959]">
                                        {address.phone_number}
                                    </span>
                                    {address.is_default && (
                                        <span className="rounded-[4px] border border-[#FF9900] bg-[#FF9900]/10 px-2 py-0.5 text-[12px] font-semibold text-[#FF9900]">
                                            Mặc định
                                        </span>
                                    )}
                                </div>

                                <div className="max-w-[720px] text-[13px] leading-5 text-[#565959]">
                                    {formatAddress(address)}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                                {!address.is_default && (
                                    <button
                                        type="button"
                                        onClick={() => handleSetDefault(address)}
                                        className="flex items-center gap-1 rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#222222] hover:bg-[#F7F7F7]"
                                    >
                                        <Star className="h-3.5 w-3.5" />
                                        Mặc định
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => openEditForm(address)}
                                    className="flex items-center gap-1 rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#222222] hover:bg-[#F7F7F7]"
                                >
                                    <Edit3 className="h-3.5 w-3.5" />
                                    Sửa
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDelete(address)}
                                    className="flex items-center gap-1 rounded-[8px] border border-[#F3C7C7] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#C62828] hover:bg-[#FCF4F4]"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Xóa
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function TextField({
    label,
    value,
    onChange,
    required = false,
    className = "",
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    required?: boolean;
    className?: string;
}) {
    return (
        <label className={`block ${className}`}>
            <span className="mb-1 block text-[13px] font-semibold text-[#565959]">
                {label}
                {required && <span className="text-[#C62828]"> *</span>}
            </span>
            <input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-2 text-[14px] text-[#222222] outline-none transition-all focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
            />
        </label>
    );
}
