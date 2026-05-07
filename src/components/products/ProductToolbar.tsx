"use client";

import { ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProductToolbar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") || "newest";

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        params.delete("page");
        router.push(`/products?${params.toString()}`);
    };

    return (
        <div className="bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-4 md:p-5 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-bold text-[#222222]">
                        Danh sách sản phẩm
                    </h1>
                    <p className="text-[14px] text-[#565959] mt-1">
                        Khám phá các sản phẩm cho thuê đang có trên nền tảng.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative w-full sm:w-[220px]">
                        <select
                            value={sort}
                            onChange={(event) => handleSortChange(event.target.value)}
                            className="w-full appearance-none border border-[#D5D9D9] rounded-[10px] px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900] bg-white"
                        >
                            <option value="newest">Mới nhất</option>
                            <option value="price_asc">Giá tăng dần</option>
                            <option value="price_desc">Giá giảm dần</option>
                            <option value="rating_desc">Đánh giá cao nhất</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}
