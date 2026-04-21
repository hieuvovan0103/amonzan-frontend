import { ChevronDown, Filter } from "lucide-react";

export default function ProductFiltersSidebar() {
    return (
        <aside className="w-full md:w-[280px] flex-shrink-0">
            <div className="bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-5 md:sticky md:top-[90px]">
                <div className="flex items-center gap-2 mb-5">
                    <Filter className="w-5 h-5 text-[#007185]" />
                    <h2 className="text-[18px] font-bold text-[#222222]">Bộ lọc</h2>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-[13px] font-bold text-[#222222] mb-2">
                            Danh mục
                        </label>
                        <div className="relative">
                            <select className="w-full appearance-none border border-[#D5D9D9] rounded-[10px] px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900] bg-white">
                                <option>Tất cả danh mục</option>
                                <option>Cosplay</option>
                                <option>Trang phục sự kiện</option>
                                <option>Thiết bị điện tử</option>
                                <option>Dã ngoại</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold text-[#222222] mb-2">
                            Địa điểm
                        </label>
                        <div className="relative">
                            <select className="w-full appearance-none border border-[#D5D9D9] rounded-[10px] px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900] bg-white">
                                <option>Tất cả khu vực</option>
                                <option>Hồ Chí Minh</option>
                                <option>Cần Thơ</option>
                                <option>Hà Nội</option>
                            </select>
                            <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold text-[#222222] mb-2">
                            Mức giá
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Từ"
                                className="border border-[#D5D9D9] rounded-[10px] px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900]"
                            />
                            <input
                                type="text"
                                placeholder="Đến"
                                className="border border-[#D5D9D9] rounded-[10px] px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-bold text-[#222222] mb-3">
                            Đánh giá
                        </label>

                        <div className="space-y-2 text-[14px]">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-[#FF9900]" />
                                <span>4 sao trở lên</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="accent-[#FF9900]" />
                                <span>3 sao trở lên</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                        <button
                            type="button"
                            className="w-full bg-[#232F3E] hover:bg-[#111111] text-white font-bold text-[14px] py-2.5 rounded-[10px] transition-colors"
                        >
                            Áp dụng bộ lọc
                        </button>

                        <button
                            type="button"
                            className="w-full bg-white hover:bg-[#F7F7F7] border border-[#D5D9D9] text-[#222222] font-bold text-[14px] py-2.5 rounded-[10px] transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}