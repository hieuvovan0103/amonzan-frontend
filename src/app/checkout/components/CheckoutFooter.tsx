import Link from "next/link";

export default function CheckoutFooter() {
    return (
        <footer className="mt-auto border-t border-[#E6E6E6] bg-white py-8 text-center">
            <div className="mx-auto max-w-[1000px] px-4">
                <div className="mb-4 flex justify-center gap-6 text-[12px] font-medium text-[#007185]">
                    <Link href="#" className="hover:text-[#E47911] hover:underline">
                        Điều kiện sử dụng
                    </Link>

                    <Link href="#" className="hover:text-[#E47911] hover:underline">
                        Thông báo bảo mật
                    </Link>

                    <Link href="#" className="hover:text-[#E47911] hover:underline">
                        Trợ giúp
                    </Link>
                </div>

                <p className="text-[12px] text-[#565959]">
                    © 1996-2026, Amonzan.com, Inc. or its affiliates
                </p>
            </div>
        </footer>
    );
}
