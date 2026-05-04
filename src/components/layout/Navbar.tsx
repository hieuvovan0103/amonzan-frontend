"use client";

import Link from "next/link";
import { LogOut, Menu, Search, UserCircle } from "lucide-react";
import { useAuthModal } from "@/stores/useAuthModal";
import { useAuthStore } from "@/stores/useAuthStore";

export default function Navbar() {
  const openLogin = useAuthModal((state) => state.openLogin);
  const { user, profile, isInitialized, signOut } = useAuthStore();

  const userRoles =
    profile?.user_roles
      ?.map((userRole: any) => {
        if (Array.isArray(userRole.roles)) {
          return userRole.roles[0]?.role_name;
        }

        return userRole.roles?.role_name;
      })
      .filter(Boolean) || [];

  const shopProfiles = Array.isArray(profile?.shop_profiles)
    ? profile.shop_profiles
    : profile?.shop_profiles
      ? [profile.shop_profiles]
      : [];

  const isAdmin = userRoles.includes("ADMIN");
  const hasApprovedVendorProfile = shopProfiles.some(
    (shopProfile: any) => shopProfile?.verification_status === "VERIFIED"
  );
  const isVendor =
    (userRoles.includes("SHOP_OWNER") || userRoles.includes("VENDOR")) &&
    hasApprovedVendorProfile;

  return (
    <header className="sticky top-0 z-50 bg-[#232F3E] px-4 py-3 text-white md:px-8">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4 md:gap-8">
        <div className="flex flex-shrink-0 items-center gap-2">
          <Menu className="h-6 w-6 cursor-pointer md:hidden" />
          <Link href="/products" className="text-2xl font-bold tracking-tighter">
            AMONZAN
          </Link>
        </div>

        <div className="hidden max-w-3xl flex-1 items-center gap-6 md:flex">
          <div className="flex w-full overflow-hidden rounded-sm border border-gray-300 bg-white transition-all focus-within:border-[#FF9900] focus-within:ring-1 focus-within:ring-[#FF9900]">
            <input
              type="text"
              placeholder="Tìm kiếm trang phục, dáo cụ, đồ cho thuê..."
              className="flex-1 px-4 py-2 text-[14px] text-[#222222] outline-none"
            />
            <button
              type="button"
              className="flex items-center justify-center bg-[#FF9900] px-6 transition-colors hover:bg-[#E47911]"
            >
              <Search className="h-5 w-5 text-[#111111]" />
            </button>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-4 text-[14px] font-semibold">
          {isInitialized && user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link
                  href="/dashboard/admin"
                  className="rounded-sm bg-red-600 px-3 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-red-700"
                >
                  Quản trị AMONZAN
                </Link>
              )}

              {isVendor && (
                <Link
                  href="/dashboard/vendor"
                  className="rounded-sm bg-[#007185] px-3 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-[#005a6a]"
                >
                  Shop của tôi
                </Link>
              )}

              {!isAdmin && (
                <Link
                  href="/profile"
                  className="flex items-center gap-2 transition-colors hover:text-[#FF9900]"
                  title="Tài khoản của tôi"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt="Avatar"
                      className="h-7 w-7 rounded-full object-cover ring-2 ring-white/30"
                    />
                  ) : profile?.full_name ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FF9900] text-[12px] font-bold text-white ring-2 ring-white/30">
                      {profile.full_name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <UserCircle className="h-6 w-6" />
                  )}
                  <span className="hidden max-w-[150px] truncate text-[13px] font-medium md:block">
                    {profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0]}
                  </span>
                </Link>
              )}

              <button
                type="button"
                onClick={signOut}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full text-[#E6E6E6] transition-all duration-300 hover:bg-red-500/10 hover:text-red-500"
                aria-label="Đăng xuất"
              >
                <LogOut className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-[11px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Đăng xuất
                </span>
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={openLogin}
                className="rounded-sm border border-[#F0C14B] bg-[#FFD814] px-5 py-2 text-[14px] font-semibold text-[#111111] transition-colors hover:bg-[#F0C14B]"
              >
                Đăng nhập
              </button>

              <Link
                href="/signup"
                className="hidden text-[#FF9900] transition-colors hover:text-[#E47911] hover:underline md:block"
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
