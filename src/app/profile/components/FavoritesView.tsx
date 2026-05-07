"use client";

import Link from "next/link";
import { Heart, PackageSearch } from "lucide-react";

export default function FavoritesView() {
    return (
        <section className="rounded-[8px] border border-[#E6E6E6] bg-white">
            <div className="border-b border-[#E6E6E6] px-5 py-4 md:px-6">
                <h2 className="text-[18px] font-bold text-[#222222]">Sản phẩm yêu thích</h2>
                <p className="mt-1 text-[13px] text-[#565959]">
                    Lưu lại các sản phẩm bạn muốn thuê sau.
                </p>
            </div>

            <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF8E1] text-[#B12704]">
                    <Heart className="h-7 w-7" />
                </div>
                <h3 className="text-[16px] font-bold text-[#222222]">Chưa có sản phẩm yêu thích</h3>
                <p className="mt-2 max-w-[420px] text-[14px] leading-6 text-[#565959]">
                    Khi bạn lưu sản phẩm, chúng sẽ xuất hiện ở đây để dễ so sánh và đặt thuê.
                </p>
                <Link
                    href="/products"
                    className="mt-5 inline-flex items-center gap-2 rounded-[4px] bg-[#FF9900] px-4 py-2.5 text-[14px] font-bold text-[#111111] transition-colors hover:bg-[#E47911]"
                >
                    <PackageSearch className="h-4 w-4" />
                    Khám phá sản phẩm
                </Link>
            </div>
        </section>
    );
}
