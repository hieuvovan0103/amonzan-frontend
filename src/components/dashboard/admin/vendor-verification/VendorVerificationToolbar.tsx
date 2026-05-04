import { Search } from "lucide-react";

type VendorVerificationToolbarProps = {
    searchValue: string;
    onSearchChange: (value: string) => void;
    sortValue: "newest" | "oldest";
    onSortChange: (value: "newest" | "oldest") => void;
};

export default function VendorVerificationToolbar({
    searchValue,
    onSearchChange,
    sortValue,
    onSortChange,
}: VendorVerificationToolbarProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 border-b border-gray-200 bg-gray-50/50 p-4 sm:flex-row">
            <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                <input
                    type="text"
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Tìm theo tên shop, SĐT..."
                    className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex w-full items-center space-x-2 sm:w-auto">
                <select
                    value={sortValue}
                    onChange={(event) =>
                        onSortChange(event.target.value as "newest" | "oldest")
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
                >
                    <option value="newest">Sắp xếp: Mới nhất</option>
                    <option value="oldest">Sắp xếp: Cũ nhất</option>
                </select>
            </div>
        </div>
    );
}