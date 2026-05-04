"use client";

import { useState } from "react";
import { ChevronLeft, Edit2, RefreshCw, Trash2, Loader2 } from "lucide-react";
import { ApiProduct, VendorProductStatus } from "@/types/vendor";
import { updateVendorProductStatus } from "@/lib/api/vendor";
import { useToastStore } from "@/stores/useToastStore";

type VendorProductDetailViewProps = {
  product: ApiProduct;
  onBack: () => void;
  onUpdate: () => void;
};

export default function VendorProductDetailView({
  product,
  onBack,
  onUpdate,
}: VendorProductDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<VendorProductStatus>(product.status);
  const [isSaving, setIsSaving] = useState(false);
  const { show: showToast } = useToastStore();

  const totalStock = product.product_variants?.reduce((sum, v) => sum + v.available_stock, 0) || 0;
  const basePrice = product.product_variants?.[0]?.base_daily_rate || 0;
  const primaryImage = product.product_images?.find(i => i.is_primary)?.image_url 
      || product.product_images?.[0]?.image_url 
      || "https://placehold.co/400x500?text=No+Image";

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này? Sản phẩm sẽ được chuyển sang trạng thái lưu trữ.")) return;
    
    setIsSaving(true);
    try {
      await updateVendorProductStatus(product.product_id, "ARCHIVED");
      showToast("Đã xóa sản phẩm thành công", "success");
      onUpdate();
      onBack();
    } catch (error: any) {
      showToast(error.message || "Lỗi khi xóa sản phẩm", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    if (status !== product.status) {
      setIsSaving(true);
      try {
        await updateVendorProductStatus(product.product_id, status);
        showToast("Cập nhật trạng thái thành công", "success");
        onUpdate();
        setIsEditing(false);
      } catch (error: any) {
        showToast(error.message || "Lỗi khi cập nhật trạng thái", "error");
      } finally {
        setIsSaving(false);
      }
    } else {
        setIsEditing(false);
    }
  };

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
              src={primaryImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[24px] font-bold text-[#222222] tracking-[-0.02em] mb-2">
                {product.name}
              </h1>
              <p className="text-[14px] text-[#565959]">
                Mã sản phẩm: <span className="font-bold">{product.product_id.split('-')[0]}</span>
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
                onClick={handleDelete}
                disabled={isSaving}
                className="bg-[#FCF4F4] hover:bg-[#F9E8E8] border border-[#C62828] text-[#C62828] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2 disabled:opacity-50"
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
                  defaultValue={`${new Intl.NumberFormat('vi-VN').format(basePrice)} vnđ`}
                  disabled
                  className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] outline-none disabled:bg-[#F7F7F7]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-[#565959] mb-2">
                  Tổng Tồn kho
                </label>
                <input
                  type="number"
                  value={totalStock}
                  disabled
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
                  <option value="ACTIVE">Đang hoạt động</option>
                  <option value="DRAFT">Bản nháp</option>
                  <option value="ARCHIVED">Lưu trữ</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-[#F7F7F7] border border-[#E6E6E6] rounded-[12px] p-4">
                <div className="text-[13px] text-[#565959] mb-1">Đánh giá</div>
                <div className="text-[20px] font-bold text-[#222222]">
                  Chưa có
                </div>
                <div className="text-[13px] text-[#565959]">
                  0 lượt đánh giá
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
                onClick={handleSave}
                disabled={isSaving}
                className="bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-bold text-[14px] px-6 py-2 rounded-[8px] flex items-center justify-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}