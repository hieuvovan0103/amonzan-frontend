"use client";

import { FormEvent, useEffect, useState } from "react";
import { Edit3, Loader2, Plus, Power, RotateCcw, Save } from "lucide-react";
import {
    createAdminCategory,
    deactivateAdminCategory,
    getAdminCategories,
    updateAdminCategory,
} from "@/lib/api/categories";
import type { ProductCategory } from "@/lib/api/categories";
import { useToastStore } from "@/stores/useToastStore";

type CategoryForm = {
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
};

const emptyForm: CategoryForm = {
    name: "",
    slug: "",
    description: "",
    is_active: true,
};

const CATEGORY_DRAFT_STORAGE_KEY = "amonzan-admin-category-draft";

type CategoryDraft = {
    form: CategoryForm;
    editingId: string | null;
};

function generateSlug(value: string) {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[đĐ]/g, "d")
        .replace(/([^0-9a-z-\s])/g, "")
        .replace(/(\s+)/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export default function CategoriesPage() {
    const { show: showToast } = useToastStore();
    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [form, setForm] = useState<CategoryForm>(emptyForm);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [hasRestoredDraft, setHasRestoredDraft] = useState(false);

    const loadCategories = async () => {
        setIsLoading(true);
        setError("");

        try {
            setCategories(await getAdminCategories());
        } catch (err: any) {
            setError(err.message || "Không thể tải danh mục.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        const rawDraft = window.localStorage.getItem(CATEGORY_DRAFT_STORAGE_KEY);

        if (rawDraft) {
            try {
                const draft = JSON.parse(rawDraft) as CategoryDraft;
                if (draft?.form) {
                    setForm({
                        name: draft.form.name ?? "",
                        slug: draft.form.slug ?? "",
                        description: draft.form.description ?? "",
                        is_active: draft.form.is_active ?? true,
                    });
                    setEditingId(draft.editingId ?? null);
                }
            } catch {
                window.localStorage.removeItem(CATEGORY_DRAFT_STORAGE_KEY);
            }
        }

        setHasRestoredDraft(true);
    }, []);

    useEffect(() => {
        if (!hasRestoredDraft) return;

        const hasDraft =
            editingId ||
            form.name.trim() ||
            form.slug.trim() ||
            form.description.trim() ||
            !form.is_active;

        if (!hasDraft) {
            window.localStorage.removeItem(CATEGORY_DRAFT_STORAGE_KEY);
            return;
        }

        window.localStorage.setItem(
            CATEGORY_DRAFT_STORAGE_KEY,
            JSON.stringify({ form, editingId }),
        );
    }, [editingId, form, hasRestoredDraft]);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        window.localStorage.removeItem(CATEGORY_DRAFT_STORAGE_KEY);
    };

    const handleNameChange = (name: string) => {
        setForm((prev) => ({
            ...prev,
            name,
            slug: editingId ? prev.slug : generateSlug(name),
        }));
    };

    const handleEdit = (category: ProductCategory) => {
        setEditingId(category.category_id);
        setForm({
            name: category.name,
            slug: category.slug,
            description: category.description ?? "",
            is_active: category.is_active,
        });
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!form.name.trim() || !form.slug.trim()) {
            showToast("Tên và slug danh mục là bắt buộc.", "error");
            return;
        }

        setIsSaving(true);

        try {
            const payload = {
                name: form.name.trim(),
                slug: form.slug.trim(),
                description: form.description.trim() || null,
                is_active: form.is_active,
            };

            if (editingId) {
                await updateAdminCategory(editingId, payload);
                showToast("Đã cập nhật danh mục.", "success");
            } else {
                await createAdminCategory(payload);
                showToast("Đã tạo danh mục.", "success");
            }

            resetForm();
            await loadCategories();
        } catch (err: any) {
            showToast(err.message || "Không thể lưu danh mục.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggle = async (category: ProductCategory) => {
        try {
            if (category.is_active) {
                await deactivateAdminCategory(category.category_id);
            } else {
                await updateAdminCategory(category.category_id, { is_active: true });
            }

            await loadCategories();
        } catch (err: any) {
            showToast(err.message || "Không thể cập nhật trạng thái danh mục.", "error");
        }
    };

    return (
        <div className="p-6 animate-in fade-in duration-500">
            <div className="mb-6">
                <h1 className="text-[24px] font-bold text-[#222222]">Quản lý danh mục</h1>
                <p className="text-[14px] text-[#565959] mt-1">
                    Admin tạo, chỉnh sửa và bật/tắt danh mục sản phẩm marketplace.
                </p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[360px_1fr] gap-6">
                <form
                    onSubmit={handleSubmit}
                    className="bg-white rounded-[8px] border border-[#E6E6E6] shadow-sm p-5 h-fit"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-[16px] font-bold text-[#222222]">
                            {editingId ? "Sửa danh mục" : "Tạo danh mục"}
                        </h2>
                        {editingId && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="inline-flex items-center gap-1.5 text-[13px] font-bold text-[#007185] hover:underline"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Hủy sửa
                            </button>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                Tên danh mục <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={form.name}
                                onChange={(event) => handleNameChange(event.target.value)}
                                className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                placeholder="Ví dụ: Trang phục"
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={form.slug}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, slug: generateSlug(event.target.value) }))
                                }
                                className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                placeholder="trang-phuc"
                            />
                        </div>

                        <div>
                            <label className="block text-[13px] font-bold text-[#222222] mb-1">
                                Mô tả
                            </label>
                            <textarea
                                rows={3}
                                value={form.description}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, description: event.target.value }))
                                }
                                className="w-full border border-[#D5D9D9] rounded-[4px] px-3 py-2 text-[14px] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                                placeholder="Mô tả ngắn cho danh mục"
                            />
                        </div>

                        <label className="flex items-center gap-2 text-[13px] font-bold text-[#222222]">
                            <input
                                type="checkbox"
                                checked={form.is_active}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, is_active: event.target.checked }))
                                }
                                className="h-4 w-4 accent-[#FF9900]"
                            />
                            Đang hoạt động
                        </label>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#232F3E] px-4 py-2.5 text-[14px] font-bold text-white hover:bg-[#111111] disabled:opacity-70"
                        >
                            {isSaving ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : editingId ? (
                                <Save className="w-4 h-4" />
                            ) : (
                                <Plus className="w-4 h-4" />
                            )}
                            {editingId ? "Lưu thay đổi" : "Tạo danh mục"}
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-[8px] border border-[#E6E6E6] overflow-hidden shadow-sm">
                    {isLoading ? (
                        <div className="p-8 flex items-center justify-center gap-2 text-[14px] text-[#565959]">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang tải danh mục...
                        </div>
                    ) : error ? (
                        <div className="p-8 text-[14px] text-[#C62828]">{error}</div>
                    ) : categories.length === 0 ? (
                        <div className="p-8 text-[14px] text-[#565959]">Chưa có danh mục nào.</div>
                    ) : (
                        <table className="w-full text-left text-[13px]">
                            <thead className="bg-[#F7F7F7] border-b border-[#E6E6E6] text-[#565959]">
                                <tr>
                                    <th className="p-4 font-semibold">Tên danh mục</th>
                                    <th className="p-4 font-semibold">Slug</th>
                                    <th className="p-4 font-semibold">Trạng thái</th>
                                    <th className="p-4 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((category) => (
                                    <tr
                                        key={category.category_id}
                                        className="border-b border-[#E6E6E6] hover:bg-[#F9FAFB] transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="font-bold text-[#222222]">{category.name}</div>
                                            {category.description && (
                                                <div className="text-[12px] text-[#6B7280] line-clamp-1">
                                                    {category.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-[#565959]">{category.slug}</td>
                                        <td className="p-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-bold ${
                                                    category.is_active
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-gray-100 text-gray-600"
                                                }`}
                                            >
                                                {category.is_active ? "Đang bật" : "Đã tắt"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => handleEdit(category)}
                                                    className="p-2 rounded-[4px] border border-[#D5D9D9] text-[#007185] hover:bg-[#F7F7F7]"
                                                    title="Sửa danh mục"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggle(category)}
                                                    className="p-2 rounded-[4px] border border-[#D5D9D9] text-[#565959] hover:bg-[#F7F7F7]"
                                                    title={category.is_active ? "Tắt danh mục" : "Bật danh mục"}
                                                >
                                                    <Power className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
