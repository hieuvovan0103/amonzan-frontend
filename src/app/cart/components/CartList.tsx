import React from 'react';
import type { CartItem } from '@/types/cart';
import type { CartStockIssue } from '@/lib/cart-stock';
import CartItemCard from './CartItemCard';

type CartListProps = {
    cartItems: CartItem[];
    onToggleItem: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    stockIssues?: CartStockIssue[];
};

export default function CartList({
    cartItems,
    onToggleItem,
    onUpdateQuantity,
    onRemoveItem,
    stockIssues = [],
}: CartListProps) {
    return (
        <div>
            {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                    <CartItemCard
                        item={item}
                        onToggleItem={onToggleItem}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                        stockIssue={stockIssues.find((issue) => issue.itemId === item.id)}
                    />

                    {index < cartItems.length - 1 && (
                        <div className="w-full h-px bg-[#E6E6E6] my-6"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
