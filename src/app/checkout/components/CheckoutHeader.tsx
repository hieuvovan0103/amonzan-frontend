import Link from "next/link";
import { Lock } from "lucide-react";

export default function CheckoutHeader() {
    return (
        <header className="border-b border-[#D5D9D9] bg-gradient-to-b from-[#F2F2F2] to-white px-4 py-4 md:px-8">
            <div className="mx-auto flex max-w-[1000px] items-center justify-between">
                <Link
                    href="/"
                    className="text-2xl font-bold tracking-tighter text-[#222222]"
                >
                    AMONZAN
                </Link>

                <h1 className="hidden text-[20px] font-medium text-[#222222] md:block md:text-[24px]">
                    Thanh toán
                </h1>

                <div className="flex items-center gap-1.5 text-[#565959]">
                    <Lock className="h-5 w-5 text-[#565959]" />
                    <span className="text-[14px] font-bold">Thanh toán an toàn</span>
                </div>
            </div>
        </header>
    );
}
