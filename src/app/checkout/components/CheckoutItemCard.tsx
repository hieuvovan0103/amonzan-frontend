import Link from "next/link";
import type { CartItem } from "@/types/cart";
import type { CartStockIssue } from "@/lib/cart-stock";
import {
    formatPrice,
    getItemDepositTotal,
    getItemRentTotal,
    getRentalDays,
} from "./checkout-data";

type CheckoutItemCardProps = {
    item: CartItem;
    stockIssue?: CartStockIssue;
};

export default function CheckoutItemCard({ item, stockIssue }: CheckoutItemCardProps) {
    const rentalDays = getRentalDays(item);
    const totalRent = getItemRentTotal(item);
    const totalDeposit = getItemDepositTotal(item);

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

                        <div className="mb-1">
                            <span className="text-[#565959]">Số lượng:</span>{" "}
                            <span className="font-bold text-[#222222]">{item.quantity}</span>
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

                        <div>
                            <span className="text-[#565959]">Tiền cọc:</span>{" "}
                            <span className="font-bold text-[#B12704]">
                                {formatPrice(totalDeposit)}đ
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
