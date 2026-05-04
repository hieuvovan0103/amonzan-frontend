"use client";

import { useAuthStore } from "@/stores/useAuthStore";

type BuyBoxProps = {
    price: string;
    location: string;
    storeName: string;
};

export default function BuyBox({
    price,
    location,
    storeName,
}: BuyBoxProps) {
    const { user } = useAuthStore();

    const handleAction = () => {
        if (!user) {
            window.location.href = "/signup";
            return;
        }
        // TODO: Proceed
    };

    return (
        <div className="border border-[#E6E6E6] rounded-[16px] p-5 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)] bg-white sticky top-[90px]">
            <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[28px] font-bold text-[#C62828] leading-none">
                    {price}
                </span>
                <span className="text-[14px] font-bold text-[#C62828]">vnđ</span>
            </div>

            <div className="text-[14px] text-[#222222] mb-4 space-y-1">
                <p>
                    Thời gian thuê từ <span className="font-semibold">31/01 - 28/02</span>{' '}
                    (28 ngày)
                </p>
                <p>
                    Giao hàng tới{' '}
                    <span className="font-semibold text-[#007185] cursor-pointer hover:text-[#E47911] hover:underline">
                        {location}
                    </span>
                </p>
            </div>

            <div className="space-y-3">
                <button 
                    onClick={handleAction}
                    className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-semibold text-[14px] py-3 rounded-[999px] transition-colors shadow-sm"
                >
                    Thêm vào giỏ
                </button>

                <button 
                    onClick={handleAction}
                    className="w-full bg-[#FF9900] hover:bg-[#E47911] text-[#111111] font-semibold text-[14px] py-3 rounded-[999px] transition-colors shadow-sm"
                >
                    Thuê ngay
                </button>
            </div>

            <div className="mt-4 pt-4 border-t border-[#E6E6E6] text-[13px] text-[#565959] space-y-2">
                <div className="flex justify-between">
                    <span>Giao hàng</span>
                    <span className="font-medium text-[#222222]">Amonzan</span>
                </div>

                <div className="flex justify-between gap-2">
                    <span>Cung cấp bởi</span>
                    <span className="font-medium text-[#007185] hover:text-[#E47911] hover:underline cursor-pointer text-right">
                        {storeName}
                    </span>
                </div>

                <div className="flex justify-between gap-2">
                    <span>Hoàn trả</span>
                    <span className="font-medium text-[#007185] hover:text-[#E47911] hover:underline cursor-pointer text-right">
                        Trả hàng trong 7 ngày
                    </span>
                </div>
            </div>
        </div>
    );
}