import Link from "next/link";
import { AlertTriangle, ArrowLeft, ShoppingCart, XCircle } from "lucide-react";

export const metadata = {
    title: "Thanh toán không thành công | Amonzan",
    description: "Thanh toán không thành công. Vui lòng thử lại.",
};

type CheckoutFailureSearchParams = Promise<{ reason?: string | string[] }>;

type CheckoutFailurePageProps = {
    searchParams?: CheckoutFailureSearchParams;
};

function getParam(value: string | string[] | undefined) {
    return Array.isArray(value) ? value[0] : value;
}

export default async function CheckoutFailurePage({
    searchParams,
}: CheckoutFailurePageProps) {
    const params: Awaited<CheckoutFailureSearchParams> = searchParams
        ? await searchParams
        : {};
    const reason =
        getParam(params.reason) ||
        "Giao dịch có thể đã bị từ chối bởi ngân hàng hoặc do hết thời gian chờ.";

    return (
        <div className="flex min-h-screen flex-col bg-[#F0F2F5] text-[#222222]">
            <main className="mx-auto flex w-full max-w-[1000px] flex-1 justify-center px-4 py-10 md:px-8">
                <section className="w-full max-w-[600px] overflow-hidden rounded-md border border-[#D5D9D9] bg-white p-8 text-center shadow-sm md:p-10">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FCF4F4] shadow-sm">
                        <XCircle className="h-8 w-8 text-[#C62828]" />
                    </div>
                    <h1 className="mb-2 text-[24px] font-bold text-[#C62828]">
                        Thanh toán không thành công
                    </h1>
                    <p className="mx-auto mb-6 max-w-md text-[14px] leading-[1.5] text-[#222222]">
                        Chúng tôi không thể xử lý khoản thanh toán của bạn lúc này. {reason}
                    </p>
                    <div className="mb-8 flex items-start gap-3 rounded-md border border-[#C62828]/20 bg-[#FCF4F4] p-4 text-left">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#C62828]" />
                        <p className="text-[13px] text-[#C62828]">
                            <strong>Lưu ý:</strong> Giỏ hàng của bạn vẫn được lưu lại. Vui lòng
                            kiểm tra lại địa chỉ giao nhận, ngày thuê, tồn kho hoặc thử chọn lại
                            sản phẩm.
                        </p>
                    </div>
                    <div className="flex flex-col justify-center gap-3 sm:flex-row">
                        <Link
                            href="/checkout"
                            className="flex items-center justify-center gap-2 rounded-md border border-[#F0C14B] bg-[#FFD814] px-6 py-2.5 text-[14px] font-bold text-[#111111] shadow-sm transition-colors hover:bg-[#F0C14B]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại thanh toán
                        </Link>
                        <Link
                            href="/cart"
                            className="flex items-center justify-center gap-2 rounded-md border border-[#D5D9D9] bg-white px-6 py-2.5 text-[14px] font-bold text-[#222222] shadow-sm transition-colors hover:bg-[#F7F7F7]"
                        >
                            <ShoppingCart className="h-4 w-4 text-[#565959]" />
                            Quay lại giỏ hàng
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
