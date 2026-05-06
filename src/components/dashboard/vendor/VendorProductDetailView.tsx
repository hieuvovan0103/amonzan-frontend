"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Edit2, Loader2, Save, Send, Trash2 } from "lucide-react";
import { getPublicCategories } from "@/lib/api/categories";
import type { ProductCategory } from "@/lib/api/categories";
import { ApiProduct } from "@/types/vendor";
import {
  submitVendorProductForReview,
  updateVendorProduct,
  updateVendorProductStatus,
} from "@/lib/api/vendor";
import { useToastStore } from "@/stores/useToastStore";

type VendorProductDetailViewProps = {
  product: ApiProduct;
  onBack: () => void;
  onUpdate: () => void;
};

const statusLabels: Record<ApiProduct["status"], string> = {
  DRAFT: "Bản nháp",
  PENDING_REVIEW: "Đang chờ admin duyệt",
  APPROVED: "Đã được duyệt",
  REJECTED: "Bị từ chối",
  ARCHIVED: "Đã lưu trữ",
};

export default function VendorProductDetailView({
  product,
  onBack,
  onUpdate,
}: VendorProductDetailViewProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [form, setForm] = useState({
    name: product.name,
    description: product.description ?? "",
    category_id: product.category_id ?? "",
  });
  const { show: showToast } = useToastStore();

  const totalStock = product.product_variants?.reduce((sum, v) => sum + v.available_stock, 0) || 0;
  const basePrice = product.product_variants?.[0]?.base_daily_rate || 0;
  const primaryImage = product.product_images?.find(i => i.is_primary)?.image_url
      || product.product_images?.[0]?.image_url
      || "https://placehold.co/400x500?text=No+Image";
  const canSubmitReview = product.status === "DRAFT" || product.status === "REJECTED";
  const canEdit = product.status === "DRAFT" || product.status === "REJECTED";
  const isLocked = product.status === "PENDING_REVIEW";

  useEffect(() => {
    setForm({
      name: product.name,
      description: product.description ?? "",
      category_id: product.category_id ?? "",
    });
  }, [product]);

  useEffect(() => {
    getPublicCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleArchive = async () => {
    if (!confirm("Bạn có chắc chắn muốn lưu trữ sản phẩm này?")) return;

    setIsSaving(true);
    try {
      await updateVendorProductStatus(product.product_id, "ARCHIVED");
      showToast("Đã lưu trữ sản phẩm.", "success");
      onUpdate();
      onBack();
    } catch (error: any) {
      showToast(error.message || "Không thể lưu trữ sản phẩm.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitReview = async () => {
    setIsSaving(true);
    try {
      await submitVendorProductForReview(product.product_id);
      showToast("Đã gửi sản phẩm cho admin duyệt.", "success");
      onUpdate();
    } catch (error: any) {
      showToast(error.message || "Không thể gửi duyệt sản phẩm.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!form.name.trim() || !form.category_id) {
      showToast("Tên sản phẩm và danh mục là bắt buộc.", "error");
      return;
    }

    setIsSaving(true);
    try {
      await updateVendorProduct(product.product_id, {
        name: form.name.trim(),
        description: form.description.trim() || null,
        category_id: form.category_id,
      });
      showToast("Đã lưu chỉnh sửa sản phẩm.", "success");
      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      showToast(error.message || "Không thể lưu sản phẩm.", "error");
    } finally {
      setIsSaving(false);
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
            <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex-1 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[24px] font-bold text-[#222222] tracking-[-0.02em] mb-2">
                {product.name}
              </h1>
              <p className="text-[14px] text-[#565959]">
                Mã sản phẩm: <span className="font-bold">{product.product_id.split("-")[0]}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setIsEditing((value) => !value)}
                  disabled={isSaving}
                  className="bg-white hover:bg-[#F7F7F7] border border-[#D5D9D9] text-[#222222] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? "Hủy chỉnh sửa" : "Chỉnh sửa"}
                </button>
              )}

              {canSubmitReview && (
                <button
                  type="button"
                  onClick={handleSubmitReview}
                  disabled={isSaving}
                  className="bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2 disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Gửi duyệt
                </button>
              )}

              <button
                type="button"
                onClick={handleArchive}
                disabled={isSaving || isLocked}
                className="bg-[#FCF4F4] hover:bg-[#F9E8E8] border border-[#C62828] text-[#C62828] px-4 py-2 rounded-[8px] text-[13px] font-bold flex items-center gap-2 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Lưu trữ
              </button>
            </div>
          </div>

          {product.status === "REJECTED" && product.rejection_reason && (
            <div className="mb-6 rounded-[8px] border border-[#C62828]/30 bg-[#FCF4F4] p-4">
              <div className="mb-1 text-[14px] font-bold text-[#C62828]">Lý do bị từ chối</div>
              <p className="text-[14px] leading-6 text-[#222222]">{product.rejection_reason}</p>
            </div>
          )}

          {isLocked && (
            <div className="mb-6 rounded-[8px] border border-[#F0C14B] bg-[#FFF8E6] p-4 text-[14px] text-[#8A5A00]">
              Sản phẩm đang chờ admin duyệt nên bạn chưa thể chỉnh sửa trực tiếp.
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {isEditing ? (
                <>
                  <EditField
                    label="Tên sản phẩm"
                    value={form.name}
                    onChange={(value) => setForm((prev) => ({ ...prev, name: value }))}
                  />
                  <div>
                    <label className="block text-[13px] font-bold text-[#565959] mb-2">Danh mục</label>
                    <select
                      value={form.category_id}
                      onChange={(event) =>
                        setForm((prev) => ({ ...prev, category_id: event.target.value }))
                      }
                      className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900]"
                    >
                      <option value="">Chọn danh mục</option>
                      {categories.map((category) => (
                        <option key={category.category_id} value={category.category_id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <InfoField label="Danh mục" value={product.categories?.name ?? "Chưa có"} />
              )}
              <InfoField label="Trạng thái" value={statusLabels[product.status]} />
              <InfoField label="Giá thuê mỗi ngày" value={`${new Intl.NumberFormat("vi-VN").format(basePrice)} vnđ`} />
              <InfoField label="Tổng tồn kho" value={String(totalStock)} />
            </div>

            <div className="space-y-4">
              <div className="rounded-[12px] border border-[#E6E6E6] bg-[#F7F7F7] p-4">
                <div className="mb-2 text-[13px] font-bold text-[#565959]">Mô tả</div>
                {isEditing ? (
                  <textarea
                    rows={6}
                    value={form.description}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, description: event.target.value }))
                    }
                    className="w-full rounded-[6px] border border-[#D5D9D9] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900]"
                  />
                ) : (
                  <p className="whitespace-pre-line text-[14px] leading-6 text-[#222222]">
                    {product.description || "Chưa có mô tả sản phẩm."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleSaveProduct}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-[8px] border border-[#F0C14B] bg-[#FFD814] px-5 py-2 text-[14px] font-bold text-[#111111] hover:bg-[#F0C14B] disabled:opacity-60"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Lưu chỉnh sửa
              </button>
            </div>
          )}

          <div className="mt-6 overflow-hidden rounded-[8px] border border-[#E6E6E6]">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#F7F7F7] text-[#565959]">
                <tr>
                  <th className="p-3 font-semibold">SKU</th>
                  <th className="p-3 font-semibold">Biến thể</th>
                  <th className="p-3 font-semibold text-right">Giá/ngày</th>
                  <th className="p-3 font-semibold text-center">Tồn kho</th>
                </tr>
              </thead>
              <tbody>
                {(product.product_variants ?? []).map((variant) => (
                  <tr key={variant.variant_id} className="border-t border-[#E6E6E6]">
                    <td className="p-3">{variant.sku}</td>
                    <td className="p-3">{variant.variant_name}</td>
                    <td className="p-3 text-right font-bold">
                      {new Intl.NumberFormat("vi-VN").format(variant.base_daily_rate)} vnđ
                    </td>
                    <td className="p-3 text-center">{variant.total_stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-[#565959] mb-2">{label}</label>
      <input
        type="text"
        value={value}
        disabled
        className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] outline-none disabled:bg-[#F7F7F7]"
      />
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-[13px] font-bold text-[#565959] mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full border border-[#D5D9D9] rounded-[8px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900]"
      />
    </div>
  );
}
