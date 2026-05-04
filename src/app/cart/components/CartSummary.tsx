"use client";

import { formatPrice } from '@/app/utils/formatPrice';
import { useAuthStore } from '@/stores/useAuthStore';

type CartSummaryProps = {
    selectedCount: number;
    subtotal: number;
};

export default function CartSummary({
    selectedCount,
    subtotal,
}: CartSummaryProps) {
    const { user } = useAuthStore();

    const handleCheckout = () => {
        if (!user) {
            window.location.href = "/signup";
            return;
        }
        // TODO: Proceed to checkout
        alert("Đang chuyển sang trang thanh toán...");
    };

    return (
        <div className="w-full lg:w-[320px] flex-shrink-0">
            <div className="bg-[#FFFFFF] rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 sticky top-[90px]">
                <div className="text-[18px] text-[#222222] mb-6 leading-[1.3]">
                    Tạm tính ({selectedCount} sản phẩm):{' '}
                    <br className="hidden lg:block" />
                    <span className="font-bold text-[20px]">
                        {formatPrice(subtotal)} VNĐ
                    </span>
                </div>

                <button
                    onClick={handleCheckout}
                    disabled={selectedCount === 0}
                    className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] disabled:bg-[#F7F7F7] disabled:border-[#E6E6E6] disabled:text-[#6B7280] disabled:cursor-not-allowed text-[#111111] font-semibold text-[14px] py-3 rounded-[999px] transition-colors shadow-sm"
                >
                    Tiến hành thanh toán
                </button>
            </div>
        </div>
    );
}