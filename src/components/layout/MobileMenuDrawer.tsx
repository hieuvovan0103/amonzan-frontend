"use client";

import { useEffect } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import {
  Bell,
  ClipboardList,
  Grid3X3,
  Heart,
  Home,
  LogIn,
  LogOut,
  PackageSearch,
  ShieldCheck,
  ShoppingCart,
  Store,
  UserCircle,
  X,
} from "lucide-react";
import { useAuthModal } from "@/stores/useAuthModal";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMobileMenuStore } from "@/stores/mobileMenuStore";

type MenuLink = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

function getUserRoles(profile: any | null) {
  return (
    profile?.user_roles
      ?.map((userRole: any) => {
        if (Array.isArray(userRole.roles)) {
          return userRole.roles[0]?.role_name;
        }

        return userRole.roles?.role_name;
      })
      .filter(Boolean) || []
  );
}

function getShopProfiles(profile: any | null) {
  if (Array.isArray(profile?.shop_profiles)) {
    return profile.shop_profiles;
  }

  return profile?.shop_profiles ? [profile.shop_profiles] : [];
}

export default function MobileMenuDrawer() {
  const { isOpen, closeMenu } = useMobileMenuStore();
  const openLogin = useAuthModal((state) => state.openLogin);
  const { user, profile, signOut } = useAuthStore();

  const userRoles = getUserRoles(profile);
  const shopProfiles = getShopProfiles(profile);
  const isAdmin = userRoles.includes("ADMIN");
  const isVendor =
    (userRoles.includes("SHOP_OWNER") || userRoles.includes("VENDOR")) &&
    shopProfiles.some((shopProfile: any) => shopProfile?.verification_status === "VERIFIED");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isOpen]);

  if (!isOpen) {
    return null;
  }

  const guestLinks: MenuLink[] = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/products", label: "Sản phẩm", icon: PackageSearch },
    { href: "/products", label: "Danh mục", icon: Grid3X3 },
    { href: "/cart", label: "Giỏ hàng", icon: ShoppingCart },
    { href: "/vendor/register", label: "Đăng ký bán hàng", icon: Store },
  ];

  const userLinks: MenuLink[] = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/products", label: "Sản phẩm", icon: PackageSearch },
    { href: "/products", label: "Danh mục", icon: Grid3X3 },
    { href: "/cart", label: "Giỏ hàng", icon: ShoppingCart },
    { href: "/profile?tab=my_orders", label: "Đơn hàng của tôi", icon: ClipboardList },
    { href: "/profile?tab=favorites", label: "Yêu thích", icon: Heart },
    { href: "/profile?tab=notifications", label: "Thông báo", icon: Bell },
    { href: "/profile", label: "Hồ sơ cá nhân", icon: UserCircle },
  ];

  const links = user ? userLinks : guestLinks;

  const handleLogin = () => {
    closeMenu();
    openLogin();
  };

  const handleSignOut = async () => {
    closeMenu();
    await signOut();
  };

  return (
    <div className="fixed inset-0 z-[80] md:hidden" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/45"
        aria-label="Đóng menu"
        onClick={closeMenu}
      />

      <aside
        id="mobile-menu-drawer"
        className="absolute right-0 top-0 flex h-full w-[min(86vw,360px)] animate-[slideInRight_180ms_ease-out] flex-col bg-white text-[#222222] shadow-[-16px_0_40px_rgba(15,17,17,0.28)]"
      >
        <div className="flex items-center justify-between border-b border-[#E6E6E6] px-5 py-4">
          <div>
            <div className="text-[16px] font-bold">Menu</div>
            <div className="mt-0.5 text-[12px] text-[#565959]">
              {user ? "Tài khoản của bạn" : "Khám phá Amonzan"}
            </div>
          </div>
          <button
            type="button"
            onClick={closeMenu}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D5D9D9] transition-colors hover:bg-[#F7F7F7]"
            aria-label="Đóng menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={closeMenu}
                className="flex items-center gap-3 px-5 py-3 text-[15px] font-semibold transition-colors hover:bg-[#F7F7F7] hover:text-[#E47911]"
              >
                <Icon className="h-5 w-5 text-[#565959]" />
                {item.label}
              </Link>
            );
          })}

          {user && (isVendor || isAdmin) && <div className="mx-5 my-3 h-px bg-[#E6E6E6]" />}

          {user && isVendor && (
            <Link
              href="/dashboard/vendor"
              onClick={closeMenu}
              className="flex items-center gap-3 px-5 py-3 text-[15px] font-semibold transition-colors hover:bg-[#F7F7F7] hover:text-[#E47911]"
            >
              <Store className="h-5 w-5 text-[#565959]" />
              Vào trang quản lý cửa hàng
            </Link>
          )}

          {user && isAdmin && (
            <Link
              href="/dashboard/admin"
              onClick={closeMenu}
              className="flex items-center gap-3 px-5 py-3 text-[15px] font-semibold transition-colors hover:bg-[#F7F7F7] hover:text-[#E47911]"
            >
              <ShieldCheck className="h-5 w-5 text-[#565959]" />
              Vào trang quản trị
            </Link>
          )}
        </nav>

        <div className="border-t border-[#E6E6E6] p-5">
          {user ? (
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#C62828] px-4 py-2.5 text-[15px] font-bold text-[#C62828] transition-colors hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              Đăng xuất
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLogin}
              className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#F0C14B] bg-[#FFD814] px-4 py-2.5 text-[15px] font-bold text-[#111111] transition-colors hover:bg-[#F0C14B]"
            >
              <LogIn className="h-5 w-5" />
              Đăng nhập
            </button>
          )}
        </div>
      </aside>

      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
