import type { ProductDetail } from '@/lib/api/products';
import RatingBar from './RatingBar';
import StarRating from './StarRating';

type ProductReviewsProps = {
    product: ProductDetail;
};

function formatDate(value: string) {
    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(value));
}

export default function ProductReviews({ product }: ProductReviewsProps) {
    const totalReviews = product.reviews.length;

    return (
        <section id="danh-gia" className="py-8 border-t border-[#E6E6E6]">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-[300px] flex-shrink-0">
                    <h2 className="text-[20px] font-bold text-[#222222] mb-4">
                        Đánh giá từ khách hàng
                    </h2>

                    <div className="flex items-center gap-2 mb-2">
                        <StarRating size="w-5 h-5" rating={product.rating} />
                        <span className="text-[18px] font-bold text-[#222222]">
                            {product.rating}/5
                        </span>
                    </div>

                    <p className="text-[14px] text-[#565959] mb-6">
                        {totalReviews} đánh giá
                    </p>

                    <div className="mb-8">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const count = product.ratingDistribution[stars as 1 | 2 | 3 | 4 | 5];
                            const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
                            return <RatingBar key={stars} stars={String(stars)} percent={percent} />;
                        })}
                    </div>

                    <div className="border-t border-[#E6E6E6] pt-6">
                        <h3 className="text-[16px] font-bold text-[#222222] mb-2">
                            Đánh giá sản phẩm này
                        </h3>
                        <p className="text-[13px] text-[#565959]">
                            Bạn có thể đánh giá sản phẩm sau khi hoàn tất đơn thuê.
                        </p>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-[16px] font-bold text-[#222222] mb-6">
                        Nhận xét
                    </h3>

                    {product.reviews.length > 0 ? (
                        <div className="space-y-6">
                            {product.reviews.map((review) => (
                                <article key={review.id} className="border-b border-[#E6E6E6] pb-6 last:border-b-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <StarRating size="w-3.5 h-3.5" rating={review.rating} />
                                        <span className="text-[14px] font-bold text-[#222222]">
                                            {review.rating}/5
                                        </span>
                                    </div>

                                    <span className="text-[12px] text-[#565959] block mb-2">
                                        Đánh giá vào ngày {formatDate(review.createdAt)}
                                    </span>

                                    {review.comment ? (
                                        <p className="text-[14px] text-[#222222] leading-[1.6]">
                                            {review.comment}
                                        </p>
                                    ) : (
                                        <p className="text-[14px] text-[#565959] italic">
                                            Người thuê không để lại nhận xét.
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-[6px] border border-dashed border-[#D5D9D9] bg-[#F7F7F7] px-5 py-8 text-center">
                            <p className="text-[14px] font-semibold text-[#222222]">
                                Chưa có đánh giá cho sản phẩm này.
                            </p>
                            <p className="mt-1 text-[13px] text-[#565959]">
                                Các đánh giá thật sẽ xuất hiện sau khi khách hàng hoàn tất đơn thuê.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
