"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, ShieldCheck, Store, UserCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type AccountMenuProps = {
  user: User;
  profile: any | null;
  isAdmin: boolean;
  isVendor: boolean;
  onSignOut: () => void;
};

export default function AccountMenu({
  user,
  profile,
  isAdmin,
  isVendor,
  onSignOut,
}: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const displayName =
    profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Tài khoản";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-center gap-2 rounded-[4px] px-2 py-1.5 transition-colors hover:bg-white/10 hover:text-[#FF9900]"
        aria-label="Mở menu tài khoản"
        aria-expanded={isOpen}
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
          {displayName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-[260px] overflow-hidden rounded-[6px] border border-[#D5D9D9] bg-white text-[#222222] shadow-[0_12px_32px_rgba(15,17,17,0.22)]">
          <div className="border-b border-[#E6E6E6] px-4 py-3">
            <div className="truncate text-[14px] font-bold">{displayName}</div>
            {user.email && (
              <div className="mt-0.5 truncate text-[12px] font-normal text-[#565959]">
                {user.email}
              </div>
            )}
          </div>

          <div className="py-1">
            <Link
              href="/profile"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-[#F7F7F7] hover:text-[#E47911]"
            >
              <UserCircle className="h-4 w-4 text-[#565959]" />
              Trang cá nhân
            </Link>

            {isVendor && (
              <Link
                href="/dashboard/vendor"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-[#F7F7F7] hover:text-[#E47911]"
              >
                <Store className="h-4 w-4 text-[#565959]" />
                Quản lý cửa hàng
              </Link>
            )}

            {isAdmin && (
              <Link
                href="/dashboard/admin"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-[#F7F7F7] hover:text-[#E47911]"
              >
                <ShieldCheck className="h-4 w-4 text-[#565959]" />
                Trang admin
              </Link>
            )}

            {(isVendor || isAdmin) && (
              <div className="mx-4 my-1 h-px bg-[#E6E6E6]" />
            )}

            <Link
              href="/products"
              onClick={closeMenu}
              className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium transition-colors hover:bg-[#F7F7F7] hover:text-[#E47911]"
            >
              <LayoutDashboard className="h-4 w-4 text-[#565959]" />
              Sản phẩm
            </Link>

            <button
              type="button"
              onClick={() => {
                closeMenu();
                onSignOut();
              }}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-[14px] font-medium text-[#C62828] transition-colors hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
