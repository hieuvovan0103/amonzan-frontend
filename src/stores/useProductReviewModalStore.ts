import { create } from "zustand";
import type { AdminProductReview } from "@/types/admin-product-review";

type ProductReviewModalState = {
  product: AdminProductReview | null;
  isOpen: boolean;
  open: (product: AdminProductReview) => void;
  close: () => void;
};

export const useProductReviewModalStore = create<ProductReviewModalState>((set) => ({
  product: null,
  isOpen: false,
  open: (product) => set({ product, isOpen: true }),
  close: () => set({ product: null, isOpen: false }),
}));
