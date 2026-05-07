"use client";

import Link from "next/link";
import { ChevronRight, Flag } from "lucide-react";
import { formatPrice } from "@/app/utils/formatPrice";
import DatePickerField from "@/components/ui/DatePickerField";
import StarRating from "./StarRating";
import type {
    ProductAvailability,
    ProductDetail,
    ProductSizeOption,
} from "@/lib/api/products";
import { calculateRentalDays } from "@/lib/rental-days";

type ProductInfoProps = {
    product: ProductDetail;
    selectedSize?: ProductSizeOption;
    onSelectSize: (size: ProductSizeOption) => void;
    rentalStart: string;
    rentalEnd: string;
    onRentalStartChange: (value: string) => void;
    onRentalEndChange: (value: string) => void;
    availability?: ProductAvailability | null;
    isCheckingAvailability?: boolean;
};

export default function ProductInfo({
    product,
    selectedSize,
    onSelectSize,
    rentalStart,
    rentalEnd,
    onRentalStartChange,
    onRentalEndChange,
    availability,
    isCheckingAvailability = false,
}: ProductInfoProps) {
    const currentYear = new Date().getFullYear();
    const today = new Date().toISOString().slice(0, 10);
    const minRentalEnd = rentalStart
        ? new Date(new Date(`${rentalStart}T00:00:00.000Z`).getTime() + 86_400_000)
            .toISOString()
            .slice(0, 10)
        : today;
    const displaySizeOptions = product.availableSizes.filter(
        (size) => size.name.trim().toLowerCase() !== "mặc định",
    );
    const selectedPriceValue = selectedSize?.priceValue ?? product.priceValue;
    const rentalDays = calculateRentalDays(rentalStart, rentalEnd);
    const displayedPrice = rentalDays > 0
        ? formatPrice(selectedPriceValue * rentalDays)
        : formatPrice(selectedPriceValue);
    const hasRentalDates = Boolean(rentalStart && rentalEnd);
    const getDisplayedStock = (size: ProductSizeOption) => {
        if (hasRentalDates && selectedSize?.variantId === size.variantId && availability) {
            return availability.availableStock;
        }

        return size.availableStock;
    };

    return (
        <>
            <h1 className="mb-2 text-[20px] font-bold leading-[1.3] text-[#222222] md:text-[24px]">
                {product.title}
            </h1>

            <div className="mb-3 flex items-center gap-2 border-b border-[#E6E6E6] pb-3">
                <span className="text-[14px] font-bold text-[#222222]">
                    {product.rating}
                </span>

                <StarRating size="w-4 h-4" rating={product.rating} />

                <Link
                    href="#danh-gia"
                    className="ml-1 text-[14px] text-[#007185] hover:text-[#E47911] hover:underline"
                >
                    {product.reviewsCount} đánh giá
                </Link>
            </div>

            <div className="mb-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-[24px] font-bold leading-none text-[#C62828]">
                        {displayedPrice}
                    </span>
                    <span className="text-[14px] font-bold text-[#C62828]">vnđ</span>
                </div>

                {rentalDays > 0 ? (
                    <p className="mt-1 text-[13px] text-[#565959]">
                        Tổng tiền thuê {rentalDays} ngày · {formatPrice(selectedPriceValue)} vnđ/ngày
                    </p>
                ) : (
                    <p className="mt-1 text-[13px] text-[#565959]">
                        Giá thuê theo ngày
                    </p>
                )}
            </div>

            {displaySizeOptions.length > 0 && (
                <div className="mb-6">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="text-[14px] font-bold text-[#222222]">
                            Kích thước:
                        </span>
                        <span className="text-[14px] font-medium text-[#222222]">
                            {selectedSize?.name}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {displaySizeOptions.map((size) => (
                            <button
                                key={size.variantId}
                                type="button"
                                onClick={() => onSelectSize(size)}
                                className={`rounded-[4px] border px-3 py-1.5 text-[13px] font-medium transition-all ${
                                    selectedSize?.variantId === size.variantId
                                        ? "border-[#FF9900] bg-[#FF9900]/10 text-[#222222] shadow-sm"
                                        : "border-[#D5D9D9] bg-white text-[#222222] hover:bg-[#F7F7F7]"
                                }`}
                            >
                                {size.name}
                                <span className="ml-1 text-[11px] text-[#565959]">
                                    {hasRentalDates ? `(${getDisplayedStock(size)})` : `(tồn: ${size.availableStock})`}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <div className="mb-6">
                <span className="mb-2 block text-[14px] font-bold text-[#222222]">
                    Ngày thuê:
                </span>

                <div className="grid max-w-[360px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-2">
                    <DatePickerField
                        value={rentalStart}
                        placeholder="Bắt đầu"
                        minYear={currentYear}
                        maxYear={currentYear + 2}
                        minDate={today}
                        onChange={onRentalStartChange}
                    />
                    <span className="pt-2 text-[#6B7280]">-</span>
                    <DatePickerField
                        value={rentalEnd}
                        placeholder="Kết thúc"
                        minYear={currentYear}
                        maxYear={currentYear + 2}
                        minDate={minRentalEnd}
                        onChange={onRentalEndChange}
                    />
                </div>

                {isCheckingAvailability && (
                    <p className="mt-2 text-[13px] font-medium text-[#565959]">
                        Đang kiểm tra lịch thuê...
                    </p>
                )}

                {!isCheckingAvailability && availability && (
                    <p
                        className={`mt-2 text-[13px] font-semibold ${
                            availability.available ? "text-[#007600]" : "text-[#842029]"
                        }`}
                    >
                        {availability.available
                            ? `Còn ${availability.availableStock} sản phẩm trong thời gian đã chọn.`
                            : availability.message || "Sản phẩm không khả dụng trong thời gian đã chọn."}
                    </p>
                )}
            </div>

            <div className="mb-4">
                <h3 className="mb-3 text-[16px] font-bold text-[#222222]">
                    Về sản phẩm này
                </h3>

                <ul className="list-disc space-y-2 pl-5 text-[14px] leading-[1.5] text-[#222222]">
                    {product.description.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>

            <Link
                href="#thong-tin-san-pham"
                className="mb-2 flex items-center text-[14px] font-medium text-[#007185] hover:text-[#E47911] hover:underline"
            >
                <ChevronRight className="mr-0.5 h-4 w-4" />
                Xem thêm chi tiết sản phẩm
            </Link>

            <button
                type="button"
                className="mt-4 flex items-center text-left text-[13px] text-[#007185] hover:text-[#E47911] hover:underline"
            >
                <Flag className="mr-1.5 h-3.5 w-3.5" />
                Báo cáo sự cố với sản phẩm này
            </button>
        </>
    );
}
