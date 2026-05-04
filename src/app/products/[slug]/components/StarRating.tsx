import { Star } from 'lucide-react';

type StarRatingProps = {
    size?: string;
    emptyLast?: boolean;
};

export default function StarRating({
    size = 'w-4 h-4',
    emptyLast = false,
}: StarRatingProps) {
    return (
        <div className="flex text-[#FFA41C]">
            <Star className={`${size} fill-current`} />
            <Star className={`${size} fill-current`} />
            <Star className={`${size} fill-current`} />
            <Star className={`${size} fill-current`} />
            <Star
                className={`${size} ${emptyLast ? 'text-[#D5D9D9]' : ''} fill-current`}
            />
        </div>
    );
}