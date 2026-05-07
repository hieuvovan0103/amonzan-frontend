import ProductListPage from "@/components/products/ProductListPage";
import { getPublicProducts } from "@/lib/api/products";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;
    const page = params.page ? parseInt(params.page as string, 10) : 1;
    const categorySlug = typeof params.category === "string" ? params.category : undefined;
    const search =
        typeof params.search === "string"
            ? params.search
            : typeof params.keyword === "string"
                ? params.keyword
                : undefined;
    const province = typeof params.province === "string" ? params.province : undefined;
    const minPrice = typeof params.minPrice === "string" ? Number(params.minPrice) : undefined;
    const maxPrice = typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;
    const sort = typeof params.sort === "string" ? params.sort as any : "newest";
    
    const apiParams = {
        page,
        limit: 12,
        categorySlug,
        search,
        province,
        minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
        maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
        sort,
    };

    const { products, pagination } = await getPublicProducts(apiParams);

    return <ProductListPage products={products} pagination={pagination} />;
}
