import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TrendingProductCard from "./TrendingProductCard";
import { getPublicProducts } from "@/lib/api/products";

export default async function TrendingSection() {
    const { products } = await getPublicProducts({
        sort: "rating_desc",
        limit: 4,
    });

    if (products.length === 0) return null;

    return (
        <section className="border-y border-gray-100 bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Đang được thuê nhiều nhất
                        </h2>
                        <p className="mt-1 text-gray-500">
                            Những sản phẩm được người thuê quan tâm gần đây
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="hidden items-center font-medium text-[#FF9900] hover:text-[#e38800] sm:flex"
                    >
                        Xem thêm
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {products.map((item) => (
                        <TrendingProductCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}