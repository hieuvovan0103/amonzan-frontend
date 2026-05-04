import { formatPrice } from "@/app/utils/formatPrice";
import type { ProductDetail } from "@/lib/api/products";

type ProductSpecsProps = {
    product: ProductDetail;
};

function unique(values: string[]) {
    return Array.from(new Set(values.filter(Boolean)));
}

export default function ProductSpecs({ product }: ProductSpecsProps) {
    const conditions = unique(product.variants.map((variant) => variant.condition));
    const totalStock = product.variants.reduce(
        (total, variant) => total + Number(variant.total_stock ?? 0),
        0,
    );
    const availableStock = product.variants.reduce(
        (total, variant) => total + Number(variant.available_stock ?? 0),
        0,
    );
    const deposits = product.variants.map((variant) => Number(variant.deposit_requirement ?? 0));
    const minDeposit = deposits.length ? Math.min(...deposits) : 0;
    const sizeNames = product.availableSizes
        .map((size) => size.name)
        .filter((size) => size.trim().toLowerCase() !== "mặc định");

    return (
        <section
            id="thong-tin-san-pham"
            className="py-8 border-t border-[#E6E6E6]"
        >
            <h2 className="text-[20px] font-bold text-[#222222] mb-6">
                Thông tin sản phẩm
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                <div className="bg-[#F7F7F7] rounded-[6px] p-6 border border-[#E6E6E6]">
                    <h3 className="text-[16px] font-bold text-[#222222] border-b border-[#D5D9D9] pb-2 mb-4">
                        Chi tiết
                    </h3>

                    <div className="grid grid-cols-2 gap-y-3 text-[14px]">
                        <span className="font-medium text-[#565959]">Danh mục</span>
                        <span className="text-[#222222]">{product.categoryName || "Chưa phân loại"}</span>

                        <span className="font-medium text-[#565959]">Cửa hàng</span>
                        <span className="text-[#222222]">{product.storeName}</span>

                        <span className="font-medium text-[#565959]">Khu vực</span>
                        <span className="text-[#222222]">{product.location || "Chưa cập nhật"}</span>

                        <span className="font-medium text-[#565959]">Tình trạng</span>
                        <span className="text-[#222222]">{conditions.join(", ") || "Chưa cập nhật"}</span>
                    </div>
                </div>

                <div className="bg-[#F7F7F7] rounded-[6px] p-6 border border-[#E6E6E6]">
                    <h3 className="text-[16px] font-bold text-[#222222] border-b border-[#D5D9D9] pb-2 mb-4">
                        Thuê & tồn kho
                    </h3>

                    <div className="grid grid-cols-2 gap-y-3 text-[14px]">
                        <span className="font-medium text-[#565959]">Giá từ</span>
                        <span className="text-[#222222]">{product.price} vnđ/ngày</span>

                        <span className="font-medium text-[#565959]">Tiền cọc từ</span>
                        <span className="text-[#222222]">{formatPrice(minDeposit)} VNĐ</span>

                        <span className="font-medium text-[#565959]">Tồn kho</span>
                        <span className="text-[#222222]">{availableStock}/{totalStock}</span>

                        <span className="font-medium text-[#565959]">Size</span>
                        <span className="text-[#222222]">{sizeNames.length ? sizeNames.join(", ") : "Không áp dụng"}</span>
                    </div>
                </div>
            </div>

            {product.shopDescription && (
                <div className="mt-4 max-w-4xl rounded-[6px] border border-[#E6E6E6] bg-white p-5 text-[14px] leading-[1.6] text-[#222222]">
                    <h3 className="mb-2 text-[16px] font-bold">Thông tin cửa hàng</h3>
                    <p>{product.shopDescription}</p>
                </div>
            )}
        </section>
    );
}
