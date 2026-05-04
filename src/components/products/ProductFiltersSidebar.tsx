"use client";

import { ChevronDown, Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProductFiltersSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [province, setProvince] = useState(searchParams.get("province") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    useEffect(() => {
        setCategory(searchParams.get("category") || "");
        setProvince(searchParams.get("province") || "");
        setMinPrice(searchParams.get("minPrice") || "");
        setMaxPrice(searchParams.get("maxPrice") || "");
    }, [searchParams]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (category) params.set("category", category);
        else params.delete("category");

        if (province) params.set("province", province);
        else params.delete("province");

        if (minPrice) params.set("minPrice", minPrice);
        else params.delete("minPrice");

        if (maxPrice) params.set("maxPrice", maxPrice);
        else params.delete("maxPrice");

        // Reset page when filtering
        params.delete("page");

        router.push(`/products?${params.toString()}`);
    };

    const handleClear = () => {
        router.push(`/products`);
    };

    return (
        <aside className="w-full md:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-sm border border-[#E6E6E6] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 md:sticky md:top-[90px]">
                <div className="flex items-center gap-2 mb-5">
                    <Filter className="w-5 h-5 text-[#007185]" />
                    <h2 className="text-[18px] font-bold text-[#222222]">Bộ lọc</h2>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-bold text-[#222222] mb-2">
                            Danh mục
                        </label>
                        <div className="relative">
                            <select 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full appearance-none border border-[#D5D9D9] rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900] bg-white"
                            >
                                <option value="">Tất cả danh mục</option>
                                <option value="cosplay">Cosplay</option>
                                <option value="su-kien">Trang phục sự kiện</option>
                                <option value="thiet-bi">Thiết bị điện tử</option>
                                <option value="da-ngoai">Dã ngoại</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold text-[#222222] mb-2">
                            Địa điểm
                        </label>
                        <div className="relative">
                            <select 
                                value={province}
                                onChange={(e) => setProvince(e.target.value)}
                                className="w-full appearance-none border border-[#D5D9D9] rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900] bg-white"
                            >
                                <option value="">Tất cả khu vực</option>
                                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                                <option value="Hà Nội">Hà Nội</option>
                                <option value="Đà Nẵng">Đà Nẵng</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold text-[#222222] mb-2">
                            Mức giá
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="number"
                                placeholder="Từ"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="border border-[#D5D9D9] rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900]"
                            />
                            <input
                                type="number"
                                placeholder="Đến"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="border border-[#D5D9D9] rounded-sm px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900]"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={handleApply}
                            className="w-full bg-[#232F3E] hover:bg-[#111111] text-white font-bold text-[14px] py-2.5 rounded-sm transition-colors"
                        >
                            Áp dụng bộ lọc
                        </button>

                        <button
                            type="button"
                            onClick={handleClear}
                            className="w-full bg-white hover:bg-[#F7F7F7] border border-[#D5D9D9] text-[#222222] font-bold text-[14px] py-2.5 rounded-sm transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}