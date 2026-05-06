"use client";

import { Star } from "lucide-react";

type ProductReviewStarsProps = {
    value: number;
    onChange?: (value: number) => void;
    size?: string;
    interactive?: boolean;
};

export default function ProductReviewStars({
    value,
    onChange,
    size = "h-4 w-4",
    interactive = false,
}: ProductReviewStarsProps) {
    return (
        <div className="flex items-center gap-0.5 text-[#FFA41C]">
            {[1, 2, 3, 4, 5].map((star) => {
                const filled = star <= value;
                const icon = (
                    <Star
                        className={`${size} ${filled ? "fill-current" : "fill-current text-[#D5D9D9]"}`}
                    />
                );

                if (!interactive) {
                    return <span key={star}>{icon}</span>;
                }

                return (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange?.(star)}
                        className="rounded-[4px] p-0.5 focus:outline-none focus:ring-2 focus:ring-[#FFA41C]"
                        aria-label={`Chọn ${star} sao`}
                    >
                        {icon}
                    </button>
                );
            })}
        </div>
    );
}
