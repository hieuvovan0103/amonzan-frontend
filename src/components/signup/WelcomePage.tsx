"use client";

import Link from "next/link";
import { Package, Store, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function WelcomePage() {
  const { user, profile } = useAuthStore();
  const userName = profile?.full_name || user?.user_metadata?.full_name || "bạn";

  return (
    <main className="flex flex-1 items-center justify-center bg-[#FFFFFF] px-4 py-12">
      <div className="w-full max-w-[600px] rounded-[16px] border border-[#E6E6E6] bg-white p-8 text-center shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)]">
        <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
        <h1 className="mb-3 text-[28px] font-bold tracking-[-0.02em] text-[#222222]">
          Chào mừng {userName} đến với Amonzan!
        </h1>
        <p className="mb-8 text-[15px] text-[#565959] leading-relaxed">
          Tài khoản cá nhân của bạn đã được tạo thành công. Bạn đã có thể bắt đầu thuê đồ trên hệ thống. 
          Ngoài ra, nếu bạn có đồ nhàn rỗi, hãy tham gia cộng đồng đối tác cho thuê để kiếm thêm thu nhập nhé!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/products"
            className="flex flex-col items-center justify-center gap-3 rounded-[12px] border border-[#D5D9D9] bg-white p-6 transition-all hover:border-[#FF9900] hover:shadow-[0_0_0_3px_rgba(255,153,0,0.1)] group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F7F7] group-hover:bg-[#FF9900]/10 transition-colors">
              <Package className="h-6 w-6 text-[#6B7280] group-hover:text-[#FF9900]" />
            </div>
            <div className="text-center">
              <span className="block text-[15px] font-bold text-[#222222] mb-1">
                Đi đến trang Sản phẩm
              </span>
              <span className="text-[13px] text-[#565959]">
                Bắt đầu tìm kiếm và thuê đồ
              </span>
            </div>
          </Link>

          <Link
            href="/vendor/register"
            className="flex flex-col items-center justify-center gap-3 rounded-[12px] border border-[#F0C14B] bg-[#FFD814] p-6 transition-all hover:bg-[#F0C14B] group shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/50 group-hover:bg-white/80 transition-colors">
              <Store className="h-6 w-6 text-[#111111]" />
            </div>
            <div className="text-center">
              <span className="block text-[15px] font-bold text-[#111111] mb-1">
                Trở thành Đối tác Vendor
              </span>
              <span className="text-[13px] text-[#111111]/80">
                Đăng ký để cho thuê đồ của bạn
              </span>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-[13px] text-[#9B9B9B]">
          Lưu ý: Quá trình đăng ký Vendor hoàn toàn miễn phí và bạn không cần phải tạo tài khoản mới.
        </div>
      </div>
    </main>
  );
}
