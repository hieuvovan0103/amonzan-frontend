"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Check, Loader2, TicketPercent, X } from "lucide-react";
import {
    approveAdminVoucher,
    createAdminVoucher,
    getAdminVouchers,
    rejectAdminVoucher,
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

export default function VouchersPage() {
    const [vouchers, setVouchers] = useState<ManagedVoucher[]>([]);
    const [status, setStatus] = useState("ALL");
    const [scope, setScope] = useState("ALL");
    const [form, setForm] = useState(initialForm);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);
    const [message, setMessage] = useState("");

    const loadVouchers = useCallback(async () => {
        setIsLoading(true);
        setMessage("");
        try {
            setVouchers(await getAdminVouchers({ status, scope }));
        } catch (error: unknown) {
            setMessage(getErrorMessage(error, "Không thể tải voucher."));
        } finally {
            setIsLoading(false);
        }
    }, [scope, status]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadVouchers();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [loadVouchers]);

    const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);
        setMessage("");

        try {
            await createAdminVoucher(buildPayload(form));
            setForm(initialForm);
            setMessage("Đã tạo voucher toàn sàn.");
            await loadVouchers();
        } catch (error: unknown) {
            setMessage(getErrorMessage(error, "Không thể tạo voucher."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleApprove = async (voucherId: string) => {
        setActionId(voucherId);
        try {
            await approveAdminVoucher(voucherId);
            await loadVouchers();
        } catch (error: unknown) {
            setMessage(getErrorMessage(error, "Không thể duyệt voucher."));
        } finally {
            setActionId(null);
        }
    };

    const handleReject = async (voucherId: string) => {
        const reason = window.prompt("Lý do từ chối voucher?");
        if (!reason?.trim()) return;

        setActionId(voucherId);
        try {
            await rejectAdminVoucher(voucherId, reason);
            await loadVouchers();
        } catch (error: unknown) {
            setMessage(getErrorMessage(error, "Không thể từ chối voucher."));
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="animate-in slide-in-from-bottom-4 p-6 duration-500">
            <div className="mb-6 flex items-start gap-3">
                <TicketPercent className="mt-1 h-6 w-6 text-[#FF9900]" />
                <div>
                    <h2 className="text-[20px] font-bold text-[#222222]">Quản lý voucher</h2>
                    <p className="mt-1 text-[13px] text-[#565959]">
                        Admin tạo voucher toàn sàn và duyệt voucher do shop gửi lên.
                    </p>
                </div>
            </div>

            <section className="mb-6 rounded-2xl border border-[#E6E6E6] bg-white p-5 shadow-sm">
                <h3 className="mb-3 text-[15px] font-bold text-[#222222]">Tạo voucher toàn sàn</h3>
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
                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        Tạo voucher
                    </button>
                </form>
                {message ? <p className="mt-3 text-[13px] font-semibold text-[#007185]">{message}</p> : null}
            </section>

            <div className="mb-4 flex flex-wrap gap-2">
                <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="rounded-lg border border-[#D5D9D9] bg-white px-3 py-2 text-[13px]"
                >
                    <option value="ALL">Tất cả trạng thái</option>
                    <option value="PENDING_REVIEW">Chờ duyệt</option>
                    <option value="APPROVED">Đã duyệt</option>
                    <option value="REJECTED">Bị từ chối</option>
                    <option value="DRAFT">Bản nháp</option>
                </select>
                <select
                    value={scope}
                    onChange={(event) => setScope(event.target.value)}
                    className="rounded-lg border border-[#D5D9D9] bg-white px-3 py-2 text-[13px]"
                >
                    <option value="ALL">Tất cả phạm vi</option>
                    <option value="PLATFORM">Toàn sàn</option>
                    <option value="SHOP">Theo shop</option>
                </select>
            </div>

            <section className="overflow-hidden rounded-2xl border border-[#E6E6E6] bg-white shadow-sm">
                {isLoading ? (
                    <div className="flex min-h-[220px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                    </div>
                ) : (
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#F7F7F7] text-[#565959]">
                            <tr>
                                <th className="p-3">Mã</th>
                                <th className="p-3">Phạm vi</th>
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
                                    <td className="p-3">{voucher.scope === "SHOP" ? voucher.shopName || "Shop" : "Toàn sàn"}</td>
                                    <td className="p-3">
                                        {voucher.discountType === "PERCENTAGE" ? `${voucher.discountValue}%` : `${voucher.discountValue.toLocaleString("vi-VN")}đ`}
                                    </td>
                                    <td className="p-3 text-[#565959]">{formatDate(voucher.validFrom)} - {formatDate(voucher.validTo)}</td>
                                    <td className="p-3">
                                        <span className="rounded-full border border-[#D5D9D9] px-2 py-1 text-[11px] font-bold">
                                            {voucher.status}
                                        </span>
                                        {voucher.rejectionReason ? <div className="mt-1 text-[12px] text-[#C62828]">{voucher.rejectionReason}</div> : null}
                                    </td>
                                    <td className="p-3 text-right">
                                        {voucher.status === "PENDING_REVIEW" ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleApprove(voucher.voucherId)}
                                                    disabled={actionId === voucher.voucherId}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-[#0F7B0F] px-3 py-1.5 text-[12px] font-bold text-[#0F7B0F] hover:bg-[#F0FFF4]"
                                                >
                                                    <Check className="h-3.5 w-3.5" />
                                                    Duyệt
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleReject(voucher.voucherId)}
                                                    disabled={actionId === voucher.voucherId}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-[#C62828] px-3 py-1.5 text-[12px] font-bold text-[#C62828] hover:bg-[#FFF5F5]"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                    Từ chối
                                                </button>
                                            </div>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                            {vouchers.length === 0 ? (
                                <tr>
                                    <td className="p-6 text-center text-[#565959]" colSpan={6}>Chưa có voucher phù hợp.</td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

