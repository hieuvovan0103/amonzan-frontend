import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination() {
    return (
        <div className="flex items-center justify-center flex-wrap gap-2 mt-8">
            <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-[#222222] hover:text-[#007185] transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
                Trước
            </button>

            <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-[#232F3E] text-white text-[14px] font-bold"
            >
                1
            </button>

            <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[#222222] hover:bg-[#F7F7F7] text-[14px] font-medium transition-colors"
            >
                2
            </button>

            <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[#222222] hover:bg-[#F7F7F7] text-[14px] font-medium transition-colors"
            >
                3
            </button>

            <span className="text-[#6B7280] px-1">...</span>

            <button
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-[8px] text-[#222222] hover:bg-[#F7F7F7] text-[14px] font-medium transition-colors"
            >
                10
            </button>

            <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-[#222222] hover:text-[#007185] transition-colors"
            >
                Sau
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}