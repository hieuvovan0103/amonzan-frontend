import type { ShopProfileReview } from "@/lib/api/shops";
import ShopReviewCard from "./ShopReviewCard";

type ShopReviewsTabProps = {
    reviews: ShopProfileReview[];
};

export default function ShopReviewsTab({ reviews }: ShopReviewsTabProps) {
    const safeReviews = reviews ?? [];

    return (
        <div>
            <div className="mb-5">
                <h2 className="text-[20px] font-bold text-[#222222]">
                    Đánh giá từ người thuê
                </h2>

                <p className="mt-1 text-[13px] text-[#565959]">
                    Nhận xét từ những người đã thuê sản phẩm của shop.
                </p>
            </div>

            {safeReviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {safeReviews.map((review) => (
                        <ShopReviewCard key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                <div className="rounded-[6px] border border-dashed border-[#D5D9D9] bg-[#FAFAFA] p-6 text-[14px] text-[#565959]">
                    Cửa hàng chưa có đánh giá.
                </div>
            )}
        </div>
    );
}
