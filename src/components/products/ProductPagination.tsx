"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { ProductListResult } from "@/lib/api/products";

type Props = {
    pagination: ProductListResult["pagination"];
};

export default function ProductPagination({ pagination }: Props) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const createPageUrl = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    if (pagination.totalPages <= 1) return null;

    const { page, totalPages, hasNextPage, hasPreviousPage } = pagination;

    // Simple logic for showing pages
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        // Show current, first, last, and +/- 1
        if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }

    return (
        <div className="flex items-center justify-center flex-wrap gap-2 mt-8">
            {hasPreviousPage ? (
                <Link
                    href={createPageUrl(page - 1)}
                    className="flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-[#222222] hover:text-[#007185] transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Trước
                </Link>
            ) : (
                <div className="flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-gray-400">
                    <ChevronLeft className="w-4 h-4" />
                    Trước
                </div>
            )}

            {pages.map((p, i) =>
                p === "..." ? (
                    <span key={`ellipsis-${i}`} className="text-[#6B7280] px-1">...</span>
                ) : (
                    <Link
                        key={`page-${p}`}
                        href={createPageUrl(p as number)}
                        className={`w-8 h-8 flex items-center justify-center rounded-sm text-[14px] font-medium transition-colors ${
                            p === page
                                ? "bg-[#232F3E] text-white font-bold"
                                : "text-[#222222] hover:bg-[#F7F7F7]"
                        }`}
                    >
                        {p}
                    </Link>
                )
            )}

            {hasNextPage ? (
                <Link
                    href={createPageUrl(page + 1)}
                    className="flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-[#222222] hover:text-[#007185] transition-colors"
                >
                    Sau
                    <ChevronRight className="w-4 h-4" />
                </Link>
            ) : (
                <div className="flex items-center gap-1 px-3 py-2 text-[14px] font-medium text-gray-400">
                    Sau
                    <ChevronRight className="w-4 h-4" />
                </div>
            )}
        </div>
    );
}