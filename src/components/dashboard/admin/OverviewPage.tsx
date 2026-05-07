"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Clock, Loader2, MessageSquareWarning, ShieldAlert, Store, TrendingUp, Users } from "lucide-react";
import { getAdminOverview, type AdminOverview } from "@/lib/api/adminDashboard";

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export default function OverviewPage() {
    const [overview, setOverview] = useState<AdminOverview | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadOverview = async () => {
            try {
                const data = await getAdminOverview();
                if (isMounted) {
                    setOverview(data);
                    setError("");
                }
            } catch (err: unknown) {
                if (isMounted) {
                    setError(getErrorMessage(err, "Không thể tải tổng quan hệ thống."));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadOverview();
        return () => {
            isMounted = false;
        };
    }, []);

    const metrics = overview?.metrics;
    const kpis = [
        {
            title: "Người dùng toàn hệ thống",
            value: metrics?.totalUsers ?? 0,
            note: "Tài khoản đã tạo hồ sơ",
            icon: Users,
            color: "text-[#007185]",
        },
        {
            title: "Báo cáo đánh giá chờ xử lý",
            value: metrics?.pendingReviewReports ?? 0,
            note: `${metrics?.hiddenReviews ?? 0} đánh giá đã ẩn`,
            icon: MessageSquareWarning,
            color: "text-[#C62828]",
        },
        {
            title: "Tranh chấp đang mở",
            value: metrics?.openDisputes ?? 0,
            note: "Cần admin can thiệp",
            icon: ShieldAlert,
            color: "text-red-600",
        },
        {
            title: "Shop chờ duyệt",
            value: metrics?.vendorRequests ?? 0,
            note: "Hồ sơ vendor pending",
            icon: Store,
            color: "text-[#B12704]",
        },
    ];

    const orderBars = [
        { label: "Đơn active", value: metrics?.activeOrders ?? 0 },
        { label: "Đơn 7 ngày", value: metrics?.recentOrders ?? 0 },
        { label: "Tổng đơn", value: metrics?.totalOrders ?? 0 },
    ];
    const maxOrderValue = Math.max(1, ...orderBars.map((item) => item.value));

    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="mb-6">
                <h1 className="text-[24px] font-bold text-[#222222]">
                    Tổng quan quản trị
                </h1>
                <p className="text-[14px] text-[#565959] mt-1">
                    Thông tin vận hành theo thời gian thực.
                </p>
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
                    Đang tải tổng quan...
                </div>
            ) : null}

            {!isLoading ? (
                <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {kpis.map((kpi) => {
                    const Icon = kpi.icon;
                    return (
                    <div
                        key={kpi.title}
                        className="bg-white p-5 rounded-[12px] border border-[#E6E6E6] shadow-sm flex flex-col justify-between"
                    >
                        <div className="mb-2 flex items-center justify-between gap-3">
                            <div className="text-[13px] font-bold text-[#6B7280]">
                                {kpi.title}
                            </div>
                            <Icon className={`h-5 w-5 ${kpi.color}`} />
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-[24px] font-black text-[#222222]">
                                {kpi.value.toLocaleString("vi-VN")}
                            </span>
                            <span
                                className={`text-[12px] font-bold flex items-center gap-1 ${kpi.color}`}
                            >
                                <TrendingUp className="w-3.5 h-3.5" />
                                {kpi.note}
                            </span>
                        </div>
                    </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-[12px] border border-[#E6E6E6] shadow-sm">
                    <h3 className="text-[16px] font-bold text-[#222222] mb-6">
                        Tình hình đơn thuê
                    </h3>

                    <div className="h-[250px] flex items-end justify-between gap-4 pt-4">
                        {orderBars.map((item) => (
                            <div key={item.label} className="flex-1 flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-[#FF9900]/20 hover:bg-[#FF9900] rounded-t-[6px] relative transition-colors duration-300"
                                    style={{ height: `${Math.max(8, (item.value / maxOrderValue) * 100)}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#232F3E] text-white text-[11px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.value.toLocaleString("vi-VN")} đơn
                                    </div>
                                </div>
                                <span className="text-[12px] text-[#6B7280] font-medium">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[12px] border border-[#E6E6E6] shadow-sm">
                    <h3 className="text-[16px] font-bold text-[#222222] mb-4">
                        Cảnh báo hệ thống
                    </h3>

                    <div className="space-y-4">
                        <div className="p-3 bg-red-50 border border-red-100 rounded-[8px] flex gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                            <div>
                                <div className="text-[13px] font-bold text-red-800">
                                    Báo cáo và tranh chấp
                                </div>
                                <div className="text-[12px] text-red-600 mt-1">
                                    {metrics?.pendingReviewReports ?? 0} báo cáo review và {metrics?.openDisputes ?? 0} tranh chấp đang chờ.
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-orange-50 border border-orange-100 rounded-[8px] flex gap-3">
                            <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                            <div>
                                <div className="text-[13px] font-bold text-orange-800">
                                    Hồ sơ vendor chờ duyệt
                                </div>
                                <div className="text-[12px] text-orange-600 mt-1">
                                    Có {metrics?.vendorRequests ?? 0} shop đang chờ admin kiểm tra hồ sơ.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                </>
            ) : null}
        </div>
    );
}