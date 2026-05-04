'use client';

import { useMemo } from 'react';
import CartHeader from './components/CartHeader';
import CartList from './components/CartList';
import CartSummary from './components/CartSummary';
import { formatPrice } from '@/app/utils/formatPrice';
import { useCartStore } from '@/stores/useCartStore';

export default function CartPage() {
    const cartItems = useCartStore((state) => state.items);
    const toggleItem = useCartStore((state) => state.toggleItem);
    const toggleAll = useCartStore((state) => state.toggleAll);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

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
        toggleAll(!allSelected);
    };

    return (
        <>
            <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
                    <div className="flex-1 bg-[#FFFFFF] rounded-[6px] border border-[#E6E6E6] shadow-sm p-5 md:p-8">
                        <CartHeader
                            selectedCount={selectedCount}
                            allSelected={allSelected}
                            onToggleAll={handleToggleAll}
                        />

                        {cartItems.length > 0 ? (
                            <CartList
                                cartItems={cartItems}
                                onToggleItem={toggleItem}
                                onUpdateQuantity={updateQuantity}
                                onRemoveItem={removeItem}
                            />
                        ) : (
                            <div className="py-16 text-center">
                                <h2 className="mb-2 text-[20px] font-bold text-[#222222]">
                                    Giỏ hàng của bạn đang trống
                                </h2>
                                <p className="text-[14px] text-[#565959]">
                                    Hãy thêm sản phẩm bạn muốn thuê để xem tại đây.
                                </p>
                            </div>
                        )}

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
