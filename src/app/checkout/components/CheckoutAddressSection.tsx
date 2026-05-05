import Link from "next/link";
import type { ProfileAddress } from "@/lib/api/profile";

type CheckoutAddressSectionProps = {
    address: ProfileAddress | null;
    isLoading?: boolean;
};

function formatAddress(address: ProfileAddress) {
    return [
        address.line1,
        address.line2,
        address.ward,
        address.district,
        address.city,
        address.province,
    ]
        .filter(Boolean)
        .join(", ");
}

export default function CheckoutAddressSection({
    address,
    isLoading = false,
}: CheckoutAddressSectionProps) {
    return (
        <section className="overflow-hidden rounded-md border border-[#D5D9D9] bg-white shadow-sm">
            <div className="flex items-center justify-between gap-4 p-4 md:p-5">
                <div className="flex gap-4">
                    <span className="text-[18px] font-bold text-[#222222]">1</span>

                    <div>
                        <h2 className="mb-1 text-[18px] font-bold text-[#222222]">
                            Địa chỉ giao nhận
                        </h2>

                        {isLoading ? (
                            <p className="text-[14px] text-[#565959]">
                                Đang tải địa chỉ...
                            </p>
                        ) : address ? (
                            <div className="text-[14px] leading-[1.5] text-[#222222]">
                                <span className="font-bold">{address.recipient_name}</span>

                                <span className="mx-1 text-[#565959]">|</span>

                                {address.phone_number}

                                <br />

                                {formatAddress(address)}
                            </div>
                        ) : (
                            <p className="text-[14px] text-[#C62828]">
                                Bạn chưa có địa chỉ giao nhận.
                            </p>
                        )}
                    </div>
                </div>

                <Link
                    href="/profile"
                    className="flex-shrink-0 text-[13px] font-medium text-[#007185] hover:text-[#E47911] hover:underline"
                >
                    {address ? "Thay đổi" : "Thêm địa chỉ"}
                </Link>
            </div>
        </section>
    );
}
