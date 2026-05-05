import { AlertTriangle } from "lucide-react";
import type { CartItem } from "@/types/cart";
import type { CartStockIssue } from "@/lib/cart-stock";
import CheckoutItemCard from "./CheckoutItemCard";
import { formatPrice } from "./checkout-data";

type CheckoutItemsSectionProps = {
    items: CartItem[];
    totalDeposit: number;
    stockIssues?: CartStockIssue[];
};

export default function CheckoutItemsSection({
    items,
    totalDeposit,
    stockIssues = [],
}: CheckoutItemsSectionProps) {
    return (
        <section className="overflow-hidden rounded-md border border-[#D5D9D9] bg-white shadow-sm">
            <div className="p-4 md:p-5">
                <div className="mb-4 flex gap-4">
                    <span className="text-[18px] font-bold text-[#222222]">3</span>

                    <h2 className="text-[18px] font-bold text-[#222222]">
                        Kiểm tra lại sản phẩm và thời gian thuê
                    </h2>
                </div>

                <div className="ml-7 space-y-5 md:ml-8">
                    <div className="flex items-start gap-3 rounded-md border border-[#F0C14B] bg-[#FFF8E1] p-3">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#E47911]" />

                        <p className="text-[13px] leading-[1.5] text-[#222222]">
                            <span className="font-bold">Lưu ý về tiền cọc:</span> Tổng đơn
                            hàng có thể bao gồm tiền cọc an toàn cho sản phẩm giá trị cao. Số
                            tiền cọc này{" "}
                            <strong className="text-[#C62828]">
                                ({formatPrice(totalDeposit)}đ)
                            </strong>{" "}
                            sẽ được hoàn trả sau khi bạn trả đồ đúng hạn và không có hư hỏng.
                        </p>
                    </div>

                    <div className="divide-y divide-[#E6E6E6] rounded-md border border-[#D5D9D9]">
                        {items.map((item) => (
                            <CheckoutItemCard
                                key={item.id}
                                item={item}
                                stockIssue={stockIssues.find((issue) => issue.itemId === item.id)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
