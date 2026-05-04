import React from 'react';
import type { CartItem } from '@/types/cart';
import CartItemCard from './CartItemCard';

type CartListProps = {
    cartItems: CartItem[];
    onToggleItem: (id: string) => void;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
};

export default function CartList({
    cartItems,
    onToggleItem,
    onUpdateQuantity,
    onRemoveItem,
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
                    />

                    {index < cartItems.length - 1 && (
                        <div className="w-full h-px bg-[#E6E6E6] my-6"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}
