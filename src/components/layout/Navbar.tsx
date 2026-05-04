"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { useAuthModal } from "@/stores/useAuthModal";
import { useAuthStore } from "@/stores/useAuthStore";
import CartPopover from "@/components/layout/CartPopover";
import AccountMenu from "@/components/layout/AccountMenu";

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
    (shopProfile: any) => shopProfile?.verification_status === "VERIFIED",
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
              placeholder="Tìm kiếm trang phục, đạo cụ, đồ cho thuê..."
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

        <div className="flex flex-shrink-0 items-center gap-3 text-[14px] font-semibold">
          <CartPopover />

          {isInitialized && user ? (
            <AccountMenu
              user={user}
              profile={profile}
              isAdmin={isAdmin}
              isVendor={isVendor}
              onSignOut={signOut}
            />
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
