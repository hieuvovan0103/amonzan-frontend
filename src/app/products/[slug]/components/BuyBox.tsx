"use client";

import Link from "next/link";
import { formatPrice } from "@/app/utils/formatPrice";
import type { ProductDetail, ProductSizeOption } from "@/lib/api/products";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCartStore } from "@/stores/useCartStore";
import { useToastStore } from "@/stores/useToastStore";

type BuyBoxProps = {
    product: ProductDetail;
    selectedSize?: ProductSizeOption;
    rentalStart: string;
    rentalEnd: string;
    location: string;
    storeName: string;
};

function formatRentalDate(value: string) {
    if (!value) return "";
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    }).format(new Date(value));
}

export default function BuyBox({
    product,
    selectedSize,
    rentalStart,
    rentalEnd,
    location,
    storeName,
}: BuyBoxProps) {
    const { user } = useAuthStore();
    const addItem = useCartStore((state) => state.addItem);
    const showToast = useToastStore((state) => state.show);
    const isOutOfStock = !selectedSize || selectedSize.availableStock <= 0;
    const selectedPriceValue = selectedSize?.priceValue ?? product.priceValue;
    const selectedPrice = formatPrice(selectedPriceValue);
    const selectedSizeName = selectedSize?.name ?? product.sizes[0] ?? "Mặc định";
    const shouldShowSelectedSize = selectedSizeName.trim().toLowerCase() !== "mặc định";
    const hasRentalDates = Boolean(rentalStart && rentalEnd);
    const rentDates = hasRentalDates
        ? `${formatRentalDate(rentalStart)} - ${formatRentalDate(rentalEnd)}`
        : "Chưa chọn thời gian thuê";

    const handleAddToCart = () => {
        if (isOutOfStock) {
            showToast("Sản phẩm đã hết hàng. Vui lòng liên hệ cửa hàng.", "error");
            return;
        }

        if (!hasRentalDates) {
            showToast("Vui lòng chọn ngày thuê trước khi thêm vào giỏ.", "error");
            return;
        }

        addItem({
            productId: product.id,
            variantId: selectedSize?.variantId,
            slug: product.slug,
            title: product.title,
            rentDates,
            rentalStart,
            rentalEnd,
            pricePerDay: selectedPrice,
            size: selectedSizeName,
            color: "Mặc định",
            price: selectedPriceValue,
            image: product.images[0] ?? "/file.svg",
            shopId: product.shopId,
            shopName: storeName,
            availableStock: selectedSize?.availableStock,
        });
        showToast(
            shouldShowSelectedSize
                ? `Đã thêm size ${selectedSizeName} vào giỏ hàng.`
                : "Đã thêm sản phẩm vào giỏ hàng.",
            "success",
        );
    };

    const handleRentNow = () => {
        if (isOutOfStock) {
            window.location.href = `/shop/${product.shopId}`;
            return;
        }

        if (!user) {
            window.location.href = "/signup";
            return;
        }
        handleAddToCart();
        window.location.href = "/cart";
    };

    return (
        <div className="border border-[#E6E6E6] rounded-[6px] p-5 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)] bg-white sticky top-[90px]">
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[28px] font-bold text-[#C62828] leading-none">
                    {selectedPrice}
                </span>
                <span className="text-[14px] font-bold text-[#C62828]">vnđ</span>
            </div>

            {selectedSize && shouldShowSelectedSize && (
                <div className="mb-3 text-[13px] text-[#565959]">
                    Size đã chọn: <span className="font-semibold text-[#222222]">{selectedSize.name}</span>
                </div>
            )}

            <div className="text-[14px] text-[#222222] mb-4 space-y-1">
                <p>
                    Thời gian thuê: <span className="font-semibold">{rentDates}</span>
                </p>
                <p>
                    Giao hàng tới{" "}
                    <span className="font-semibold text-[#007185] cursor-pointer hover:text-[#E47911] hover:underline">
                        {location || "Chưa cập nhật"}
                    </span>
                </p>
            </div>

            <div className="space-y-3">
                {isOutOfStock ? (
                    <Link
                        href={`/shop/${product.shopId}`}
                        className="block w-full rounded-[4px] border border-[#007185] bg-white py-3 text-center text-[14px] font-semibold text-[#007185] shadow-sm transition-colors hover:bg-[#F0F8FF]"
                    >
                        Liên hệ cửa hàng
                    </Link>
                ) : (
                    <>
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-semibold text-[14px] py-3 rounded-[4px] transition-colors shadow-sm"
                        >
                            Thêm vào giỏ
                        </button>

                        <button
                            onClick={handleRentNow}
                            className="w-full bg-[#FF9900] hover:bg-[#E47911] text-[#111111] font-semibold text-[14px] py-3 rounded-[4px] transition-colors shadow-sm"
                        >
                            Thuê ngay
                        </button>
                    </>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E6E6E6] text-[13px] text-[#565959] space-y-2">
                <div className="flex justify-between">
                    <span>Giao hàng</span>
                    <span className="font-medium text-[#222222]">Amonzan</span>
                </div>

                <div className="flex justify-between gap-2">
                    <span>Cung cấp bởi</span>
                    <Link
                        href={`/shop/${product.shopId}`}
                        className="text-right font-medium text-[#007185] hover:text-[#E47911] hover:underline"
                    >
                        {storeName}
                    </Link>
                </div>

                <div className="flex justify-between gap-2">
                    <span>Chính sách</span>
                    <a
                        href="#chinh-sach-cua-hang"
                        className="font-medium text-[#007185] hover:text-[#E47911] hover:underline text-right"
                    >
                        Xem chính sách cửa hàng
                    </a>
                </div>
            </div>
        </div>
    );
}
