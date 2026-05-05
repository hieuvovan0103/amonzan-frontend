import type { ShopProfileProduct } from "@/lib/api/shops";
import ShopProductCard from "./ShopProductCard";

type ShopProductsTabProps = {
    products: ShopProfileProduct[];
};

export default function ShopProductsTab({ products }: ShopProductsTabProps) {
    const safeProducts = products ?? [];

    return (
        <div>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-[20px] font-bold text-[#222222]">
                        Sản phẩm đang cho thuê
                    </h2>

                    <p className="mt-1 text-[13px] text-[#565959]">
                        Danh sách sản phẩm đang hoạt động của cửa hàng.
                    </p>
                </div>

                <select className="rounded-[4px] border border-[#D5D9D9] bg-white px-3 py-2 text-[13px] text-[#222222] outline-none focus:ring-2 focus:ring-[#FF9900]/40">
                    <option>Sắp xếp: Nổi bật</option>
                    <option>Giá thấp đến cao</option>
                    <option>Giá cao đến thấp</option>
                    <option>Đánh giá cao nhất</option>
                </select>
            </div>

            {safeProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {safeProducts.map((product) => (
                        <ShopProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="rounded-[6px] border border-dashed border-[#D5D9D9] bg-[#FAFAFA] p-6 text-[14px] text-[#565959]">
                    Cửa hàng chưa có sản phẩm đang hiển thị.
                </div>
            )}
        </div>
    );
}
