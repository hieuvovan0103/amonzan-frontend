"use client";

import { Menu } from "lucide-react";
import { useMobileMenuStore } from "@/stores/mobileMenuStore";

export default function MobileMenuButton() {
  const { isOpen, toggleMenu } = useMobileMenuStore();

  return (
    <button
      type="button"
      onClick={toggleMenu}
      className="flex h-10 w-10 items-center justify-center rounded-[4px] transition-colors hover:bg-white/10 md:hidden"
      aria-label="Mở menu"
      aria-controls="mobile-menu-drawer"
      aria-expanded={isOpen}
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}
