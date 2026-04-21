"use client";

import Link from "next/link";
import { Search, Menu, UserCircle, LogOut } from "lucide-react";
import { useAuthModal } from "@/stores/useAuthModal";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Navbar() {
  const openLogin = useAuthModal((state) => state.openLogin);
  const { user, profile, isInitialized, signOut } = useAuthStore();

  const userRoles = profile?.user_roles?.map((ur: any) => {
     if (Array.isArray(ur.roles)) return ur.roles[0]?.role_name;
     return ur.roles?.role_name;
  }).filter(Boolean) || [];
  const isAdmin = userRoles.includes("ADMIN");
  const isVendor = userRoles.includes("VENDOR");

  return (
    <header className="bg-[#232F3E] text-white py-3 px-4 md:px-8 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 md:gap-8">
        <div className="flex items-center gap-2 flex-shrink-0">
          <Menu className="w-6 h-6 md:hidden cursor-pointer" />
          <Link href="/products" className="text-2xl font-bold tracking-tighter">
            AMONZAN
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-3xl items-center gap-6">
          <div className="flex w-full bg-white rounded-[10px] overflow-hidden border focus-within:ring-2 focus-within:ring-[#FF9900]/50 transition-all">
            <input
              type="text"
              placeholder="Tìm kiếm trang phục, đạo cụ, đồ cho thuê..."
              className="flex-1 px-4 py-2 text-[#222222] outline-none text-[14px]"
            />
            <button
              type="button"
              className="bg-[#FF9900] hover:bg-[#E47911] transition-colors px-6 flex items-center justify-center cursor-pointer"
            >
              <Search className="w-5 h-5 text-[#111111]" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0 text-[14px] font-semibold">
          {isInitialized && user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors"
                >
                  Vùng Admin
                </Link>
              )}
              {isVendor && (
                <Link
                  href="/dashboard/vendor"
                  className="bg-[#007185] hover:bg-[#005a6a] text-white px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors"
                >
                  Shop của tôi
                </Link>
              )}
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:text-[#FF9900] transition-colors"
                title="Tài khoản của tôi"
              >
                <UserCircle className="w-6 h-6" />
                <span className="hidden md:block truncate max-w-[150px] font-medium text-[13px]">
                  {profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0]}
                </span>
              </Link>
              <button
                type="button"
                onClick={signOut}
                className="group relative flex items-center justify-center w-10 h-10 rounded-full text-[#E6E6E6] hover:bg-red-500/10 hover:text-red-500 transition-all duration-300"
                aria-label="Đăng xuất"
              >
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[11px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Đăng xuất
                </span>
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={openLogin}
                className="bg-[#FFD814] hover:bg-[#F0C14B] text-[#111111] px-5 py-2 rounded-[10px] transition-colors border border-[#F0C14B]"
              >
                Đăng nhập
              </button>

              <Link
                href="/signup"
                className="hidden md:block text-[#FF9900] hover:text-[#E47911] hover:underline transition-colors"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}