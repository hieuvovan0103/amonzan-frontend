import Link from "next/link";
import { CheckCircle, Package, ShoppingBag } from "lucide-react";

export const metadata = {
    title: "Thanh toán thành công | Amonzan",
    description: "Đơn thuê của bạn đã được thanh toán và đang chờ shop duyệt.",
};

type CheckoutSuccessSearchParams = Promise<{
    orderId?: string | string[];
    totalPaid?: string | string[];
    paymentMethod?: string | string[];
    email?: string | string[];
    address?: string | string[];
}>;

type CheckoutSuccessPageProps = {
    searchParams?: CheckoutSuccessSearchParams;
};

function getParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

function formatPrice(value: number) {
    return value.toLocaleString("vi-VN");
}

export default async function CheckoutSuccessPage({
    searchParams,
}: CheckoutSuccessPageProps) {
    const params: Awaited<CheckoutSuccessSearchParams> = searchParams
        ? await searchParams
        : {};
    const totalPaid = Number(getParam(params.totalPaid));

    const orderReceipt = {
        id: getParam(params.orderId) || "AMZ-RNT-DEMO",
        totalPaid: Number.isFinite(totalPaid) && totalPaid > 0 ? totalPaid : 0,
        paymentMethod: getParam(params.paymentMethod) || "Chưa xác định",
        email: getParam(params.email) || "email của bạn",
        address: getParam(params.address) || "Địa chỉ giao nhận đã chọn",
    };

    return (
        <div className="flex min-h-screen flex-col bg-[#F0F2F5] text-[#222222]">
            <main className="mx-auto flex w-full max-w-[1000px] flex-1 justify-center px-4 py-10 md:px-8">
                <section className="w-full max-w-[650px] overflow-hidden rounded-md border border-[#D5D9D9] bg-white p-6 text-center shadow-sm md:p-10">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E6F4EA] shadow-sm">
                        <CheckCircle className="h-8 w-8 text-[#007600]" />
                    </div>

                    <h1 className="mb-2 text-[24px] font-bold text-[#007600]">
                        Thanh toán thành công
                    </h1>

                    <p className="mb-6 text-[14px] leading-6 text-[#222222]">
                        Cảm ơn bạn. Đơn thuê đã được thanh toán và đang chờ shop xác nhận trước khi chuẩn bị giao hàng.
                    </p>

                    <div className="mb-8 rounded-md border border-[#E6E6E6] bg-[#F7F7F7] p-5 text-left">
                        <h2 className="mb-3 border-b border-[#D5D9D9] pb-2 text-[14px] font-bold text-[#222222]">
                            Biên lai thanh toán
                        </h2>

                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 text-[13px] sm:grid-cols-2">
                            <div>
                                <span className="mb-1 block text-[#565959]">
                                    Mã đơn hàng:
                                </span>

                                <span className="font-bold text-[#007185]">
                                    {orderReceipt.id}
                                </span>
                            </div>

                            <div>
                                <span className="mb-1 block text-[#565959]">
                                    Tổng đã thanh toán:
                                </span>

                                <span className="text-[15px] font-bold text-[#B12704]">
                                    {formatPrice(orderReceipt.totalPaid)}đ
                                </span>
                            </div>

                            <div>
                                <span className="mb-1 block text-[#565959]">
                                    Phương thức thanh toán:
                                </span>

                                <span className="font-bold text-[#222222]">
                                    {orderReceipt.paymentMethod}
                                </span>
                            </div>

                            <div>
                                <span className="mb-1 block text-[#565959]">
                                    Người nhận hàng:
                                </span>

                                <span className="font-bold text-[#222222]">
                                    {orderReceipt.address}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
                        <Link
                            href="/profile"
                            className="flex items-center justify-center gap-2 rounded-md border border-[#F0C14B] bg-[#FFD814] px-5 py-2.5 text-[14px] font-bold text-[#111111] shadow-sm transition-colors hover:bg-[#F0C14B]"
                        >
                            <Package className="h-4 w-4" />
                            Xem tài khoản
                        </Link>

                        <Link
                            href="/products"
                            className="flex items-center justify-center gap-2 rounded-md border border-[#D5D9D9] bg-white px-5 py-2.5 text-[14px] font-bold text-[#222222] shadow-sm transition-colors hover:bg-[#F7F7F7]"
                        >
                            <ShoppingBag className="h-4 w-4 text-[#565959]" />
                            Thuê sản phẩm khác
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
