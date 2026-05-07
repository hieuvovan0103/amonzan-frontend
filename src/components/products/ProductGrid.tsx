import ProductCard from "@/components/products/ProductCard";
import { ProductListItem } from "@/types/product";

type ProductGridProps = {
    products: ProductListItem[];
};

export default function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="rounded-[8px] border border-dashed border-[#D5D9D9] bg-white px-5 py-12 text-center">
                <h2 className="text-[18px] font-bold text-[#222222]">
                    Không tìm thấy sản phẩm phù hợp với từ khóa của bạn.
                </h2>
                <p className="mt-2 text-[14px] text-[#565959]">
                    Hãy thử từ khóa ngắn hơn, kiểm tra lỗi chính tả hoặc tìm theo danh mục.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} data={product} />
            ))}
        </div>
    );
}
