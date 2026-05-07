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
        <div className="mb-8 flex min-w-0 flex-col gap-4 rounded-[8px] border border-[#F0C14B] bg-gradient-to-r from-[#FFF8E1] to-[#FFF3CD] p-4 shadow-[0_4px_12px_rgba(255,153,0,0.08)] sm:mb-10 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:p-6">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div className="w-12 h-12 bg-[#FF9900] text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                    <Store className="w-6 h-6" />
                </div>

                <div className="min-w-0">
                    <h3 className="mb-1.5 flex min-w-0 items-center gap-2 text-[16px] font-bold leading-snug text-[#222222] sm:text-[18px]">
                        Trở thành đối tác cho thuê
                        <Sparkles className="w-4 h-4 flex-shrink-0 text-[#E47911]" />
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
                            Được bảo vệ bởi quy trình thuê minh bạch
                        </li>
                    </ul>
                </div>
            </div>

            <button
                onClick={() => router.push('/vendor/register')}
                className="flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-[4px] border border-[#F0C14B] bg-[#FFD814] px-5 py-3 text-[14px] font-bold text-[#111111] shadow-sm transition-colors hover:bg-[#F0C14B] sm:w-auto"
            >
                Đăng ký gian hàng
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
