export default function ProductSpecs() {
    return (
        <section
            id="thong-tin-san-pham"
            className="py-8 border-t border-[#E6E6E6]"
        >
            <h2 className="text-[20px] font-bold text-[#222222] mb-6">
                Thông tin sản phẩm
            </h2>

            <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
                <div className="flex-1 bg-[#F7F7F7] rounded-[12px] p-6 border border-[#E6E6E6]">
                    <h3 className="text-[16px] font-bold text-[#222222] border-b border-[#D5D9D9] pb-2 mb-4">
                        Chi tiết vật phẩm
                    </h3>

                    <div className="grid grid-cols-2 gap-y-3 text-[14px]">
                        <span className="font-medium text-[#565959]">Chất liệu</span>
                        <span className="text-[#222222]">Cotton pha Poly</span>

                        <span className="font-medium text-[#565959]">Loại trang phục</span>
                        <span className="text-[#222222]">Cosplay Anime</span>

                        <span className="font-medium text-[#565959]">Phân loại</span>
                        <span className="text-[#222222]">Người lớn</span>
                    </div>
                </div>

                <div className="flex-1 bg-[#F7F7F7] rounded-[12px] p-6 border border-[#E6E6E6]">
                    <h3 className="text-[16px] font-bold text-[#222222] border-b border-[#D5D9D9] pb-2 mb-4">
                        Tính năng & thông số
                    </h3>

                    <ul className="list-disc pl-5 text-[14px] text-[#222222] space-y-2">
                        <li>Bao gồm đai đeo 3D mô phỏng</li>
                        <li>Chất vải thoáng mát, thấm hút mồ hôi</li>
                        <li>Màu sắc chuẩn nguyên tác 100%</li>
                    </ul>
                </div>
            </div>
        </section>
    );
}