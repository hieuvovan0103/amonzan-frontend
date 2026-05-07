import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

type AddCartItemInput = Omit<CartItem, "id" | "quantity" | "selected"> & {
  quantity?: number;
};

type CartState = {
  hasHydrated: boolean;
  items: CartItem[];
  setHasHydrated: (hasHydrated: boolean) => void;
  addItem: (item: AddCartItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleItem: (id: string) => void;
  toggleAll: (selected: boolean) => void;
  clearCart: () => void;
};

function createCartItemId(
  item: Pick<CartItem, "productId" | "variantId" | "size" | "color" | "rentDates">,
) {
  return [item.productId, item.variantId ?? item.size, item.color, item.rentDates].join("::");
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      hasHydrated: false,
      items: [],

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      addItem: (item) =>
        set((state) => {
          const id = createCartItemId(item);
          const existingItem = state.items.find((cartItem) => cartItem.id === id);
          const requestedQuantity = item.quantity ?? 1;
          const maxQuantity = item.availableStock && item.availableStock > 0
            ? item.availableStock
            : undefined;

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === id
                  ? {
                      ...cartItem,
                      availableStock: item.availableStock ?? cartItem.availableStock,
                      quantity: Math.min(
                        cartItem.quantity + requestedQuantity,
                        maxQuantity ?? cartItem.availableStock ?? cartItem.quantity + requestedQuantity,
                      ),
                      selected: true,
                    }
                  : cartItem,
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                id,
                quantity: Math.min(requestedQuantity, maxQuantity ?? requestedQuantity),
                selected: true,
              },
            ],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity: Math.min(
                    Math.max(1, quantity),
                    item.availableStock && item.availableStock > 0
                      ? item.availableStock
                      : Math.max(1, quantity),
                  ),
                }
              : item,
          ),
        })),

      toggleItem: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, selected: !item.selected } : item,
          ),
        })),

      toggleAll: (selected) =>
        set((state) => ({
          items: state.items.map((item) => ({ ...item, selected })),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: "amonzan-cart",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
