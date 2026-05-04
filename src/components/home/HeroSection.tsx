"use client";

import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { suggestedKeywords } from "./home-data";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-gray-50 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block mb-2">Thuê trang phục cao cấp.</span>
          <span className="block text-[#FF9900]">Toả sáng mọi sự kiện.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-gray-500 sm:text-xl">
          Amonzan là nền tảng cho thuê thời trang dành cho váy dạ hội, vest,
          áo dài, phụ kiện và nhiều sản phẩm khác. Mặc đẹp linh hoạt, tiết kiệm
          hơn và không cần mua mới.
        </p>

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-col overflow-hidden rounded-sm border border-gray-300 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-shadow focus-within:border-[#FF9900] focus-within:ring-1 focus-within:ring-[#FF9900] sm:flex-row">
            <div className="flex flex-grow items-center border-b border-gray-200 px-4 py-3 sm:border-b-0 sm:border-r sm:py-0">
              <Search className="mr-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Bạn muốn tìm trang phục gì hôm nay?"
                className="w-full text-base text-gray-900 placeholder:text-gray-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center px-4 py-3 sm:py-0">
              <MapPin className="mr-2 h-5 w-5 text-gray-400" />
              <select className="cursor-pointer bg-transparent text-gray-700 focus:outline-none">
                <option>Hồ Chí Minh</option>
                <option>Hà Nội</option>
                <option>Đà Nẵng</option>
              </select>
            </div>

            <Link
              href="/products"
              className="bg-[#FF9900] px-8 py-4 text-center text-base font-bold text-gray-900 transition-colors hover:bg-[#e38800] sm:py-3"
            >
              Tìm kiếm
            </Link>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>Gợi ý:</span>

            {suggestedKeywords.map((keyword) => (
              <Link
                key={keyword}
                href={`/products?search=${encodeURIComponent(keyword)}`}
                className="underline underline-offset-2 hover:text-[#FF9900]"
              >
                {keyword}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}