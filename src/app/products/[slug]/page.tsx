import { notFound } from 'next/navigation';
import BuyBox from './components/BuyBox';
import ProductGallery from './components/ProductGallery';
import ProductInfo from './components/ProductInfo';
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
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-12">
                    <div className="lg:w-[45%]">
                        <ProductGallery images={product.images} title={product.title} />
                    </div>

                    <div className="lg:w-[35%] flex flex-col">
                        <ProductInfo product={product} />
                    </div>

                    <div className="lg:w-[20%]">
                        <BuyBox
                            price={product.price}
                            location={product.location}
                            storeName={product.storeName}
                        />
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <RelatedProductsSection
                        title="Sản phẩm liên quan đến mặt hàng này"
                        products={relatedProducts}
                    />
                )}

                <ProductSpecs />

                <ProductReviews
                    rating={product.rating}
                    reviewsCount={product.reviewsCount}
                />

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
