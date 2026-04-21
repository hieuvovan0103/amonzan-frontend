"use client";

import { useState } from "react";
import { ChevronLeft, Edit2, RefreshCw, Trash2 } from "lucide-react";
import { VendorProduct, VendorProductStatus } from "@/types/vendor";

type VendorProductDetailViewProps = {
  product: VendorProduct;
  onBack: () => void;
};

export default function VendorProductDetailView({
  product,
  onBack,
}: VendorProductDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<VendorProductStatus>(product.status);
  const [stock, setStock] = useState(product.stock);

  return (
    <div className="flex-1 animate-in slide-in-from-right-4 duration-300">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-[14px] text-[#007185] hover:text-[#E47911] hover:underline mb-6 font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Quay lại danh sách
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-[35%] flex flex-col gap-4">
          <div className="w-full aspect-[4/5] bg-[#F7F7F7] rounded-[16px] overflow-hidden border border-[#E6E6E6]">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[24px] font-bold text-[#222222] tracking-[-0.02em] mb-2">
                {product.title}
              </h1>
              <p className="text-[14px] text-[#565959]">
                Mã sản phẩm: <span className="font-bold">{product.id}</span>
              </p>
              <p className="text-[14px] text-[#565959]">
                Gian hàng: <span className="font-bold">{product.shop}</span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditing((prev) => !prev)}
                className="bg-white hover:bg-[#F7F7F7] border border-[#D5D9D9] text-[#222222] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
              </button>

              <button
                type="button"
                className="bg-[#FCF4F4] hover:bg-[#F9E8E8] border border-[#C62828] text-[#C62828] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Xóa
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-bold text-[#565959] mb-2">
                  Giá thuê mỗi ngày
                </label>
                <input
                  type="text"
                  defaultValue={`${product.price} vnđ`}
                  disabled={!isEditing}
                  className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] outline-none disabled:bg-[#F7F7F7]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#565959] mb-2">
                  Tồn kho
                </label>
                <input
                  type="number"
                  value={stock}
                  disabled={!isEditing}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] outline-none disabled:bg-[#F7F7F7]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#565959] mb-2">
                  Trạng thái
                </label>
                <select
                  value={status}
                  disabled={!isEditing}
                  onChange={(e) => setStatus(e.target.value as VendorProductStatus)}
                  className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] outline-none disabled:bg-[#F7F7F7]"
                >
                  <option value="ENABLE">Đang hoạt động</option>
                  <option value="DISABLE">Đã ẩn</option>
                  <option value="IN_USE">Đang được thuê</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F7F7F7] border border-[#E6E6E6] rounded-[12px] p-4">
                <div className="text-[13px] text-[#565959] mb-1">Đánh giá</div>
                <div className="text-[20px] font-bold text-[#222222]">
                  {product.rating.toFixed(1)} / 5
                </div>
                <div className="text-[13px] text-[#565959]">
                  {product.reviews} lượt đánh giá
                </div>
              </div>

              <div className="bg-[#F7F7F7] border border-[#E6E6E6] rounded-[12px] p-4">
                <div className="text-[13px] text-[#565959] mb-1">
                  Đồng bộ tồn kho
                </div>
                <button
                  type="button"
                  className="mt-2 bg-white hover:bg-[#EFEFEF] border border-[#D5D9D9] text-[#222222] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Làm mới tồn kho
                </button>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-bold text-[14px] px-6 py-2 rounded-[8px]"
              >
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}