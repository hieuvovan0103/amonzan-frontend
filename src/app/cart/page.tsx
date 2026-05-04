'use client';

import { useMemo, useState } from 'react';
import CartHeader from './components/CartHeader';
import CartList from './components/CartList';
import CartSummary from './components/CartSummary';
import { INITIAL_CART } from '@/data/mockCart';
import { CartItem } from '@/types/cart';
import { formatPrice } from '@/app/utils/formatPrice';

export default function CartPage() {
    const [cartItems, setCartItems] = useState<CartItem[]>(INITIAL_CART);

    const { selectedCount, subtotal } = useMemo(() => {
        return cartItems.reduce(
            (acc, item) => {
                if (item.selected) {
                    acc.selectedCount += item.quantity;
                    acc.subtotal += item.price * item.quantity;
                }

                return acc;
            },
            { selectedCount: 0, subtotal: 0 }
        );
    }, [cartItems]);

    const allSelected =
        cartItems.length > 0 && cartItems.every((item) => item.selected);

    const handleToggleAll = () => {
        const newState = !allSelected;
        setCartItems((prev) =>
            prev.map((item) => ({
                ...item,
                selected: newState,
            }))
        );
    };

    const handleToggleItem = (id: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    return (
        <>
            <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                    <div className="flex-1 bg-[#FFFFFF] rounded-[16px] border border-[#E6E6E6] shadow-sm p-5 md:p-8">
                        <CartHeader
                            selectedCount={selectedCount}
                            allSelected={allSelected}
                            onToggleAll={handleToggleAll}
                        />

                        <CartList
                            cartItems={cartItems}
                            onToggleItem={handleToggleItem}
                        />

                        <div className="border-t border-[#E6E6E6] mt-8 pt-6 flex justify-end">
                            <div className="text-[18px] md:text-[20px] text-[#222222]">
                                Tạm tính ({selectedCount} sản phẩm):{' '}
                                <span className="font-bold">{formatPrice(subtotal)} VNĐ</span>
                            </div>
                        </div>
                    </div>

                    <CartSummary selectedCount={selectedCount} subtotal={subtotal} />
                </div>
            </main>
        </>
    );
}
