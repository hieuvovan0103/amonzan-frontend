"use client";

import { useMemo, useState } from "react";
import type { ProductDetail, ProductSizeOption } from "@/lib/api/products";
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

    const handleRentalStartChange = (value: string) => {
        setRentalStart(value);
        if (rentalEnd && value && rentalEnd < value) {
            setRentalEnd(value);
        }
    };

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
                />
            </div>
        </div>
    );
}
