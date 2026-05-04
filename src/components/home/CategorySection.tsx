import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { categories } from "./home-data";
import CategoryCard from "./CategoryCard";

export default function CategorySection() {
    return (
        <section className="bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            Danh mục nổi bật
                        </h2>
                        <p className="mt-1 text-gray-500">
                            Khám phá hàng ngàn thiết kế sẵn sàng cho thuê
                        </p>
                    </div>

                    <Link
                        href="/products"
                        className="hidden items-center font-medium text-[#FF9900] hover:text-[#e38800] sm:flex"
                    >
                        Xem tất cả
                        <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                    {categories.map((category) => (
                        <CategoryCard key={category.id} category={category} />
                    ))}
                </div>
            </div>
        </section>
    );
}