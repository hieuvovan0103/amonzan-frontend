"use client";

import { FormEvent, useEffect, useState } from "react";
import { CheckCircle, Loader2, Send, TicketPercent } from "lucide-react";
import {
    createVendorVoucher,
    getVendorVouchers,
    submitVendorVoucher,
    type ManagedVoucher,
    type VoucherPayload,
} from "@/lib/api/vouchers";

const initialForm = {
    code: "",
    discountType: "FIXED" as "FIXED" | "PERCENTAGE",
    discountValue: "",
    validFrom: "",
    validTo: "",
};

function formatDate(value: string | null) {
    if (!value) return "-";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function statusLabel(status: string) {
    const labels: Record<string, string> = {
        DRAFT: "Bản nháp",
        PENDING_REVIEW: "Chờ admin duyệt",
        APPROVED: "Đã duyệt",
        REJECTED: "Bị từ chối",
        ARCHIVED: "Đã lưu trữ",
    };
    return labels[status] ?? status;
}

function buildPayload(form: typeof initialForm): VoucherPayload {
    return {
        code: form.code.trim().toUpperCase(),
        discountType: form.discountType,
        discountValue: Number(form.discountValue || 0),
        validFrom: new Date(form.validFrom).toISOString(),
        validTo: new Date(form.validTo).toISOString(),
    };
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export default function VendorVouchersView() {
    const [vouchers, setVouchers] = useState<ManagedVoucher[]>([]);
    const [form, setForm] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const loadVouchers = async () => {
        setIsLoading(true);
        setMessage("");
        try {
            setVouchers(await getVendorVouchers());
        } catch (error: unknown) {
            setMessage(getErrorMessage(error, "Không thể tải voucher."));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadVouchers();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            await createVendorVoucher(buildPayload(form));
            setForm(initialForm);
            setMessage("Đã tạo voucher bản nháp.");
            await loadVouchers();
        } catch (error: unknown) {
            setMessage(getErrorMessage(error, "Không thể tạo voucher."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitReview = async (voucherId: string) => {
        setActionId(voucherId);
        setMessage("");

        try {
            await submitVendorVoucher(voucherId);
            setMessage("Đã gửi voucher cho admin duyệt.");
            await loadVouchers();
        } catch (error: unknown) {
            setMessage(getErrorMessage(error, "Không thể gửi duyệt voucher."));
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="flex-1 animate-in fade-in duration-300">
            <div className="mb-6 rounded-2xl border border-[#E6E6E6] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <TicketPercent className="h-5 w-5 text-[#007185]" />
                    <div>
                        <h2 className="text-[18px] font-bold text-[#222222]">Voucher của shop</h2>
                        <p className="text-[13px] text-[#565959]">Tạo mã giảm giá và gửi admin duyệt trước khi khách sử dụng.</p>
                    </div>
                </div>

                <form onSubmit={handleCreate} className="grid gap-3 md:grid-cols-5">
                    <input
                        value={form.code}
                        onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
                        required
                        placeholder="Mã voucher"
                        className="rounded-lg border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none focus:border-[#FF9900]"
                    />
                    <select
                        value={form.discountType}
                        onChange={(event) => setForm((current) => ({ ...current, discountType: event.target.value as "FIXED" | "PERCENTAGE" }))}
                        className="rounded-lg border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none focus:border-[#FF9900]"
                    >
                        <option value="FIXED">Giảm tiền</option>
                        <option value="PERCENTAGE">Giảm %</option>
                    </select>
                    <input
                        value={form.discountValue}
                        onChange={(event) => setForm((current) => ({ ...current, discountValue: event.target.value }))}
                        required
                        type="number"
                        min="0"
                        placeholder="Giá trị"
                        className="rounded-lg border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none focus:border-[#FF9900]"
                    />
                    <input
                        value={form.validFrom}
                        onChange={(event) => setForm((current) => ({ ...current, validFrom: event.target.value }))}
                        required
                        type="datetime-local"
                        className="rounded-lg border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none focus:border-[#FF9900]"
                    />
                    <input
                        value={form.validTo}
                        onChange={(event) => setForm((current) => ({ ...current, validTo: event.target.value }))}
                        required
                        type="datetime-local"
                        className="rounded-lg border border-[#D5D9D9] px-3 py-2 text-[13px] outline-none focus:border-[#FF9900]"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#F0C14B] bg-[#FFD814] px-4 py-2 text-[13px] font-bold text-[#111111] hover:bg-[#F0C14B] md:col-span-5"
                    >
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Tạo voucher nháp
                    </button>
                </form>

                {message ? <p className="mt-3 text-[13px] font-semibold text-[#007185]">{message}</p> : null}
            </div>

            <div className="overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white shadow-sm">
                {isLoading ? (
                    <div className="flex min-h-[180px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                    </div>
                ) : (
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#F7F7F7] text-[#565959]">
                            <tr>
                                <th className="p-3">Mã</th>
                                <th className="p-3">Giảm</th>
                                <th className="p-3">Hiệu lực</th>
                                <th className="p-3">Trạng thái</th>
                                <th className="p-3 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vouchers.map((voucher) => (
                                <tr key={voucher.voucherId} className="border-t border-[#E6E6E6]">
                                    <td className="p-3 font-bold">{voucher.code}</td>
                                    <td className="p-3">
                                        {voucher.discountType === "PERCENTAGE" ? `${voucher.discountValue}%` : `${voucher.discountValue.toLocaleString("vi-VN")}đ`}
                                    </td>
                                    <td className="p-3 text-[#565959]">{formatDate(voucher.validFrom)} - {formatDate(voucher.validTo)}</td>
                                    <td className="p-3">
                                        <span className="rounded-full border border-[#D5D9D9] px-2 py-1 text-[11px] font-bold">
                                            {statusLabel(voucher.status)}
                                        </span>
                                        {voucher.rejectionReason ? (
                                            <div className="mt-1 text-[12px] text-[#C62828]">{voucher.rejectionReason}</div>
                                        ) : null}
                                    </td>
                                    <td className="p-3 text-right">
                                        {["DRAFT", "REJECTED"].includes(voucher.status) ? (
                                            <button
                                                type="button"
                                                onClick={() => handleSubmitReview(voucher.voucherId)}
                                                disabled={actionId === voucher.voucherId}
                                                className="inline-flex items-center gap-1 rounded-lg border border-[#007185] px-3 py-1.5 text-[12px] font-bold text-[#007185] hover:bg-[#F0F8FF]"
                                            >
                                                {actionId === voucher.voucherId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                                                Gửi duyệt
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                            {vouchers.length === 0 ? (
                                <tr>
                                    <td className="p-6 text-center text-[#565959]" colSpan={5}>Chưa có voucher nào.</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

