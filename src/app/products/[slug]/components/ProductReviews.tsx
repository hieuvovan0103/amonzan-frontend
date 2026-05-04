import { ThumbsUp } from 'lucide-react';
import Link from 'next/link';
import RatingBar from './RatingBar';
import StarRating from './StarRating';

type ProductReviewsProps = {
    rating: number;
    reviewsCount: number;
};

export default function ProductReviews({
    rating,
    reviewsCount,
}: ProductReviewsProps) {
    return (
        <section id="danh-gia" className="py-8 border-t border-[#E6E6E6]">
            <div className="flex flex-col md:flex-row gap-12">
                <div className="md:w-[300px] flex-shrink-0">
                    <h2 className="text-[20px] font-bold text-[#222222] mb-4">
                        Đánh giá từ khách hàng
                    </h2>

                    <div className="flex items-center gap-2 mb-2">
                        <StarRating size="w-5 h-5" />
                        <span className="text-[18px] font-bold text-[#222222]">
                            {rating}/5
                        </span>
                    </div>

                    <p className="text-[14px] text-[#565959] mb-6">
                        {reviewsCount} đánh giá toàn cầu
                    </p>

                    <div className="mb-8">
                        <RatingBar stars="5" percent={82} />
                        <RatingBar stars="4" percent={12} />
                        <RatingBar stars="3" percent={4} />
                        <RatingBar stars="2" percent={1} />
                        <RatingBar stars="1" percent={1} />
                    </div>

                    <div className="border-t border-[#E6E6E6] pt-6">
                        <h3 className="text-[16px] font-bold text-[#222222] mb-2">
                            Đánh giá sản phẩm này
                        </h3>
                        <p className="text-[13px] text-[#565959] mb-4">
                            Chia sẻ suy nghĩ của bạn với các khách hàng khác
                        </p>

                        <button className="w-full bg-white hover:bg-[#F7F7F7] border border-[#D5D9D9] text-[#222222] font-semibold text-[14px] py-2 rounded-[999px] transition-colors shadow-sm">
                            Viết đánh giá
                        </button>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-[16px] font-bold text-[#222222] mb-6">
                        Khách hàng nói gì
                    </h3>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#E6E6E6] flex items-center justify-center">
                                <span className="text-[14px] font-medium text-[#565959]">
                                    LT
                                </span>
                            </div>
                            <span className="text-[14px] font-medium text-[#222222]">
                                Lê Thị Thanh Phương
                            </span>
                        </div>

                        <div className="flex items-center gap-2 mb-1">
                            <StarRating size="w-3.5 h-3.5" />
                            <span className="text-[14px] font-bold text-[#222222]">
                                Rất đẹp và vừa vặn!
                            </span>
                        </div>

                        <span className="text-[12px] text-[#565959] block mb-2">
                            Đánh giá tại Việt Nam vào ngày 29 tháng 5, 2023
                        </span>

                        <div className="text-[12px] text-[#565959] mb-3 flex gap-3">
                            <span>Kích thước: M</span>
                            <span className="border-l border-[#D5D9D9] pl-3">
                                Màu sắc: Xanh rêu
                            </span>
                        </div>

                        <p className="text-[14px] text-[#222222] leading-[1.6] mb-4">
                            Đồ cực kỳ đẹp và chi tiết. Đai lưng chắc chắn và không bị lỏng lẻo
                            khi di chuyển. Chất vải phần áo choàng rất tốt, bay bổng khi chụp
                            ảnh. Tuy nhiên, phần áo lót hơi mỏng so với mình tưởng tượng,
                            nhưng khi khoác áo ngoài vào thì không thành vấn đề. Nhìn chung rất
                            đáng tiền để thuê chụp kỷ yếu!
                        </p>

                        <div className="flex gap-2 mb-4">
                            <div className="w-[100px] h-[100px] rounded-[8px] bg-[#F7F7F7] overflow-hidden border border-[#E6E6E6]">
                                <img
                                    src="https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=200&auto=format&fit=crop"
                                    className="w-full h-full object-cover"
                                    alt="Ảnh đánh giá"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-[13px] flex-wrap">
                            <button className="flex items-center gap-1.5 border border-[#D5D9D9] rounded-[999px] px-3 py-1.5 hover:bg-[#F7F7F7] transition-colors">
                                <ThumbsUp className="w-4 h-4 text-[#565959]" />
                                Hữu ích
                            </button>

                            <button className="text-[#565959] hover:underline">Báo cáo</button>

                            <span className="text-[#565959] border-l border-[#E6E6E6] pl-4">
                                14 người thấy điều này hữu ích
                            </span>
                        </div>
                    </div>

                    <Link
                        href="#"
                        className="text-[14px] text-[#007185] hover:text-[#E47911] hover:underline font-medium"
                    >
                        Xem thêm tất cả đánh giá ›
                    </Link>
                </div>
            </div>
        </section>
    );
}