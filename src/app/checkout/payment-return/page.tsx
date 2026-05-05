import { Suspense } from "react";
import PaymentReturnClient from "./PaymentReturnClient";

export const metadata = {
    title: "Xử lý thanh toán | Amonzan",
    description: "Xác minh kết quả thanh toán VNPAY.",
};

export default function PaymentReturnPage() {
    return (
        <Suspense
            fallback={
                <main className="flex min-h-screen items-center justify-center bg-[#F0F2F5] px-4 py-10 text-[#222222]">
                    <section className="w-full max-w-[480px] rounded-md border border-[#D5D9D9] bg-white p-8 text-center shadow-sm">
                        <h1 className="text-[22px] font-bold text-[#222222]">
                            Đang xử lý thanh toán...
                        </h1>
                    </section>
                </main>
            }
        >
            <PaymentReturnClient />
        </Suspense>
    );
}
