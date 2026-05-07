"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function SimplePagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const pages: Array<number | "..."> = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
        className="inline-flex items-center gap-1 rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] font-semibold text-[#222222] hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
        Trước
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-1 text-[13px] font-semibold text-[#6B7280]">
            ...
          </span>
        ) : (
          <button
            key={`page-${p}`}
            type="button"
            onClick={() => onPageChange(p)}
            className={`h-9 w-9 rounded-[8px] text-[13px] font-bold transition-colors ${
              p === page ? "bg-[#232F3E] text-white" : "border border-[#D5D9D9] bg-white text-[#222222] hover:bg-[#F7F7F7]"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
        className="inline-flex items-center gap-1 rounded-[8px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] font-semibold text-[#222222] hover:bg-[#F7F7F7] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Sau
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

