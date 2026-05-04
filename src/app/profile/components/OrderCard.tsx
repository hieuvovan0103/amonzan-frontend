import { RentalOrder } from '@/types/user-profile';

type OrderCardProps = {
    order: RentalOrder;
};

export default function OrderCard({ order }: OrderCardProps) {
    return (
        <div className="border border-[#D5D9D9] rounded-[12px] overflow-hidden hover:shadow-sm transition-shadow">
            <div className="bg-[#F7F7F7] px-5 py-3 border-b border-[#D5D9D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[12px] sm:text-[13px]">
                <div className="flex gap-8">
                    <div>
                        <span className="block text-[#565959] font-medium uppercase tracking-wider text-[10px] sm:text-[11px] mb-0.5">
                            Ngày đặt
                        </span>
                        <span className="text-[#222222] font-medium">
                            {order.datePlaced}
                        </span>
                    </div>

                    <div>
                        <span className="block text-[#565959] font-medium uppercase tracking-wider text-[10px] sm:text-[11px] mb-0.5">
                            Tổng thanh toán
                        </span>
                        <span className="text-[#222222] font-medium">{order.total} ₫</span>
                    </div>

                    <div className="hidden md:block">
                        <span className="block text-[#565959] font-medium uppercase tracking-wider text-[10px] sm:text-[11px] mb-0.5">
                            Shop cung cấp
                        </span>
                        <span className="text-[#007185] hover:text-[#E47911] hover:underline cursor-pointer font-medium">
                            {order.shop}
                        </span>
                    </div>
                </div>

                <div className="flex flex-col sm:items-end">
                    <span className="text-[#565959] font-medium uppercase tracking-wider text-[10px] sm:text-[11px] mb-0.5">
                        Mã đơn hàng
                    </span>
                    <span className="text-[#007185] hover:text-[#E47911] hover:underline cursor-pointer font-medium">
                        {order.id}
                    </span>
                </div>
            </div>

            <div className="p-5 flex flex-col md:flex-row gap-6 bg-white">
                <div className="flex-1">
                    <h3
                        className={`text-[16px] font-bold mb-1 ${order.status === 'COMPLETED'
                                ? 'text-[#007600]'
                                : order.status === 'ACTIVE_RENTAL'
                                    ? 'text-purple-700'
                                    : 'text-[#222222]'
                            }`}
                    >
                        {order.statusText}
                    </h3>

                    <p className="text-[13px] text-[#222222] mb-4">
                        {order.deliveryInfo}
                    </p>

                    <div className="flex gap-4">
                        <div className="w-[90px] h-[90px] bg-[#F7F7F7] rounded-[8px] border border-[#E6E6E6] overflow-hidden flex-shrink-0">
                            <img
                                src={order.item.image}
                                alt={order.item.title}
                                className="w-full h-full object-cover mix-blend-multiply"
                            />
                        </div>

                        <div className="flex flex-col">
                            <a
                                href="#"
                                className="text-[14px] font-bold text-[#007185] hover:text-[#E47911] hover:underline leading-[1.3] mb-1 line-clamp-2"
                            >
                                {order.item.title}
                            </a>

                            <span className="text-[12px] text-[#565959] mb-2">
                                Phân loại: {order.item.size}
                            </span>

                            <div className="text-[12px] font-medium text-[#222222] bg-[#F7F7F7] px-2 py-1 rounded inline-block w-fit">
                                Lịch thuê: <span className="font-bold">{order.rentDates}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:w-[200px] flex flex-col gap-2 border-t md:border-t-0 md:border-l border-[#E6E6E6] pt-4 md:pt-0 md:pl-6">
                    <button className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-bold text-[13px] py-2 rounded-[8px] transition-colors shadow-sm text-center">
                        Chi tiết đơn hàng
                    </button>

                    {order.status === 'ACTIVE_RENTAL' && (
                        <button className="w-full bg-white hover:bg-[#F7F7F7] border border-[#D5D9D9] text-[#222222] font-bold text-[13px] py-2 rounded-[8px] transition-colors shadow-sm text-center">
                            Ghi nhận trả đồ
                        </button>
                    )}

                    {order.status === 'COMPLETED' && (
                        <button className="w-full bg-white hover:bg-[#F7F7F7] border border-[#D5D9D9] text-[#222222] font-bold text-[13px] py-2 rounded-[8px] transition-colors shadow-sm text-center">
                            Đánh giá sản phẩm
                        </button>
                    )}

                    <button className="w-full bg-white hover:bg-[#F7F7F7] border border-[#D5D9D9] text-[#222222] font-bold text-[13px] py-2 rounded-[8px] transition-colors shadow-sm text-center">
                        Liên hệ Shop
                    </button>
                </div>
            </div>
        </div>
    );
}