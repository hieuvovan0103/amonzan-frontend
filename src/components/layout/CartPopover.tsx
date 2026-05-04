"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Trash2 } from "lucide-react";
import { formatPrice } from "@/app/utils/formatPrice";
import { useCartStore } from "@/stores/useCartStore";

export default function CartPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);

  const totalItems = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const previewItems = items.slice(-4).reverse();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 hover:text-[#FF9900]"
        aria-label="Giỏ hàng"
        aria-expanded={isOpen}
      >
        <ShoppingCart className="h-5 w-5" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF9900] px-1.5 text-[11px] font-bold leading-none text-[#111111] ring-2 ring-[#232F3E]">
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[320px] overflow-hidden rounded-[6px] border border-[#D5D9D9] bg-white text-[#222222] shadow-[0_12px_32px_rgba(15,17,17,0.22)]">
          <div className="border-b border-[#E6E6E6] px-4 py-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold">Giỏ hàng</h2>
              <span className="text-[13px] text-[#565959]">
                {totalItems} sản phẩm
              </span>
            </div>
          </div>

          {items.length > 0 ? (
            <>
              <div className="max-h-[360px] overflow-y-auto">
                {previewItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-[#E6E6E6] px-4 py-3 last:border-b-0"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-[4px] border border-[#E6E6E6] bg-[#F7F7F7]"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="line-clamp-2 text-[13px] font-semibold leading-[1.35] hover:text-[#E47911]"
                      >
                        {item.title}
                      </Link>
                      <div className="mt-1 text-[12px] text-[#565959]">
                        SL: {item.quantity}
                        {item.size ? ` • ${item.size}` : ""}
                      </div>
                      <div className="mt-1 text-[13px] font-bold text-[#C62828]">
                        {formatPrice(item.price * item.quantity)} VNĐ
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-[#565959] transition-colors hover:bg-[#F7F7F7] hover:text-[#C62828]"
                      aria-label="Xóa sản phẩm khỏi giỏ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E6E6E6] px-4 py-4">
                <div className="mb-3 flex items-center justify-between text-[14px]">
                  <span>Tạm tính</span>
                  <span className="font-bold text-[#C62828]">
                    {formatPrice(subtotal)} VNĐ
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="rounded-[4px] border border-[#D5D9D9] bg-white px-3 py-2 text-center text-[13px] font-semibold transition-colors hover:bg-[#F7F7F7]"
                  >
                    Xem giỏ
                  </Link>
                  <Link
                    href="/cart"
                    onClick={() => setIsOpen(false)}
                    className="rounded-[4px] border border-[#F0C14B] bg-[#FFD814] px-3 py-2 text-center text-[13px] font-semibold text-[#111111] transition-colors hover:bg-[#F0C14B]"
                  >
                    Thanh toán
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F7F7] text-[#565959]">
                <ShoppingCart className="h-6 w-6" />
              </div>
              <h3 className="mb-1 text-[15px] font-bold">
                Giỏ hàng của bạn đang trống
              </h3>
              <p className="mb-4 text-[13px] text-[#565959]">
                Thêm sản phẩm bạn muốn thuê để xem nhanh tại đây.
              </p>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="inline-flex rounded-[4px] border border-[#F0C14B] bg-[#FFD814] px-4 py-2 text-[13px] font-semibold text-[#111111] transition-colors hover:bg-[#F0C14B]"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
