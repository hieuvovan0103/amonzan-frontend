"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_URL } from "@/lib/config";
import { useCartStore } from "@/stores/useCartStore";

const PENDING_PAYMENT_KEY = "amonzan-pending-payment";

type VerifyPaymentReturnResponse = {
    success: boolean;
    orderId: string | null;
    paymentStatus: string;
    reason: string | null;
};

type PaymentStatusResponse = {
    orderId: string;
    orderStatus: string;
    paymentStatus: string;
    totalAmount: number;
};

export default function PaymentReturnClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const clearCart = useCartStore((state) => state.clearCart);
    const [message, setMessage] = useState("Đang xác minh thanh toán...");

    useEffect(() => {
        let isCancelled = false;

        async function verifyPayment() {
            try {
                window.sessionStorage.removeItem(PENDING_PAYMENT_KEY);
                window.localStorage.removeItem(PENDING_PAYMENT_KEY);

                const query = searchParams.toString();

                if (!query) {
                    router.replace(
                        "/checkout/failure?reason=VNPAY không trả về dữ liệu giao dịch.",
                    );
                    return;
                }

                const verifyResponse = await fetch(
                    `${BASE_URL}/payments/vnpay/return?${query}`,
                    { cache: "no-store" },
                );

                if (!verifyResponse.ok) {
                    throw new Error("Không thể xác minh kết quả thanh toán.");
                }

                const verified =
                    (await verifyResponse.json()) as VerifyPaymentReturnResponse;

                if (!verified.success || !verified.orderId) {
                    const reason =
                        verified.reason || "Thanh toán không thành công hoặc đã bị hủy.";
                    router.replace(
                        `/checkout/failure?reason=${encodeURIComponent(reason)}`,
                    );
                    return;
                }

                if (!isCancelled) {
                    setMessage("Thanh toán thành công. Đang cập nhật đơn thuê...");
                }

                const statusResponse = await fetch(
                    `${BASE_URL}/payments/${verified.orderId}/status`,
                    { cache: "no-store" },
                );
                const status = statusResponse.ok
                    ? ((await statusResponse.json()) as PaymentStatusResponse)
                    : null;

                clearCart();

                const params = new URLSearchParams({
                    orderId: verified.orderId,
                    totalPaid: String(status?.totalAmount ?? 0),
                    paymentMethod: "VNPAY",
                });

                router.replace(`/checkout/success?${params.toString()}`);
            } catch (error: any) {
                const reason =
                    error?.message || "Không thể xử lý kết quả thanh toán VNPAY.";
                router.replace(`/checkout/failure?reason=${encodeURIComponent(reason)}`);
            }
        }

        verifyPayment();

        return () => {
            isCancelled = true;
        };
    }, [clearCart, router, searchParams]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#F0F2F5] px-4 py-10 text-[#222222]">
            <section className="w-full max-w-[480px] rounded-md border border-[#D5D9D9] bg-white p-8 text-center shadow-sm">
                <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-[#FF9900]" />
                <h1 className="text-[22px] font-bold text-[#222222]">
                    Xử lý thanh toán
                </h1>
                <p className="mt-2 text-[14px] text-[#565959]">{message}</p>
            </section>
        </main>
    );
}
