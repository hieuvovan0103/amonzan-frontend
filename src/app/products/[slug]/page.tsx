import { notFound } from 'next/navigation';
import ProductDetailPurchase from './components/ProductDetailPurchase';
import ProductReviews from './components/ProductReviews';
import ProductSpecs from './components/ProductSpecs';
import RelatedProductsSection from './components/RelatedProductsSection';
import { getPublicProductDetail, getPublicProducts } from '@/lib/api/products';

type ProductDetailPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function ProductDetailPage({
    params,
}: ProductDetailPageProps) {
    const { slug } = await params;
    
    const product = await getPublicProductDetail(slug);
    
    if (!product) {
        notFound();
    }

    const { products: relatedProducts } = await getPublicProducts({
        categorySlug: product.categorySlug,
        limit: 4,
    });

    return (
        <>
            <main className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8">
                <ProductDetailPurchase product={product} />

                {relatedProducts.length > 0 && (
                    <RelatedProductsSection
                        title="Sản phẩm liên quan đến mặt hàng này"
                        products={relatedProducts}
                    />
                )}

                <ProductSpecs product={product} />

                <ProductReviews product={product} />

                {relatedProducts.length > 0 && (
                    <RelatedProductsSection
                        title="Khách hàng mua mặt hàng này cũng mua"
                        products={relatedProducts}
                    />
                )}
            </main>
        </>
    );
}
