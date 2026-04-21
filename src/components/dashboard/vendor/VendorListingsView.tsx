import { ChevronDown, Plus, Search } from "lucide-react";
import VendorProductCard from "@/components/dashboard/vendor/VendorProductCard";
import { VendorProduct } from "@/types/vendor";

type VendorListingsViewProps = {
    products: VendorProduct[];
    onSelectProduct: (product: VendorProduct) => void;
};

export default function VendorListingsView({
    products,
    onSelectProduct,
}: VendorListingsViewProps) {
    return (
        <div className="flex-1 animate-in fade-in duration-300">
            <div className="bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-4 md:p-6 mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-1 gap-4 w-full">
                    <div className="relative flex-1 max-w-[300px]">
                        <input
                            type="text"
                            placeholder="Tìm sản phẩm của bạn..."
                            className="w-full border border-[#D5D9D9] rounded-[8px] pl-9 pr-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#FF9900]/30 focus:border-[#FF9900]"
                        />
                        <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="relative w-[160px]">
                        <select className="w-full appearance-none border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] text-[#222222] outline-none focus:border-[#FF9900] bg-white cursor-pointer">
                            <option>Tất cả trạng thái</option>
                            <option>Đang hoạt động</option>
                            <option>Đã ẩn</option>
                            <option>Đang cho thuê</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>

                <button
                    type="button"
                    className="w-full sm:w-auto bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-bold text-[14px] px-6 py-2 rounded-[8px] transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {products.map((product) => (
                    <VendorProductCard
                        key={product.id}
                        product={product}
                        onSelect={onSelectProduct}
                    />
                ))}
            </div>
        </div>
    );
}