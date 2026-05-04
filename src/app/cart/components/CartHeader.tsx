type CartHeaderProps = {
    selectedCount: number;
    allSelected: boolean;
    onToggleAll: () => void;
};

export default function CartHeader({
    selectedCount,
    allSelected,
    onToggleAll,
}: CartHeaderProps) {
    return (
        <div className="flex items-end justify-between border-b border-[#E6E6E6] pb-4 mb-6">
            <div>
                <h1 className="text-[28px] md:text-[32px] font-bold text-[#222222] tracking-[-0.02em] leading-none mb-2">
                    Giỏ hàng
                </h1>

                <p className="text-[14px] text-[#222222]">
                    {selectedCount === 0
                        ? 'Chưa có sản phẩm nào được chọn. '
                        : `Đã chọn ${selectedCount} sản phẩm. `}

                    <button
                        onClick={onToggleAll}
                        className="text-[#007185] hover:text-[#E47911] hover:underline font-medium"
                    >
                        {allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                    </button>
                </p>
            </div>
        </div>
    );
}