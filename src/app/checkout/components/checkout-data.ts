import { CreditCard, ShieldCheck, Wallet } from "lucide-react";
export {
    getItemDepositTotal,
    getItemRentTotal,
    getRentalDays,
} from "@/lib/cart-pricing";

export const paymentMethods = [
    {
        id: "vnpay",
        label: "Thanh toán qua VNPAY",
        icon: Wallet,
        description: "Quét mã QR hoặc dùng thẻ ATM/Visa/MasterCard",
    },
    {
        id: "credit",
        label: "Thẻ tín dụng / ghi nợ",
        icon: CreditCard,
        description: "Liên kết thẻ an toàn qua cổng thanh toán",
    },
    {
        id: "transfer",
        label: "Chuyển khoản ngân hàng",
        icon: ShieldCheck,
        description: "Chuyển khoản thủ công 24/7",
    },
];

export const shippingFee = 45000;

export function formatPrice(amount: number) {
    return amount.toLocaleString("vi-VN");
}

export function getPaymentMethodLabel(paymentId: string) {
    return paymentMethods.find((method) => method.id === paymentId)?.label ?? paymentId;
}
