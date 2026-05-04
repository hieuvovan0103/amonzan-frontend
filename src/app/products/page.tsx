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
    const sort = typeof params.sort === "string" ? params.sort as any : "newest";
    
    // Convert location/keyword filters later, add to API params if needed
    const apiParams = {
        page,
        limit: 12,
        categorySlug,
        sort,
    };

    const { products, pagination } = await getPublicProducts(apiParams);

    return <ProductListPage products={products} pagination={pagination} />;
}