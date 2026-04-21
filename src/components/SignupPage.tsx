import Link from "next/link";
import { Search, Menu } from "lucide-react";

function Navbar() {
    return (
        <header className="bg-[#232F3E] text-white py-3 px-4 md:px-8 sticky top-0 z-50">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 md:gap-8">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Menu className="w-6 h-6 md:hidden cursor-pointer" />
                    <Link href="/" className="text-2xl font-bold tracking-tighter">
                        AMONZAN
                    </Link>
                </div>

                <div className="hidden md:flex flex-1 max-w-3xl">
                    <div className="flex w-full bg-white rounded-[10px] overflow-hidden border focus-within:ring-2 focus-within:ring-[#FF9900]/50 transition-all">
                        <input
                            type="text"
                            placeholder="Tìm kiếm trang phục, đạo cụ, đồ cho thuê..."
                            className="flex-1 px-4 py-2 text-[#222222] outline-none text-[14px]"
                        />
                        <button className="bg-[#FF9900] hover:bg-[#E47911] transition-colors px-6 flex items-center justify-center cursor-pointer">
                            <Search className="w-5 h-5 text-[#111111]" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 text-[14px] font-semibold">
                    <button className="bg-[#FFD814] hover:bg-[#F0C14B] text-[#111111] px-5 py-2 rounded-[10px] transition-colors border border-[#F0C14B]">
                        Đăng nhập
                    </button>
                    <Link
                        href="/signup"
                        className="hidden md:block text-[#FF9900] hover:text-[#E47911] hover:underline transition-colors"
                    >
                        Đăng ký
                    </Link>
                </div>
            </div>

            <div className="md:hidden mt-3">
                <div className="flex w-full bg-white rounded-[8px] overflow-hidden">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="flex-1 px-3 py-2 text-[#222222] outline-none text-[14px]"
                    />
                    <button className="bg-[#FF9900] px-4 flex items-center justify-center">
                        <Search className="w-4 h-4 text-[#111111]" />
                    </button>
                </div>
            </div>
        </header>
    );
}

function Footer() {
    return (
        <footer className="bg-[#0F1111] text-[#FFFFFF] py-8 text-center text-[12px] md:text-[13px] mt-auto">
            <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center gap-2">
                <div className="flex gap-4 md:gap-6 justify-center mb-2">
                    <a href="#" className="hover:underline">
                        Điều kiện sử dụng
                    </a>
                    <a href="#" className="hover:underline">
                        Chính sách bảo mật
                    </a>
                    <a href="#" className="hover:underline">
                        Trợ giúp
                    </a>
                </div>
                <p className="text-[#6B7280]">
                    © 1996-2026, Amonzan.com, Inc. hoặc các chi nhánh
                </p>
            </div>
        </footer>
    );
}

function InputField({
    label,
    type = "text",
    id,
}: {
    label: string;
    type?: string;
    id: string;
}) {
    return (
        <div className="flex flex-col gap-1.5 mb-4">
            <label htmlFor={id} className="text-[14px] font-medium text-[#222222]">
                {label}
            </label>
            <input
                type={type}
                id={id}
                name={id}
                className="w-full border border-[#D5D9D9] rounded-[12px] px-3 py-2 outline-none focus:ring-[3px] focus:ring-[#FF9900]/22 focus:border-[#FF9900] transition-all text-[14px] text-[#222222] shadow-[0_1px_2px_rgba(15,17,17,0.05)]"
            />
        </div>
    );
}

function SignupForm() {
    return (
        <main className="flex-1 flex items-center justify-center py-12 px-4 bg-[#FFFFFF]">
            <div className="w-full max-w-[400px] bg-white border border-[#E6E6E6] rounded-[16px] p-6 md:p-8 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)]">
                <h1 className="text-[28px] font-bold text-[#222222] mb-6 tracking-[-0.02em]">
                    Tạo tài khoản mới
                </h1>

                <form>
                    <InputField label="Tên đăng nhập" id="username" />
                    <InputField label="Số điện thoại di động" id="mobile" type="tel" />
                    <InputField label="Email" id="email" type="email" />
                    <InputField label="Mật khẩu" id="password" type="password" />
                    <InputField label="Số chứng minh nhân dân/CCCD" id="idCard" />

                    <button
                        type="submit"
                        className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-semibold text-[14px] py-2.5 rounded-[10px] mt-2 transition-colors shadow-sm"
                    >
                        Đăng ký
                    </button>
                </form>

                <div className="mt-6 space-y-4">
                    <p className="text-[12px] text-[#222222] leading-[1.5]">
                        Bằng cách tiếp tục, bạn đồng ý với{" "}
                        <a
                            href="#"
                            className="text-[#007185] hover:text-[#E47911] hover:underline"
                        >
                            Điều kiện sử dụng
                        </a>{" "}
                        và{" "}
                        <a
                            href="#"
                            className="text-[#007185] hover:text-[#E47911] hover:underline"
                        >
                            Chính sách bảo mật
                        </a>
                        {" "}của Amonzan.
                    </p>

                    <div>
                        <a
                            href="#"
                            className="text-[13px] text-[#007185] hover:text-[#E47911] hover:underline font-medium"
                        >
                            Cần trợ giúp?
                        </a>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SignupPage() {
    return (
        <div className="min-h-screen font-sans text-[#222222] flex flex-col bg-[#FFFFFF]">
            <Navbar />
            <SignupForm />
            <Footer />
        </div>
    );
}