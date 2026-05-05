import { Star, UserCircle } from "lucide-react";
import type { ShopProfileReview } from "@/lib/api/shops";

type ShopReviewCardProps = {
    review: ShopProfileReview;
};

export default function ShopReviewCard({ review }: ShopReviewCardProps) {
    return (
        <article className="rounded-[6px] border border-[#E6E6E6] bg-white p-4">
            <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <UserCircle className="h-9 w-9 text-[#565959]" />

                    <div>
                        <h3 className="text-[14px] font-bold text-[#222222]">
                            {review.author}
                        </h3>

                        <p className="text-[12px] text-[#565959]">{review.date}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                            key={index}
                            className={[
                                "h-4 w-4",
                                index < Math.round(review.rating)
                                    ? "fill-current text-[#FFA41C]"
                                    : "text-[#D5D9D9]",
                            ].join(" ")}
                        />
                    ))}
                </div>
            </div>

            <p className="text-[14px] leading-6 text-[#222222]">{review.content}</p>
        </article>
    );
}
