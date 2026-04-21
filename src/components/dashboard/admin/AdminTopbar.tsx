"use client";

import { Bell, Search, Home, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";

export default function AdminTopbar() {
    const { signOut } = useAuthStore();

    return (
        <header className="h-[64px] bg-white border-b border-[#E6E6E6] flex items-center justify-between px-6 z-40 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="relative hidden md:block w-80">
                    <input
                        type="text"
                        placeholder="Tìm mã đơn, tên shop, số điện thoại..."
                        className="w-full bg-[#F7F7F7] border border-[#D5D9D9] rounded-[10px] pl-10 pr-4 py-2 text-[13px] outline-none focus:ring-2 focus:ring-[#FF9900]/20 focus:border-[#FF9900] transition-all"
                    />
                    <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button
                    type="button"
                    className="p-2.5 hover:bg-[#F7F7F7] rounded-full relative transition-colors"
                >
                    <Bell className="w-5 h-5 text-[#565959]" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#C62828] rounded-full border-2 border-white"></span>
                </button>

                <div className="flex items-center gap-3 pl-5 border-l border-[#E6E6E6] cursor-pointer group relative">
                    <div className="text-right hidden sm:block">
                        <div className="text-[13px] font-bold text-[#222222] group-hover:text-[#FF9900] transition-colors">
                            Admin Master
                        </div>
                        <div className="text-[11px] text-[#6B7280] font-medium uppercase tracking-tighter">
                            Quản trị viên tối cao
                        </div>
                    </div>

                    <div className="w-10 h-10 bg-[#232F3E] text-white rounded-[12px] flex items-center justify-center font-bold text-sm ring-2 ring-transparent group-hover:ring-[#FF9900] group-hover:shadow-md transition-all">
                        AD
                    </div>

                    <div className="absolute top-[110%] right-0 w-[220px] bg-white border border-[#E6E6E6] shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-[12px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden z-50">
                        <div className="p-2 border-b border-[#E6E6E6]">
                            <div className="px-3 py-2 text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">
                                Tùy chọn 
                            </div>
                            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] hover:bg-[#F7F7F7] text-[#222222] font-medium text-[14px] transition-colors group/item">
                                <Home className="w-4 h-4 text-[#565959] group-hover/item:text-[#FF9900] transition-colors" />
                                Về trang chủ
                            </Link>
                        </div>
                        <div className="p-2">
                            <button
                                type="button"
                                onClick={signOut}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[8px] hover:bg-red-50 text-[#C62828] font-medium text-[14px] transition-colors group/item"
                            >
                                <LogOut className="w-4 h-4 group-hover/item:text-red-700 transition-colors" />
                                Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}