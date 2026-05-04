import Link from "next/link";
import { ShieldCheck, Zap } from "lucide-react";

export default function VendorCTASection() {
    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col overflow-hidden rounded-sm bg-[#131921] shadow-2xl lg:flex-row">
                    <div className="flex flex-col justify-center p-10 lg:w-1/2 lg:p-16">
                        <h2 className="mb-4 text-3xl font-bold text-white">
                            Tủ quần áo quá tải?
                            <br />
                            <span className="text-[#FF9900]">
                                Biến váy áo ít mặc thành thu nhập.
                            </span>
                        </h2>

                        <p className="mb-8 text-lg text-gray-300">
                            Trở thành Vendor trên Amonzan ngay hôm nay. Cho thuê trang phục,
                            váy dạ hội, phụ kiện hoặc đồ dùng của bạn một cách an toàn, dễ
                            quản lý và có quy trình bảo vệ rõ ràng.
                        </p>

                        <div className="flex flex-col gap-4 sm:flex-row">
                            <Link
                                href="/vendor/register"
                                className="rounded-sm bg-[#FF9900] px-8 py-3 text-center font-bold text-gray-900 transition-colors hover:bg-[#e38800]"
                            >
                                Đăng ký Vendor
                            </Link>

                            <Link
                                href="/products"
                                className="rounded-sm border border-white/20 bg-white/10 px-8 py-3 text-center font-bold text-white transition-colors hover:bg-white/20"
                            >
                                Khám phá sản phẩm
                            </Link>
                        </div>

                        <div className="mt-8 flex flex-col gap-3 text-sm text-gray-400 sm:flex-row sm:items-center sm:gap-4">
                            <div className="flex items-center gap-1">
                                <ShieldCheck className="h-4 w-4 text-green-400" />
                                Quy trình bảo vệ rõ ràng
                            </div>

                            <div className="flex items-center gap-1">
                                <Zap className="h-4 w-4 text-[#FF9900]" />
                                Quản lý đơn thuê dễ dàng
                            </div>
                        </div>
                    </div>

                    <div className="relative min-h-[300px] bg-[#232F3E] lg:min-h-full lg:w-1/2">
                        <img
                            src="https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=800"
                            alt="Trở thành vendor trên Amonzan"
                            className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-overlay"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}