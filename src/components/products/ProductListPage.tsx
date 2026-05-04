import ProductListShell from "@/components/products/ProductListShell";
import type { ProductListResult } from "@/lib/api/products";

export default function ProductListPage({ products, pagination }: ProductListResult) {
    return <ProductListShell products={products} pagination={pagination} />;
}