import { ChevronDown } from "lucide-react";

export default function ProductToolbar() {
    return (
        <div className="bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-4 md:p-5 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-[24px] font-bold text-[#222222]">
                        Danh sách sản phẩm
                    </h1>
                    <p className="text-[14px] text-[#565959] mt-1">
                        Khám phá các sản phẩm cho thuê đang có trên nền tảng.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative w-full sm:w-[200px]">
                        <select className="w-full appearance-none border border-[#D5D9D9] rounded-[10px] px-3 py-2.5 text-[14px] outline-none focus:border-[#FF9900] bg-white">
                            <option>Sắp xếp mặc định</option>
                            <option>Giá tăng dần</option>
                            <option>Giá giảm dần</option>
                            <option>Đánh giá cao nhất</option>
                            <option>Mới nhất</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#6B7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}