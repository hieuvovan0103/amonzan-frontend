'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Flag } from 'lucide-react';
import StarRating from './StarRating';
import type { ProductDetail } from '@/lib/api/products';

type ProductInfoProps = {
    product: ProductDetail;
};

export default function ProductInfo({ product }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'S');

    return (
        <>
            <h1 className="text-[20px] md:text-[24px] font-bold text-[#222222] leading-[1.3] mb-2">
                {product.title}
            </h1>

            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[#E6E6E6]">
                <span className="text-[14px] font-bold text-[#222222]">
                    {product.rating}
                </span>

                <StarRating size="w-4 h-4" />

                <Link
                    href="#danh-gia"
                    className="text-[14px] text-[#007185] hover:text-[#E47911] hover:underline ml-1"
                >
                    {product.reviewsCount} đánh giá
                </Link>
            </div>

            <div className="flex items-baseline gap-1 mb-4">
                <span className="text-[24px] font-bold text-[#C62828] leading-none">
                    {product.price}
                </span>
                <span className="text-[14px] font-bold text-[#C62828]">vnđ</span>
            </div>

            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[14px] font-bold text-[#222222]">
                        Kích thước:
                    </span>
                    <span className="text-[14px] font-medium text-[#222222]">
                        {selectedSize}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                        <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-1.5 text-[13px] font-medium rounded-[8px] border transition-all ${selectedSize === size
                                    ? 'border-[#FF9900] bg-[#FF9900]/10 text-[#222222] shadow-sm'
                                    : 'border-[#D5D9D9] bg-white text-[#222222] hover:bg-[#F7F7F7]'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <span className="text-[14px] font-bold text-[#222222] block mb-2">
                    Ngày thuê:
                </span>

                <div className="flex items-center gap-2 max-w-[280px]">
                    <input
                        type="text"
                        placeholder="--/--/--"
                        className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[13px] text-center outline-none focus:border-[#FF9900]"
                    />
                    <span className="text-[#6B7280]">-</span>
                    <input
                        type="text"
                        defaultValue="10/03/2024"
                        className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[13px] text-center outline-none focus:border-[#FF9900]"
                    />
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-[16px] font-bold text-[#222222] mb-3">
                    Về sản phẩm này
                </h3>

                <ul className="list-disc pl-5 space-y-2 text-[14px] text-[#222222] leading-[1.5]">
                    {product.description.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>

            <Link
                href="#thong-tin-san-pham"
                className="flex items-center text-[14px] text-[#007185] hover:text-[#E47911] hover:underline mb-2 font-medium"
            >
                <ChevronRight className="w-4 h-4 mr-0.5" />
                Xem thêm chi tiết sản phẩm
            </Link>

            <button className="flex items-center text-[13px] text-[#007185] hover:text-[#E47911] hover:underline mt-4 text-left">
                <Flag className="w-3.5 h-3.5 mr-1.5" />
                Báo cáo sự cố với sản phẩm này
            </button>
        </>
    );
}