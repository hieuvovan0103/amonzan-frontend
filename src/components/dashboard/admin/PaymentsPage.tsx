"use client";

import AdminBadge from "@/components/dashboard/admin/AdminBadge";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/apiClient";
import SimplePagination from "@/components/ui/SimplePagination";

type AdminWalletMetrics = {
    heldTotal: number;
    refundTotal: number;
    platformFeeTotal: number;
    generatedAt: string;
};

type AdminWalletTransaction = {
    id: string;
    orderId: string;
    type: "PAYMENT" | "REFUND";
    method: string;
    amount: number;
    status: string;
    escrow: "HELD" | "RELEASED";
    createdAt: string;
    paidAt: string | null;
};

function formatCurrency(value: number) {
    return value.toLocaleString("vi-VN");
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export default function PaymentsPage() {
    const [metrics, setMetrics] = useState<AdminWalletMetrics | null>(null);
    const [transactions, setTransactions] = useState<AdminWalletTransaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const loadData = async () => {
        setIsLoading(true);
        setError("");

        try {
            const [metricsRes, txRes] = await Promise.all([
                fetchWithAuth("/admin/payments/metrics"),
                fetchWithAuth("/admin/payments/transactions?limit=50"),
            ]);

            if (!metricsRes.ok) {
                const data = await metricsRes.json().catch(() => ({}));
                throw new Error(data?.message || "Không thể tải số liệu ví & escrow.");
            }

            if (!txRes.ok) {
                const data = await txRes.json().catch(() => ({}));
                throw new Error(data?.message || "Không thể tải danh sách giao dịch.");
            }

            const metricsPayload = (await metricsRes.json()) as AdminWalletMetrics;
            const txPayload = (await txRes.json()) as { transactions: AdminWalletTransaction[] };
            setMetrics(metricsPayload);
            setTransactions(txPayload.transactions ?? []);
        } catch (err: unknown) {
            setError(getErrorMessage(err, "Không thể tải dữ liệu ví & escrow."));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = window.setTimeout(() => {
            void loadData();
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const summary = useMemo(() => {
        return {
            heldTotal: metrics?.heldTotal ?? 0,
            refundTotal: metrics?.refundTotal ?? 0,
            platformFeeTotal: metrics?.platformFeeTotal ?? 0,
        };
    }, [metrics]);

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setPage(1);
        }, 0);

        return () => window.clearTimeout(timer);
    }, [transactions.length]);

    const totalPages = Math.max(1, Math.ceil(transactions.length / pageSize));
    const pageItems = transactions.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="p-6 animate-in fade-in duration-500">
            {error ? (
                <div className="mb-4 flex items-center gap-2 rounded-[6px] border border-red-100 bg-red-50 px-4 py-3 text-[14px] text-[#C62828]">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-6 rounded-[16px] border border-[#E6E6E6] shadow-sm">
                    <div className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider mb-2">
                        Tổng tiền đang xử lý
                    </div>
                    <div className="text-[26px] font-bold text-[#007185]">
                        {isLoading ? "..." : `${formatCurrency(summary.heldTotal)} ₫`}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[16px] border border-[#E6E6E6] shadow-sm">
                    <div className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider mb-2">
                        Tổng hoàn tiền
                    </div>
                    <div className="text-[26px] font-bold text-orange-600">
                        {isLoading ? "..." : `${formatCurrency(summary.refundTotal)} ₫`}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-[#232F3E] to-[#111111] text-white p-6 rounded-[16px] border border-[#E6E6E6] shadow-sm">
                    <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                        Doanh thu phí sàn
                    </div>
                    <div className="text-[26px] font-bold">
                        {isLoading ? "..." : `${formatCurrency(summary.platformFeeTotal)} ₫`}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[12px] border border-[#E6E6E6] overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="p-10 text-center text-[14px] text-[#565959]">
                        <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin" />
                        Đang tải giao dịch...
                    </div>
                ) : (
                    <table className="w-full text-left text-[13px]">
                        <thead className="bg-[#F7F7F7] border-b border-[#E6E6E6] text-[#565959]">
                            <tr>
                                <th className="p-4 font-semibold">ID giao dịch</th>
                                <th className="p-4 font-semibold">Đơn hàng</th>
                                <th className="p-4 font-semibold">Loại giao dịch</th>
                                <th className="p-4 font-semibold">Phương thức</th>
                                <th className="p-4 font-semibold">Số tiền</th>
                                <th className="p-4 text-center font-semibold">Escrow</th>
                            </tr>
                        </thead>

                        <tbody>
                            {pageItems.map((t) => (
                                <tr
                                    key={t.id}
                                    className="border-b border-[#E6E6E6] hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-4 font-medium text-[#222222]">{t.id.slice(0, 8)}</td>
                                    <td className="p-4 text-[#007185] font-medium">
                                        {t.orderId.slice(0, 8)}
                                    </td>
                                    <td className="p-4">
                                        <span className="font-semibold text-[#222222]">
                                            {t.type === "REFUND" ? "Hoàn tiền" : "Thanh toán"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[#6B7280]">{t.method}</td>
                                    <td
                                        className={`p-4 font-bold ${
                                            t.type === "REFUND" ? "text-red-600" : "text-[#222222]"
                                        }`}
                                    >
                                        {t.type === "REFUND" ? "-" : ""}
                                        {formatCurrency(t.amount)} ₫
                                    </td>
                                    <td className="p-4 text-center">
                                        <AdminBadge status={t.escrow} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {!isLoading && transactions.length > 0 ? (
                <SimplePagination
                    page={Math.min(page, totalPages)}
                    totalPages={totalPages}
                    onPageChange={(next) => setPage(Math.min(Math.max(1, next), totalPages))}
                />
            ) : null}
        </div>
    );
}
