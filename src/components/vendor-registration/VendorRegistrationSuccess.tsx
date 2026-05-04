"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

type VendorRegistrationSuccessProps = {
    onBackHome: () => void;
};

export default function VendorRegistrationSuccess({
    onBackHome,
}: VendorRegistrationSuccessProps) {
    return (
        <div className="animate-in zoom-in-95 fade-in duration-500 flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-[#E6F4EA] rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#007600]" />
            </div>

            <h2 className="text-[28px] font-bold text-[#222222] mb-3">
                Đã gửi yêu cầu thành công!
            </h2>

            <p className="text-[15px] text-[#565959] max-w-md mx-auto mb-8 leading-relaxed">
                Cảm ơn bạn đã đăng ký trở thành đối tác của Amonzan. Đội ngũ kiểm duyệt
                của chúng tôi sẽ xác minh hồ sơ và phản hồi cho bạn qua email trong vòng{" "}
                <strong>24-48 giờ làm việc</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                    href="/products"
                    className="bg-[#FF9900] hover:bg-[#E47911] text-[#111111] font-bold text-[14px] px-8 py-3 rounded-[8px] transition-colors shadow-sm"
                >
                    Đi đến trang Products
                </Link>
            </div>
        </div>
    );
}