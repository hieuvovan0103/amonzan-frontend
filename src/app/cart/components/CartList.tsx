import React from 'react';
import { CartItem } from '@/types/cart';
import CartItemCard from './CartItemCard';

type CartListProps = {
    cartItems: CartItem[];
    onToggleItem: (id: number) => void;
};

export default function CartList({
    cartItems,
    onToggleItem,
}: CartListProps) {
    return (
        <div>
            {cartItems.map((item, index) => (
                <React.Fragment key={item.id}>
                    <CartItemCard item={item} onToggleItem={onToggleItem} />

                    {index < cartItems.length - 1 && (
                        <div className="w-full h-px bg-[#E6E6E6] my-6"></div>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}