'use client';

import { useState } from 'react';
import { Package, Search } from 'lucide-react';
import { MOCK_MY_ORDERS } from '@/data/userProfile';
import OrderCard from './OrderCard';

const tabs = [
    { id: 'ALL', label: 'Tất cả đơn' },
    { id: 'PENDING', label: 'Chờ xác nhận' },
    { id: 'ACTIVE', label: 'Đang thuê' },
    { id: 'COMPLETED', label: 'Đã hoàn thành' },
];

export default function MyOrdersView() {
    const [filter, setFilter] = useState('ALL');

    const filteredOrders = MOCK_MY_ORDERS.filter((order) => {
        if (filter === 'ALL') return true;
        if (filter === 'ACTIVE') return order.status === 'ACTIVE_RENTAL';
        return order.status === filter;
    });

    return (
        <div className="flex-1 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8 animate-in fade-in duration-300">
            <div className="mb-6">
                <h1 className="text-[24px] font-bold text-[#222222] tracking-[-0.02em] mb-1">
                    Đơn đi thuê của tôi
                </h1>
                <p className="text-[14px] text-[#565959]">
                    Xem và quản lý các đồ vật bạn đang thuê.
                </p>
            </div>

            <div className="flex gap-6 border-b border-[#E6E6E6] mb-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`pb-3 text-[14px] font-bold transition-colors whitespace-nowrap border-b-2 ${filter === tab.id
                                ? 'border-[#FF9900] text-[#FF9900]'
                                : 'border-transparent text-[#565959] hover:text-[#222222]'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã đơn, tên sản phẩm hoặc tên shop..."
                        className="w-full border border-[#D5D9D9] rounded-[8px] pl-9 pr-3 py-2 text-[14px] outline-none focus:ring-2 focus:ring-[#FF9900]/30 focus:border-[#FF9900] transition-all shadow-sm"
                    />
                    <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                <button className="bg-[#232F3E] text-white px-4 py-2 rounded-[8px] text-[13px] font-bold hover:bg-[#111111] transition-colors shadow-sm">
                    Tìm kiếm
                </button>
            </div>

            <div className="space-y-6">
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center bg-[#F7F7F7] rounded-[12px] border border-dashed border-[#D5D9D9]">
                        <Package className="w-12 h-12 text-[#D5D9D9] mb-3" />
                        <h3 className="text-[16px] font-bold text-[#222222] mb-1">
                            Không có đơn hàng nào
                        </h3>
                        <p className="text-[14px] text-[#565959]">
                            Bạn không có đơn hàng nào trong trạng thái này.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}