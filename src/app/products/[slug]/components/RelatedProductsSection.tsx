import Link from 'next/link';
import StarRating from './StarRating';

type RelatedProduct = {
    id: number;
    title: string;
    price: string;
    rating: number;
    reviewsCount: number;
    image: string;
};

type RelatedProductsSectionProps = {
    title: string;
    products: RelatedProduct[];
};

export default function RelatedProductsSection({
    title,
    products,
}: RelatedProductsSectionProps) {
    return (
        <section className="py-8 border-t border-[#E6E6E6]">
            <h2 className="text-[20px] font-bold text-[#222222] mb-6">{title}</h2>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                {products.map((item) => (
                    <div
                        key={item.id}
                        className="w-[160px] md:w-[180px] flex-shrink-0 group cursor-pointer"
                    >
                        <div className="bg-[#F7F7F7] rounded-[12px] aspect-square overflow-hidden mb-3">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>

                        <Link
                            href={`/products/demo-${item.id}`}
                            className="text-[13px] text-[#007185] group-hover:text-[#E47911] hover:underline line-clamp-2 leading-[1.4] mb-1 block"
                        >
                            {item.title}
                        </Link>

                        <div className="flex items-center gap-1 mb-1">
                            <StarRating size="w-3.5 h-3.5" emptyLast />
                            <span className="text-[12px] text-[#007185]">
                                {item.reviewsCount}
                            </span>
                        </div>

                        <div className="flex items-baseline gap-1">
                            <span className="text-[16px] font-bold text-[#C62828]">
                                {item.price}
                            </span>
                            <span className="text-[11px] font-bold text-[#C62828]">vnđ</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}