"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/app/utils/formatPrice";
import { useAuthStore } from "@/stores/useAuthStore";

type CartSummaryProps = {
    selectedCount: number;
    subtotal: number;
    hasStockIssues?: boolean;
};

export default function CartSummary({
    selectedCount,
    subtotal,
    hasStockIssues = false,
}: CartSummaryProps) {
    const router = useRouter();
    const { user } = useAuthStore();

    const handleCheckout = () => {
        if (!user) {
            router.push("/signup");
            return;
        }

        if (!hasStockIssues) {
            router.push("/checkout");
        }
    };

    return (
        <div className="w-full flex-shrink-0 lg:w-[320px]">
            <div className="sticky top-[90px] rounded-[6px] border border-[#E6E6E6] bg-white p-6 shadow-sm">
                <div className="mb-6 text-[18px] leading-[1.3] text-[#222222]">
                    Tạm tính ({selectedCount} sản phẩm):{" "}
                    <br className="hidden lg:block" />
                    <span className="text-[20px] font-bold">
                        {formatPrice(subtotal)} VNĐ
                    </span>
                </div>

                <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={selectedCount === 0 || hasStockIssues}
                    className="w-full rounded-[4px] border border-[#F0C14B] bg-[#FFD814] py-3 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-[#F0C14B] disabled:cursor-not-allowed disabled:border-[#E6E6E6] disabled:bg-[#F7F7F7] disabled:text-[#6B7280]"
                >
                    Tiến hành thanh toán
                </button>

                {hasStockIssues && (
                    <p className="mt-3 text-[13px] leading-5 text-[#842029]">
                        Có sản phẩm đã hết hàng, không đủ số lượng hoặc không khả dụng trong thời gian đã chọn. Vui lòng xóa hoặc điều chỉnh trước khi thanh toán.
                    </p>
                )}
            </div>
        </div>
    );
}
