"use client";

import { useEffect, useMemo, useState } from "react";
import {
    getPublicProductAvailability,
    type ProductAvailability,
    type ProductDetail,
    type ProductSizeOption,
} from "@/lib/api/products";
import BuyBox from "./BuyBox";
import ProductGallery from "./ProductGallery";
import ProductInfo from "./ProductInfo";

type ProductDetailPurchaseProps = {
    product: ProductDetail;
};

export default function ProductDetailPurchase({ product }: ProductDetailPurchaseProps) {
    const initialSize = useMemo<ProductSizeOption | undefined>(() => {
        const displaySize = product.availableSizes.find(
            (size) => size.name.trim().toLowerCase() !== "mặc định",
        );

        return displaySize ?? product.availableSizes[0];
    }, [product.availableSizes]);

    const [selectedSize, setSelectedSize] = useState<ProductSizeOption | undefined>(initialSize);
    const [rentalStart, setRentalStart] = useState("");
    const [rentalEnd, setRentalEnd] = useState("");
    const [availability, setAvailability] = useState<ProductAvailability | null>(null);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

    const handleRentalStartChange = (value: string) => {
        setRentalStart(value);
        if (rentalEnd && value && rentalEnd <= value) {
            const nextDay = new Date(`${value}T00:00:00.000Z`);
            nextDay.setUTCDate(nextDay.getUTCDate() + 1);
            setRentalEnd(nextDay.toISOString().slice(0, 10));
        }
    };

    useEffect(() => {
        let isCancelled = false;

        async function checkAvailability() {
            if (!selectedSize?.variantId || !rentalStart || !rentalEnd || rentalEnd <= rentalStart) {
                setAvailability(null);
                return;
            }

            setIsCheckingAvailability(true);

            try {
                const result = await getPublicProductAvailability({
                    slug: product.slug,
                    variantId: selectedSize.variantId,
                    start: rentalStart,
                    end: rentalEnd,
                });

                if (!isCancelled) {
                    setAvailability(result);
                }
            } finally {
                if (!isCancelled) {
                    setIsCheckingAvailability(false);
                }
            }
        }

        checkAvailability();

        return () => {
            isCancelled = true;
        };
    }, [product.slug, rentalEnd, rentalStart, selectedSize?.variantId]);

    return (
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12">
            <div className="lg:w-[45%]">
                <ProductGallery images={product.images} title={product.title} />
            </div>

            <div className="lg:w-[35%] flex flex-col">
                <ProductInfo
                    product={product}
                    selectedSize={selectedSize}
                    onSelectSize={setSelectedSize}
                    rentalStart={rentalStart}
                    rentalEnd={rentalEnd}
                    onRentalStartChange={handleRentalStartChange}
                    onRentalEndChange={setRentalEnd}
                    availability={availability}
                    isCheckingAvailability={isCheckingAvailability}
                />
            </div>

            <div className="lg:w-[20%]">
                <BuyBox
                    product={product}
                    selectedSize={selectedSize}
                    rentalStart={rentalStart}
                    rentalEnd={rentalEnd}
                    location={product.location}
                    storeName={product.storeName}
                    availability={availability}
                    isCheckingAvailability={isCheckingAvailability}
                />
            </div>
        </div>
    );
}
