import { AlertTriangle, Clock, TrendingUp } from "lucide-react";

export default function OverviewPage() {
    const chartData = [40, 65, 45, 80, 55, 90, 75];
    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                    {
                        title: "Doanh thu phí sàn (tuần)",
                        value: "12.4M ₫",
                        trend: "+15%",
                        color: "text-green-600",
                    },
                    {
                        title: "Đơn thuê đang hoạt động",
                        value: "1,284",
                        trend: "+5%",
                        color: "text-purple-600",
                    },
                    {
                        title: "Tranh chấp chờ xử lý",
                        value: "12",
                        trend: "-2%",
                        color: "text-red-600",
                    },
                    {
                        title: "Shop mới đăng ký",
                        value: "45",
                        trend: "+10%",
                        color: "text-[#007185]",
                    },
                ].map((kpi, idx) => (
                    <div
                        key={idx}
                        className="bg-white p-5 rounded-[12px] border border-[#E6E6E6] shadow-sm flex flex-col justify-between"
                    >
                        <div className="text-[13px] font-bold text-[#6B7280] mb-2">
                            {kpi.title}
                        </div>
                        <div className="flex items-end justify-between">
                            <span className="text-[24px] font-black text-[#222222]">
                                {kpi.value}
                            </span>
                            <span
                                className={`text-[12px] font-bold flex items-center gap-1 ${kpi.color}`}
                            >
                                <TrendingUp className="w-3.5 h-3.5" />
                                {kpi.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-[12px] border border-[#E6E6E6] shadow-sm">
                    <h3 className="text-[16px] font-bold text-[#222222] mb-6">
                        Biểu đồ giao dịch 7 ngày qua
                    </h3>

                    <div className="h-[250px] flex items-end justify-between gap-2 pt-4">
                        {chartData.map((val, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                <div
                                    className="w-full bg-[#FF9900]/20 hover:bg-[#FF9900] rounded-t-[6px] relative transition-colors duration-300"
                                    style={{ height: `${val}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#232F3E] text-white text-[11px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        {val}0 đơn
                                    </div>
                                </div>
                                <span className="text-[12px] text-[#6B7280] font-medium">
                                    {days[i]}
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
                                    Tỷ lệ tranh chấp tăng
                                </div>
                                <div className="text-[12px] text-red-600 mt-1">
                                    Hệ thống ghi nhận tỷ lệ báo hỏng đồ tăng ở nhóm cosplay.
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-orange-50 border border-orange-100 rounded-[8px] flex gap-3">
                            <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                            <div>
                                <div className="text-[13px] font-bold text-orange-800">
                                    Tồn đọng rút tiền
                                </div>
                                <div className="text-[12px] text-orange-600 mt-1">
                                    Có 24 yêu cầu rút tiền của shop đang chờ duyệt quá 24 giờ.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}