type RatingBarProps = {
    stars: string;
    percent: number;
};

export default function RatingBar({ stars, percent }: RatingBarProps) {
    return (
        <div className="flex items-center gap-3 mb-2 text-[13px]">
            <button className="w-[45px] text-[#007185] hover:text-[#E47911] hover:underline whitespace-nowrap text-left">
                {stars} sao
            </button>

            <div className="flex-1 h-5 bg-[#F7F7F7] border border-[#E6E6E6] rounded-[4px] overflow-hidden">
                <div
                    className="h-full bg-[#FFA41C] border border-[#F0C14B]"
                    style={{ width: `${percent}%` }}
                />
            </div>

            <span className="w-[30px] text-right text-[#007185]">{percent}%</span>
        </div>
    );
}