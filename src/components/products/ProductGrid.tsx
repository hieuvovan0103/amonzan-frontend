import ProductCard from "@/components/products/ProductCard";
import { ProductListItem } from "@/types/product";

type ProductGridProps = {
    products: ProductListItem[];
};

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} data={product} />
            ))}
        </div>
    );
}