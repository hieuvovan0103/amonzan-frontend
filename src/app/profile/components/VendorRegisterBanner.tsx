'use client';

import { useRouter } from 'next/navigation';
import {
    CheckCircle2,
    ChevronRight,
    ShieldCheck,
    Sparkles,
    Store,
} from 'lucide-react';

export default function VendorRegisterBanner() {
    const router = useRouter();

    return (
        <div className="mb-10 bg-gradient-to-r from-[#FFF8E1] to-[#FFF3CD] border border-[#F0C14B] rounded-[16px] p-5 sm:p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-[0_4px_12px_rgba(255,153,0,0.08)]">
            <div className="flex gap-4 items-start">
                <div className="w-12 h-12 bg-[#FF9900] text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Store className="w-6 h-6" />
                </div>

                <div>
                    <h3 className="text-[16px] sm:text-[18px] font-bold text-[#222222] flex items-center gap-2 mb-1.5">
                        Trở thành đối tác cho thuê
                        <Sparkles className="w-4 h-4 text-[#E47911]" />
                    </h3>

                    <p className="text-[13px] text-[#565959] leading-[1.5] max-w-md">
                        Bạn có trang phục, đạo cụ hay thiết bị nhàn rỗi? Mở gian hàng trên
                        Amonzan để tối ưu hóa đồ vật và kiếm thêm thu nhập mỗi tháng.
                    </p>

                    <ul className="mt-3 space-y-1.5 hidden sm:block">
                        <li className="flex items-center gap-2 text-[13px] text-[#222222] font-medium">
                            <CheckCircle2 className="w-4 h-4 text-[#007600]" />
                            Tiếp cận hàng ngàn khách thuê
                        </li>

                        <li className="flex items-center gap-2 text-[13px] text-[#222222] font-medium">
                            <ShieldCheck className="w-4 h-4 text-[#007600]" />
                            Được bảo vệ bởi chính sách cọc an toàn
                        </li>
                    </ul>
                </div>
            </div>

            <button
                onClick={() => router.push('/vendor/register')}
                className="w-full sm:w-auto bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-bold text-[14px] px-6 py-3 rounded-[10px] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
                Đăng ký gian hàng
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}