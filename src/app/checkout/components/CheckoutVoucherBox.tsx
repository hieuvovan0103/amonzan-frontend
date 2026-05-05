import { Tag } from "lucide-react";
import { formatPrice } from "./checkout-data";

type CheckoutVoucherBoxProps = {
    voucherCode: string;
    voucherMessage: string;
    discount: number;
    onChangeVoucherCode: (value: string) => void;
    onApplyVoucher: (event: React.FormEvent<HTMLFormElement>) => void;
};

export default function CheckoutVoucherBox({
    voucherCode,
    voucherMessage,
    discount,
    onChangeVoucherCode,
    onApplyVoucher,
}: CheckoutVoucherBoxProps) {
    return (
        <section className="mb-4 rounded-md border border-[#D5D9D9] bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
                <Tag className="h-5 w-5 text-[#565959]" />

                <h2 className="text-[15px] font-bold text-[#222222]">
                    Mã giảm giá
                </h2>
            </div>

            <form onSubmit={onApplyVoucher} className="flex gap-2">
                <input
                    value={voucherCode}
                    onChange={(event) => onChangeVoucherCode(event.target.value)}
                    placeholder="Nhập mã"
                    className="min-w-0 flex-1 rounded-md border border-[#D5D9D9] px-3 py-2 text-[13px] text-[#222222] outline-none focus:ring-2 focus:ring-[#FF9900]/40"
                />

                <button
                    type="submit"
                    className="rounded-md border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-bold text-[#222222] hover:bg-[#F7F7F7]"
                >
                    Áp dụng
                </button>
            </form>

            {voucherMessage && (
                <p
                    className={[
                        "mt-2 text-[12px]",
                        discount > 0 ? "text-[#007600]" : "text-[#C62828]",
                    ].join(" ")}
                >
                    {voucherMessage}
                </p>
            )}

            {discount > 0 && (
                <p className="mt-1 text-[12px] font-bold text-[#007600]">
                    Đã giảm {formatPrice(discount)}đ
                </p>
            )}
        </section>
    );
}
