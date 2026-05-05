"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfileAddresses, type ProfileAddress } from "@/lib/api/profile";
import { fetchWithAuth } from "@/lib/apiClient";
import { getCartStockIssues, type CartStockIssue } from "@/lib/cart-stock";
import { useCartStore } from "@/stores/useCartStore";
import type { CartItem } from "@/types/cart";
import CheckoutAddressSection from "./CheckoutAddressSection";
import CheckoutPaymentSection from "./CheckoutPaymentSection";
import CheckoutItemsSection from "./CheckoutItemsSection";
import CheckoutVoucherBox from "./CheckoutVoucherBox";
import CheckoutSummary from "./CheckoutSummary";
import { getItemDepositTotal, getItemRentTotal, shippingFee } from "./checkout-data";

const PENDING_PAYMENT_KEY = "amonzan-pending-payment";
const BF_CACHE_RELOAD_KEY = "amonzan-checkout-bfcache-reloaded";

type PendingPayment = {
    orderId: string;
    paymentUrl: string;
};

function buildFailureUrl(reason: string) {
    return `/checkout/failure?reason=${encodeURIComponent(reason)}`;
}

async function readApiError(response: Response, fallback: string) {
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        const body = await response.json().catch(() => null);
        const message = Array.isArray(body?.message)
            ? body.message.join(", ")
            : body?.message || body?.error || body?.details;

        if (message) return message;
    } else {
        const text = await response.text().catch(() => "");
        if (text.trim()) return text.trim();
    }

    if (response.status === 401) {
        return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại trước khi đặt thuê.";
    }

    return `${fallback} (HTTP ${response.status})`;
}

function readPendingPayment() {
    if (typeof window === "undefined") return null;

    try {
        const value =
            window.sessionStorage.getItem(PENDING_PAYMENT_KEY) ||
            window.localStorage.getItem(PENDING_PAYMENT_KEY);
        if (!value) return null;

        const pending = JSON.parse(value) as PendingPayment;
        if (!pending.orderId || !pending.paymentUrl) return null;

        return pending;
    } catch {
        window.sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        window.localStorage.removeItem(PENDING_PAYMENT_KEY);
        return null;
    }
}

function writePendingPayment(pending: PendingPayment) {
    const value = JSON.stringify(pending);
    window.sessionStorage.setItem(PENDING_PAYMENT_KEY, value);
    window.localStorage.setItem(PENDING_PAYMENT_KEY, value);
}

function removePendingPayment() {
    window.sessionStorage.removeItem(PENDING_PAYMENT_KEY);
    window.localStorage.removeItem(PENDING_PAYMENT_KEY);
}

function readCartItemsFromStorage() {
    if (typeof window === "undefined") return null;

    try {
        const value = window.localStorage.getItem("amonzan-cart");
        if (!value) return [];

        const parsed = JSON.parse(value) as { state?: { items?: CartItem[] } };
        return Array.isArray(parsed.state?.items) ? parsed.state.items : [];
    } catch {
        return [];
    }
}

export default function CheckoutPage() {
    const router = useRouter();

    const [selectedPayment, setSelectedPayment] = useState("vnpay");
    const [voucherCode, setVoucherCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [voucherMessage, setVoucherMessage] = useState("");
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [isLoadingAddress, setIsLoadingAddress] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState<ProfileAddress | null>(null);
    const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
    const [storageCartItems, setStorageCartItems] = useState<CartItem[] | null>(null);
    const [stockIssues, setStockIssues] = useState<CartStockIssue[]>([]);

    const items = useCartStore((state) => state.items);
    const hasHydratedCart = useCartStore((state) => state.hasHydrated);
    const effectiveItems = items.length > 0 ? items : storageCartItems ?? [];

    const selectedItems = useMemo(() => {
        return effectiveItems.filter((item) => item.selected);
    }, [effectiveItems]);

    const selectedStockIssues = useMemo(() => {
        return stockIssues.filter((issue) =>
            selectedItems.some((item) => item.id === issue.itemId),
        );
    }, [selectedItems, stockIssues]);

    const totalRentFee = useMemo(() => {
        return selectedItems.reduce((sum, item) => sum + getItemRentTotal(item), 0);
    }, [selectedItems]);

    const totalDeposit = useMemo(() => {
        return selectedItems.reduce((sum, item) => sum + getItemDepositTotal(item), 0);
    }, [selectedItems]);

    const finalTotal = Math.max(0, totalRentFee + totalDeposit + shippingFee - discount);
    const unavailableMessage = selectedStockIssues.length
        ? selectedStockIssues.map((issue) => issue.message).join(" ")
        : "";

    useEffect(() => {
        setPendingPayment(readPendingPayment());
        setStorageCartItems(readCartItemsFromStorage());
    }, []);

    useEffect(() => {
        let isCancelled = false;

        async function loadStockIssues() {
            const issues = await getCartStockIssues(effectiveItems);

            if (!isCancelled) {
                setStockIssues(issues);
            }
        }

        loadStockIssues();

        return () => {
            isCancelled = true;
        };
    }, [effectiveItems]);

    useEffect(() => {
        const syncCheckoutState = () => {
            setIsPlacingOrder(false);
            setPendingPayment(readPendingPayment());
            setStorageCartItems(readCartItemsFromStorage());
        };

        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                const alreadyReloaded = window.sessionStorage.getItem(BF_CACHE_RELOAD_KEY);

                if (!alreadyReloaded) {
                    window.sessionStorage.setItem(BF_CACHE_RELOAD_KEY, "1");
                    window.location.reload();
                    return;
                }
            }

            window.sessionStorage.removeItem(BF_CACHE_RELOAD_KEY);
            syncCheckoutState();
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                syncCheckoutState();
            }
        };

        const navigationEntry = performance.getEntriesByType("navigation")[0] as
            | PerformanceNavigationTiming
            | undefined;

        if (navigationEntry?.type === "back_forward") {
            const alreadyReloaded = window.sessionStorage.getItem(BF_CACHE_RELOAD_KEY);

            if (!alreadyReloaded) {
                window.sessionStorage.setItem(BF_CACHE_RELOAD_KEY, "1");
                window.location.reload();
                return;
            }
        }

        window.addEventListener("pageshow", handlePageShow);
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            window.removeEventListener("pageshow", handlePageShow);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        let isCancelled = false;

        async function loadAddress() {
            try {
                const addresses = await getProfileAddresses();
                const defaultAddress =
                    addresses.find((address) => address.is_default) ?? addresses[0] ?? null;

                if (!isCancelled) {
                    setSelectedAddress(defaultAddress);
                }
            } catch {
                if (!isCancelled) {
                    setSelectedAddress(null);
                }
            } finally {
                if (!isCancelled) {
                    setIsLoadingAddress(false);
                }
            }
        }

        loadAddress();

        return () => {
            isCancelled = true;
        };
    }, []);

    const handleApplyVoucher = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const code = voucherCode.trim().toUpperCase();

        if (!code) {
            setVoucherMessage("Vui lòng nhập mã giảm giá.");
            setDiscount(0);
            return;
        }

        if (code === "AMONZAN50") {
            setDiscount(Math.min(50000, totalRentFee));
            setVoucherMessage("Áp dụng mã giảm giá thành công.");
            return;
        }

        setDiscount(0);
        setVoucherMessage("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    };

    const handlePlaceOrder = async () => {
        if (isPlacingOrder) return;

        if (selectedStockIssues.length > 0) return;

        if (selectedPayment !== "vnpay") {
            router.push(buildFailureUrl("Hiện tại hệ thống chỉ hỗ trợ thanh toán qua VNPAY."));
            return;
        }

        const invalidItem = selectedItems.find(
            (item) => !item.variantId || !item.rentalStart || !item.rentalEnd,
        );

        if (invalidItem) {
            router.push(
                buildFailureUrl(
                    "Giỏ hàng thiếu thông tin biến thể hoặc ngày thuê. Vui lòng xóa sản phẩm này và thêm lại từ trang chi tiết sản phẩm.",
                ),
            );
            return;
        }

        if (!selectedAddress) {
            router.push(buildFailureUrl("Chưa có địa chỉ giao nhận hợp lệ để tạo đơn thuê."));
            return;
        }

        setIsPlacingOrder(true);

        try {
            const orderResponse = await fetchWithAuth("/orders", {
                method: "POST",
                body: JSON.stringify({
                    addressId: selectedAddress.address_id,
                    voucherCode: voucherCode.trim() || undefined,
                    note: "",
                    items: selectedItems.map((item) => ({
                        variantId: item.variantId,
                        quantity: item.quantity,
                        rentalStart: item.rentalStart,
                        rentalEnd: item.rentalEnd,
                    })),
                }),
            });

            if (!orderResponse.ok) {
                const message = await readApiError(
                    orderResponse,
                    "Không thể tạo đơn thuê. Vui lòng thử lại.",
                );
                console.warn("[checkout] create order failed", {
                    status: orderResponse.status,
                    message,
                });
                router.push(buildFailureUrl(message));
                return;
            }

            const order = await orderResponse.json();
            const paymentResponse = await fetchWithAuth(
                "/payments/vnpay/create-payment-url",
                {
                    method: "POST",
                    body: JSON.stringify({ orderId: order.orderId }),
                },
            );

            if (!paymentResponse.ok) {
                const message = await readApiError(
                    paymentResponse,
                    "Không thể tạo đường dẫn thanh toán VNPAY.",
                );
                console.warn("[checkout] create payment URL failed", {
                    status: paymentResponse.status,
                    message,
                });
                router.push(buildFailureUrl(message));
                return;
            }

            const payment = await paymentResponse.json();

            if (!payment.paymentUrl) {
                router.push(buildFailureUrl("VNPAY không trả về đường dẫn thanh toán."));
                return;
            }

            writePendingPayment({
                orderId: order.orderId,
                paymentUrl: payment.paymentUrl,
            });

            window.location.href = payment.paymentUrl;
        } catch (error: any) {
            const message =
                error?.message ||
                "Không thể kết nối tới hệ thống đặt thuê. Vui lòng thử lại.";
            console.warn("[checkout] place order failed", { message });
            router.push(buildFailureUrl(message));
        } finally {
            setIsPlacingOrder(false);
        }
    };

    const handleContinuePendingPayment = () => {
        if (!pendingPayment?.paymentUrl) return;
        window.location.href = pendingPayment.paymentUrl;
    };

    const handleClearPendingPayment = () => {
        removePendingPayment();
        setPendingPayment(null);
        router.push("/cart");
    };

    if (pendingPayment) {
        return (
            <div className="flex min-h-screen flex-col bg-[#F0F2F5] text-[#222222]">
                <main className="mx-auto flex w-full max-w-[1000px] flex-1 px-4 py-8">
                    <section className="w-full rounded-md border border-[#D5D9D9] bg-white p-8 text-center shadow-sm">
                        <h1 className="text-[24px] font-bold text-[#222222]">
                            Đơn thuê đang chờ thanh toán
                        </h1>
                        <p className="mx-auto mt-2 max-w-[560px] text-[14px] leading-6 text-[#565959]">
                            Bạn vừa rời khỏi cổng VNPAY trước khi hoàn tất giao dịch. Có thể tiếp tục thanh toán đơn này hoặc quay lại giỏ hàng để kiểm tra lại.
                        </p>
                        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                            <button
                                type="button"
                                onClick={handleContinuePendingPayment}
                                className="rounded-[999px] border border-[#F0C14B] bg-[#FFD814] px-8 py-3 text-[14px] font-semibold text-[#111111] hover:bg-[#F0C14B]"
                            >
                                Tiếp tục thanh toán
                            </button>
                            <button
                                type="button"
                                onClick={handleClearPendingPayment}
                                className="rounded-[999px] border border-[#D5D9D9] bg-white px-8 py-3 text-[14px] font-semibold text-[#111111] hover:bg-[#F7F7F7]"
                            >
                                Quay lại giỏ hàng
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    if (!hasHydratedCart && storageCartItems === null) {
        return (
            <main className="min-h-screen bg-[#F0F2F5] px-4 py-8">
                <div className="mx-auto max-w-[1000px]">
                    <div className="rounded-md border border-[#D5D9D9] bg-white p-8 text-center shadow-sm">
                        <p className="text-[15px] font-semibold text-[#222222]">
                            Đang khôi phục giỏ hàng...
                        </p>
                    </div>
                </div>
            </main>
        );
    }

    if (selectedItems.length === 0) {
        return (
            <div className="flex min-h-screen flex-col bg-[#F0F2F5] text-[#222222]">
                <main className="mx-auto flex w-full max-w-[1000px] flex-1 px-4 py-8">
                    <section className="w-full rounded-md border border-[#D5D9D9] bg-white p-8 text-center shadow-sm">
                        <h1 className="text-[24px] font-bold text-[#222222]">
                            Chưa có sản phẩm nào để thanh toán
                        </h1>
                        <p className="mt-2 text-[14px] text-[#565959]">
                            Hãy quay lại giỏ hàng và chọn sản phẩm muốn thuê trước khi thanh toán.
                        </p>
                        <button
                            type="button"
                            onClick={() => router.push("/cart")}
                            className="mt-6 rounded-[999px] border border-[#F0C14B] bg-[#FFD814] px-8 py-3 text-[14px] font-semibold text-[#111111] hover:bg-[#F0C14B]"
                        >
                            Quay lại giỏ hàng
                        </button>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-[#F0F2F5] font-sans text-[#222222]">
            <main className="mx-auto flex w-full max-w-[1000px] flex-1 flex-col items-start gap-6 px-4 py-6 md:flex-row md:py-8">
                <div className="w-full flex-1 space-y-4">
                    <CheckoutAddressSection
                        address={selectedAddress}
                        isLoading={isLoadingAddress}
                    />
                    <CheckoutPaymentSection
                        selectedPayment={selectedPayment}
                        onChangePayment={setSelectedPayment}
                    />
                    <CheckoutItemsSection
                        items={selectedItems}
                        totalDeposit={totalDeposit}
                        stockIssues={selectedStockIssues}
                    />
                </div>
                <aside className="w-full flex-shrink-0 md:sticky md:top-24 md:w-[320px]">
                    <CheckoutVoucherBox
                        voucherCode={voucherCode}
                        voucherMessage={voucherMessage}
                        discount={discount}
                        onChangeVoucherCode={setVoucherCode}
                        onApplyVoucher={handleApplyVoucher}
                    />
                    <CheckoutSummary
                        totalRentFee={totalRentFee}
                        totalDeposit={totalDeposit}
                        shippingFee={shippingFee}
                        discount={discount}
                        finalTotal={finalTotal}
                        selectedPayment={selectedPayment}
                        isPlacingOrder={isPlacingOrder}
                        unavailableMessage={unavailableMessage}
                        onPlaceOrder={handlePlaceOrder}
                    />
                </aside>
            </main>
        </div>
    );
}
