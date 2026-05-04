import { ChevronDown, Plus, Search, Loader2, PackageOpen, AlertCircle } from "lucide-react";
import { useState } from "react";
import VendorProductCard from "@/components/dashboard/vendor/VendorProductCard";
import AddProductModal from "@/components/dashboard/vendor/AddProductModal";
import { ApiProduct } from "@/types/vendor";

type VendorListingsViewProps = {
    products: ApiProduct[];
    isLoading: boolean;
    error: string | null;
    onSelectProduct: (product: ApiProduct) => void;
    onRefresh: () => void;
};

export default function VendorListingsView({
    products,
    isLoading,
    error,
    onSelectProduct,
    onRefresh,
}: VendorListingsViewProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-bold text-[14px] px-6 py-2 rounded-[8px] transition-colors shadow-sm flex items-center justify-center gap-2 whitespace-nowrap"
                >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                </button>
            </div>

            {error ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <h3 className="text-[16px] font-bold text-[#222222] mb-2">Đã có lỗi xảy ra</h3>
                    <p className="text-[14px] text-[#565959] mb-4">{error}</p>
                    <button onClick={onRefresh} className="px-4 py-2 border border-[#D5D9D9] rounded-lg text-[14px] font-medium hover:bg-[#F7F7F7]">
                        Thử lại
                    </button>
                </div>
            ) : isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white border border-[#E6E6E6] rounded-[16px] overflow-hidden shadow-sm animate-pulse">
                            <div className="w-full aspect-[4/5] bg-gray-200"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3 pt-2 mt-4 border-t border-[#E6E6E6]"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm">
                    <PackageOpen className="w-16 h-16 text-[#D5D9D9] mb-4" />
                    <h3 className="text-[18px] font-bold text-[#222222] mb-2">Chưa có sản phẩm nào</h3>
                    <p className="text-[14px] text-[#565959] max-w-[400px]">
                        Gian hàng của bạn hiện tại chưa có sản phẩm nào. Hãy đăng sản phẩm đầu tiên để bắt đầu cho thuê nhé.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <VendorProductCard
                            key={product.product_id}
                            product={product}
                            onSelect={onSelectProduct}
                        />
                    ))}
                </div>
            )}

            <AddProductModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onSuccess={onRefresh} 
            />
        </div>
    );
}