"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabase";

export default function VendorRegistrationHeader() {
    const { user, profile } = useAuthStore();
    const userName = profile?.full_name || user?.user_metadata?.full_name || "Khách";

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = "/";
    };

    return (
        <header className="bg-[#232F3E] text-white py-3 px-4 md:px-8 sticky top-0 z-50 shadow-sm">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Menu className="w-6 h-6 md:hidden cursor-pointer" />
                    <Link
                        href="/"
                        className="text-2xl font-bold tracking-tighter hover:text-[#FF9900] transition-colors"
                    >
                        AMONZAN
                    </Link>
                </div>

                <div className="text-[14px] font-medium hidden sm:block">
                    Trung tâm đối tác cho thuê
                </div>

                <div className="flex items-center gap-4 text-[14px]">
                    <span className="text-gray-300">Xin chào, {userName}</span>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-[#FF9900] hover:text-[#E47911] font-bold transition-colors"
                    >
                        Thoát
                    </button>
                </div>
            </div>
        </header>
    );
}