import { CartItem } from '@/types/cart';
import { formatPrice } from '@/app/utils/formatPrice';

type CartItemCardProps = {
    item: CartItem;
    onToggleItem: (id: number) => void;
};

export default function CartItemCard({
    item,
    onToggleItem,
}: CartItemCardProps) {
    return (
        <div className="flex gap-4 md:gap-6 items-start">
            <div className="pt-1">
                <input
                    type="checkbox"
                    checked={item.selected}
                    onChange={() => onToggleItem(item.id)}
                    className="w-4 h-4 accent-[#FF9900] cursor-pointer"
                />
            </div>

            <div className="w-[110px] h-[110px] md:w-[160px] md:h-[160px] rounded-[12px] overflow-hidden bg-[#F7F7F7] border border-[#E6E6E6] flex-shrink-0">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-between">
                    <div className="flex-1 min-w-0 flex flex-col">
                        <h2 className="text-[18px] md:text-[20px] font-bold text-[#222222] leading-[1.35] mb-2">
                            {item.title}
                        </h2>

                        <div className="text-[14px] text-[#222222] mb-1">
                            Thời gian thuê:{' '}
                            <span className="font-medium">{item.rentDates}</span>
                        </div>

                        <div className="text-[13px] text-[#565959] mb-3">
                            {item.pricePerDay}vnđ/ngày
                        </div>

                        <div className="flex items-center gap-4 text-[13px] text-[#222222] mb-4 flex-wrap">
                            <span>
                                <span className="font-semibold">Kích thước:</span> {item.size}
                            </span>
                            <span>
                                <span className="font-semibold">Màu sắc:</span> {item.color}
                            </span>
                        </div>

                        <div className="mt-auto">
                            <button className="flex items-center justify-between border border-[#D5D9D9] bg-[#F7F7F7] hover:bg-[#E6E6E6] rounded-[8px] px-4 py-1.5 min-w-[70px] transition-colors shadow-sm text-[14px] font-medium text-[#222222]">
                                {item.quantity}
                                <span className="ml-4 text-[10px] text-[#6B7280]">▼</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex md:flex-col justify-end items-end md:justify-start flex-shrink-0">
                        <div className="flex items-baseline gap-1">
                            <span className="text-[22px] md:text-[28px] font-bold text-[#C62828] leading-none">
                                {formatPrice(item.price)}
                            </span>
                            <span className="text-[13px] md:text-[14px] font-bold text-[#C62828]">
                                vnđ
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}