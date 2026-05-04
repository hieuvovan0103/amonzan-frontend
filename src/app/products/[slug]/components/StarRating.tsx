import { Star } from 'lucide-react';

type StarRatingProps = {
    size?: string;
    emptyLast?: boolean;
    rating?: number;
};

export default function StarRating({
    size = 'w-4 h-4',
    emptyLast = false,
    rating,
}: StarRatingProps) {
    const displayRating = Math.max(0, Math.min(5, rating ?? (emptyLast ? 4 : 5)));

    return (
        <div className="flex text-[#FFA41C]">
            {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= Math.round(displayRating);
                return (
                    <Star
                        key={star}
                        className={`${size} ${isFilled ? 'fill-current' : 'fill-current text-[#D5D9D9]'}`}
                    />
                );
            })}
        </div>
    );
}
