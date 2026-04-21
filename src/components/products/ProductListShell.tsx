import ProductFiltersSidebar from "@/components/products/ProductFiltersSidebar";
import ProductGrid from "@/components/products/ProductGrid";
import ProductPagination from "@/components/products/ProductPagination";
import ProductToolbar from "@/components/products/ProductToolbar";
import { MOCK_PRODUCTS } from "@/data/mockProducts";

export default function ProductListShell() {
  return (
    <main className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col md:flex-row gap-8">
      <ProductFiltersSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <ProductToolbar />
        <ProductGrid products={MOCK_PRODUCTS} />
        <ProductPagination />
      </div>
    </main>
  );
}