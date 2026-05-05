import { Info, ShieldCheck } from "lucide-react";
import { formatPrice, getPaymentMethodLabel } from "./checkout-data";

type CheckoutSummaryProps = {
    totalRentFee: number;
    totalDeposit: number;
    shippingFee: number;
    discount: number;
    finalTotal: number;
    selectedPayment: string;
    isPlacingOrder?: boolean;
    unavailableMessage?: string;
    onPlaceOrder: () => void;
};

export default function CheckoutSummary({
    totalRentFee,
    totalDeposit,
    shippingFee,
    discount,
    finalTotal,
    selectedPayment,
    isPlacingOrder = false,
    unavailableMessage,
    onPlaceOrder,
}: CheckoutSummaryProps) {
    return (
        <section className="rounded-md border border-[#D5D9D9] bg-white p-4 shadow-sm">
            {unavailableMessage && (
                <div className="mb-4 rounded-md border border-[#F5C2C7] bg-[#FFF5F5] p-3 text-[13px] font-semibold leading-5 text-[#842029]">
                    {unavailableMessage}
                </div>
            )}

            <button
                type="button"
                onClick={onPlaceOrder}
                disabled={isPlacingOrder || Boolean(unavailableMessage)}
                className="mb-4 w-full rounded-[999px] border border-[#F0C14B] bg-[#FFD814] py-3 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-[#F0C14B] disabled:cursor-not-allowed disabled:border-[#E6E6E6] disabled:bg-[#F7F7F7] disabled:text-[#6B7280]"
            >
                {isPlacingOrder ? "Đang tạo đơn thuê..." : "Đặt thuê và thanh toán"}
            </button>

            <p className="mb-4 flex items-start gap-2 text-[12px] leading-5 text-[#565959]">
                <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#007600]" />
                Giao dịch được bảo vệ. Amonzan sẽ ghi nhận đơn thuê, tiền cọc và trạng
                thái thanh toán.
            </p>

            <div className="border-t border-[#E6E6E6] pt-4">
                <h2 className="mb-3 text-[18px] font-bold text-[#222222]">
                    Tóm tắt đơn hàng
                </h2>

                <div className="space-y-2 text-[14px]">
                    <SummaryRow
                        label="Tổng tiền thuê"
                        value={`${formatPrice(totalRentFee)}đ`}
                    />

                    <SummaryRow
                        label="Tổng tiền cọc"
                        value={`${formatPrice(totalDeposit)}đ`}
                    />

                    <SummaryRow
                        label="Phí vận chuyển"
                        value={`${formatPrice(shippingFee)}đ`}
                    />

                    {discount > 0 && (
                        <SummaryRow
                            label="Giảm giá"
                            value={`- ${formatPrice(discount)}đ`}
                            valueClassName="text-[#007600]"
                        />
                    )}
                </div>

                <div className="mt-4 border-t border-[#E6E6E6] pt-4">
                    <div className="flex items-start justify-between gap-4">
                        <span className="text-[16px] font-bold text-[#222222]">
                            Tổng thanh toán
                        </span>

                        <span className="text-right text-[22px] font-bold text-[#B12704]">
                            {formatPrice(finalTotal)}đ
                        </span>
                    </div>

                    <p className="mt-2 flex items-start gap-1.5 text-[12px] leading-5 text-[#565959]">
                        <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                        Phương thức đã chọn:{" "}
                        <span className="font-bold">{getPaymentMethodLabel(selectedPayment)}</span>
                    </p>
                </div>
            </div>
        </section>
    );
}

function SummaryRow({
    label,
    value,
    valueClassName = "text-[#222222]",
}: {
    label: string;
    value: string;
    valueClassName?: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4">
            <span className="text-[#565959]">{label}</span>
            <span className={`font-medium ${valueClassName}`}>{value}</span>
        </div>
    );
}
