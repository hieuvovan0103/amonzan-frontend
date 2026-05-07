import type { CartItem } from "@/types/cart";
import type { CartStockIssue } from "@/lib/cart-stock";
import CheckoutItemCard from "./CheckoutItemCard";

type CheckoutItemsSectionProps = {
    items: CartItem[];
    stockIssues?: CartStockIssue[];
    onUpdateQuantity: (id: string, quantity: number) => void;
};

export default function CheckoutItemsSection({
    items,
    stockIssues = [],
    onUpdateQuantity,
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
                    <div className="divide-y divide-[#E6E6E6] rounded-md border border-[#D5D9D9]">
                        {items.map((item) => (
                            <CheckoutItemCard
                                key={item.id}
                                item={item}
                                stockIssue={stockIssues.find((issue) => issue.itemId === item.id)}
                                onUpdateQuantity={onUpdateQuantity}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
