import Link from "next/link";
import type { CartItem } from "@/types/cart";
import type { CartStockIssue } from "@/lib/cart-stock";
import {
    formatPrice,
    getItemRentTotal,
    getRentalDays,
} from "./checkout-data";

type CheckoutItemCardProps = {
    item: CartItem;
    stockIssue?: CartStockIssue;
    onUpdateQuantity: (id: string, quantity: number) => void;
};

export default function CheckoutItemCard({
    item,
    stockIssue,
    onUpdateQuantity,
}: CheckoutItemCardProps) {
    const rentalDays = getRentalDays(item);
    const totalRent = getItemRentTotal(item);

    return (
        <article className="flex flex-col gap-4 p-4 sm:flex-row">
            <Link
                href={`/products/${item.slug}`}
                className="h-[100px] w-[100px] flex-shrink-0 overflow-hidden rounded-md border border-[#E6E6E6] bg-[#F7F7F7]"
            >
                <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover mix-blend-multiply"
                />
            </Link>

            <div className="flex-1">
                <Link
                    href={`/products/${item.slug}`}
                    className="mb-1 line-clamp-2 text-[14px] font-bold leading-[1.4] text-[#222222] hover:text-[#007185]"
                >
                    {item.title}
                </Link>

                <p className="mb-2 text-[12px] font-medium text-[#007185]">
                    Shop: {item.shopName || "Amonzan Vendor"}
                </p>

                {stockIssue && (
                    <div className="mb-3 rounded-md border border-[#F5C2C7] bg-[#FFF5F5] px-3 py-2 text-[13px] font-semibold text-[#842029]">
                        {stockIssue.message}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-4 text-[13px] sm:grid-cols-2">
                    <div>
                        <div className="mb-1">
                            <span className="text-[#565959]">Thời gian thuê:</span>{" "}
                            <span className="font-bold text-[#222222]">
                                {item.rentDatesLabel || item.rentDates || `${rentalDays} ngày`}
                            </span>
                        </div>

                        <div className="mb-3">
                            <span className="mb-1 block text-[#565959]">Số lượng:</span>
                            <div className="inline-flex items-center rounded-[4px] border border-[#D5D9D9] bg-[#F7F7F7] shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="h-8 w-8 text-[18px] font-semibold text-[#222222] transition-colors hover:bg-[#E6E6E6] disabled:cursor-not-allowed disabled:text-[#9CA3AF]"
                                    aria-label="Giảm số lượng"
                                >
                                    -
                                </button>
                                <span className="min-w-8 px-2 text-center text-[14px] font-bold text-[#222222]">
                                    {item.quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="h-8 w-8 text-[18px] font-semibold text-[#222222] transition-colors hover:bg-[#E6E6E6]"
                                    aria-label="Tăng số lượng"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {item.size && (
                            <div>
                                <span className="text-[#565959]">Kích thước:</span>{" "}
                                <span className="font-bold text-[#222222]">{item.size}</span>
                            </div>
                        )}
                    </div>

                    <div className="sm:text-right">
                        <div className="mb-1">
                            <span className="text-[#565959]">Giá thuê:</span>{" "}
                            <span className="font-bold text-[#B12704]">
                                {item.pricePerDay}
                            </span>
                            đ/ngày
                        </div>

                        <div className="mb-1">
                            <span className="text-[#565959]">Tổng tiền thuê:</span>{" "}
                            <span className="font-bold text-[#B12704]">
                                {formatPrice(totalRent)}đ
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </article>
    );
}
