"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, Search, ShieldCheck, UserCog } from "lucide-react";
import {
    getAdminAccounts,
    type AdminAccount,
    updateAdminAccountRoles,
} from "@/lib/api/adminAccounts";
import SimplePagination from "@/components/ui/SimplePagination";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

function roleLabel(role: string) {
    const labels: Record<string, string> = {
        ADMIN: "Admin",
        SHOP_OWNER: "Shop",
        VENDOR: "Vendor",
        RENTER: "Người thuê",
    };

    return labels[role] ?? role;
}

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<AdminAccount[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [keyword, setKeyword] = useState("");
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [busyId, setBusyId] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const loadAccounts = async () => {
        setIsLoading(true);
        setError("");

        try {
            const data = await getAdminAccounts();
            setAccounts(data.accounts);
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không thể tải danh sách tài khoản."));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            loadAccounts();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const filteredAccounts = useMemo(() => {
        const normalizedKeyword = keyword.trim().toLowerCase();
        return accounts.filter((account) => {
            if (roleFilter !== "ALL" && !account.roles.includes(roleFilter)) return false;
            if (!normalizedKeyword) return true;

            return [
                account.fullName,
                account.email,
                account.phoneNumber,
                account.userId,
                account.shopName,
            ]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(normalizedKeyword));
        });
    }, [accounts, keyword, roleFilter]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setPage(1);
        }, 0);

        return () => window.clearTimeout(timer);
    }, [keyword, roleFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredAccounts.length / pageSize));
    const pageItems = filteredAccounts.slice((page - 1) * pageSize, page * pageSize);

    const handleToggleRole = async (account: AdminAccount, role: "RENTER" | "SHOP_OWNER") => {
        if (account.isAdmin) return;
        const nextRoles = account.roles.includes(role)
            ? account.roles.filter((item) => item !== role && item !== "ADMIN")
            : [...account.roles.filter((item) => item !== "ADMIN"), role];

        setBusyId(account.userId);
        setError("");

        try {
            await updateAdminAccountRoles(account.userId, nextRoles.filter((item) => ["RENTER", "SHOP_OWNER"].includes(item)));
            await loadAccounts();
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không thể cập nhật quyền tài khoản."));
        } finally {
            setBusyId(null);
        }
    };

    return (
        <div className="animate-in fade-in duration-500 p-6">
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 className="text-[20px] font-bold text-[#222222]">
                        Quản lý tài khoản & phân quyền
                    </h2>
                    <p className="text-[14px] text-[#565959] mt-1">
                        Quản lý shop, người thuê và kiểm soát rủi ro nền tảng.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                        value={roleFilter}
                        onChange={(event) => setRoleFilter(event.target.value)}
                        className="rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] outline-none focus:border-[#007185]"
                    >
                        <option value="ALL">Tất cả vai trò</option>
                        <option value="ADMIN">Admin</option>
                        <option value="SHOP_OWNER">Shop</option>
                        <option value="RENTER">Người thuê</option>
                    </select>
                    <div className="relative">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(event) => setKeyword(event.target.value)}
                        placeholder="Tìm tên, email, số điện thoại..."
                        className="w-[250px] border border-[#D5D9D9] rounded-[8px] pl-9 pr-3 py-2 text-[13px] outline-none focus:border-[#007185]"
                    />
                    <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                </div>
            </div>

            {error ? (
                <div className="mb-4 flex items-center gap-2 rounded-[6px] border border-red-100 bg-red-50 px-4 py-3 text-[14px] text-[#C62828]">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                </div>
            ) : null}

            {isLoading ? (
                <div className="rounded-[12px] border border-[#E6E6E6] bg-white p-10 text-center text-[14px] text-[#565959]">
                    <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                    Đang tải tài khoản...
                </div>
            ) : null}

            {!isLoading ? (
            <div className="bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden shadow-sm">
                <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#F7F7F7] border-b border-[#E6E6E6] text-[#565959]">
                        <tr>
                            <th className="p-4 font-semibold">Tên tài khoản</th>
                            <th className="p-4 font-semibold">Vai trò</th>
                            <th className="p-4 font-semibold">Shop/Renter</th>
                            <th className="p-4 font-semibold text-center">Xác minh</th>
                            <th className="p-4 font-semibold">Phân quyền</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pageItems.map((account) => (
                            <tr
                                key={account.userId}
                                className="border-b border-[#E6E6E6] hover:bg-[#F9FAFB] transition-colors"
                            >
                                <td className="p-4">
                                    <div className="font-bold text-[#007185] hover:underline cursor-pointer">
                                        {account.fullName}
                                    </div>
                                    <div className="text-[11px] text-[#6B7280]">
                                        {account.email ?? "Không có email"}
                                    </div>
                                    <div className="text-[11px] text-[#6B7280]">
                                        Tham gia: {formatDate(account.joinedAt)}
                                    </div>
                                </td>

                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1.5">
                                        {account.roles.map((role) => (
                                            <span
                                                key={role}
                                                className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                    role === "ADMIN"
                                                        ? "bg-[#232F3E] text-white"
                                                        : "bg-[#E6F4EA] text-[#137333]"
                                                }`}
                                            >
                                                {roleLabel(role)}
                                            </span>
                                        ))}
                                    </div>
                                </td>

                                <td className="p-4">
                                    <div className="font-bold text-[#222222]">
                                        {account.shopName || "Chưa có shop"}
                                    </div>
                                    <div className="text-[11px] text-[#6B7280]">
                                        Shop: {account.shopStatus ?? "N/A"} · Renter: {account.renterStatus ?? "N/A"}
                                    </div>
                                    <div className="text-[11px] text-[#B12704]">
                                        Điểm phạt: {account.penaltyPoints}
                                    </div>
                                </td>

                                <td className="p-4 text-center">
                                    <div className="inline-flex flex-col gap-1 text-[11px] font-bold">
                                        <span className={account.isEmailVerified ? "text-[#137333]" : "text-[#842029]"}>
                                            Email {account.isEmailVerified ? "đã xác minh" : "chưa xác minh"}
                                        </span>
                                        <span className={account.isPhoneVerified ? "text-[#137333]" : "text-[#842029]"}>
                                            SĐT {account.isPhoneVerified ? "đã xác minh" : "chưa xác minh"}
                                        </span>
                                    </div>
                                </td>

                                <td className="p-4">
                                    {account.isAdmin ? (
                                        <div className="flex items-center gap-2 rounded-[6px] border border-[#FFE4A3] bg-[#FFF8E1] px-3 py-2 text-[12px] font-semibold text-[#8A5A00]">
                                            <ShieldCheck className="h-4 w-4" />
                                            Quyền ADMIN chỉ quản lý trong Supabase.
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2">
                                            {(["RENTER", "SHOP_OWNER"] as const).map((role) => (
                                                <button
                                                    key={role}
                                                    type="button"
                                                    disabled={busyId === account.userId}
                                                    onClick={() => handleToggleRole(account, role)}
                                                    className={`inline-flex items-center gap-1 rounded-[6px] border px-3 py-2 text-[12px] font-bold disabled:cursor-not-allowed disabled:opacity-50 ${
                                                        account.roles.includes(role)
                                                            ? "border-[#0F7B0F] bg-[#F1FFF4] text-[#0F7B0F]"
                                                            : "border-[#D5D9D9] bg-white text-[#565959] hover:bg-[#F7F7F7]"
                                                    }`}
                                                >
                                                    <UserCog className="h-4 w-4" />
                                                    {roleLabel(role)}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            ) : null}

            {!isLoading ? (
                <SimplePagination
                    page={Math.min(page, totalPages)}
                    totalPages={totalPages}
                    onPageChange={(next) => setPage(Math.min(Math.max(1, next), totalPages))}
                />
            ) : null}
        </div>
    );
}