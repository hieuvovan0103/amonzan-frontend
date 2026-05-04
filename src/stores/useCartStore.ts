import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/cart";

type AddCartItemInput = Omit<CartItem, "id" | "quantity" | "selected"> & {
  quantity?: number;
};

type CartState = {
  items: CartItem[];
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
      items: [],

      addItem: (item) =>
        set((state) => {
          const id = createCartItemId(item);
          const existingItem = state.items.find((cartItem) => cartItem.id === id);

          if (existingItem) {
            return {
              items: state.items.map((cartItem) =>
                cartItem.id === id
                  ? {
                      ...cartItem,
                      quantity: cartItem.quantity + (item.quantity ?? 1),
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
                quantity: item.quantity ?? 1,
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
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item,
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
    },
  ),
);
