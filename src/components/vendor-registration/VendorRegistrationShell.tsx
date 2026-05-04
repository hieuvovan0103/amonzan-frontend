import VendorRegistrationHeader from "@/components/vendor-registration/VendorRegistrationHeader";
import VendorRegistrationForm from "@/components/vendor-registration/VendorRegistrationForm";

export default function VendorRegistrationShell() {
    return (
        <div className="min-h-screen bg-[#F0F2F5] font-sans text-[#222222] flex flex-col">
            <VendorRegistrationHeader />

            <main className="flex-1 w-full max-w-[800px] mx-auto px-4 py-8 md:py-12">
                <VendorRegistrationForm />
            </main>

            <footer className="bg-[#0F1111] text-[#FFFFFF] py-8 text-center text-[12px] md:text-[13px] mt-auto">
                <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center gap-2">
                    <div className="flex gap-4 md:gap-6 justify-center mb-2">
                        <a href="#" className="hover:underline">
                            Điều kiện sử dụng
                        </a>
                        <a href="#" className="hover:underline">
                            Chính sách quyền riêng tư
                        </a>
                        <a href="#" className="hover:underline">
                            Quy định cho vendor
                        </a>
                    </div>

                    <p className="text-[#6B7280]">
                        © 1996-2026, Amonzan.com, Inc. or its affiliates
                    </p>
                </div>
            </footer>
        </div>
    );
}