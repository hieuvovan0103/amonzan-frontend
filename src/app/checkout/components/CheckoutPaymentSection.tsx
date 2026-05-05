import { paymentMethods } from "./checkout-data";

type CheckoutPaymentSectionProps = {
    selectedPayment: string;
    onChangePayment: (payment: string) => void;
};

export default function CheckoutPaymentSection({
    selectedPayment,
    onChangePayment,
}: CheckoutPaymentSectionProps) {
    return (
        <section className="overflow-hidden rounded-md border border-[#D5D9D9] bg-white shadow-sm">
            <div className="p-4 md:p-5">
                <div className="mb-4 flex gap-4">
                    <span className="text-[18px] font-bold text-[#222222]">2</span>

                    <h2 className="text-[18px] font-bold text-[#222222]">
                        Phương thức thanh toán
                    </h2>
                </div>

                <div className="ml-7 overflow-hidden rounded-md border border-[#D5D9D9] bg-[#F7F7F7] md:ml-8">
                    {paymentMethods.map((method, index) => {
                        const Icon = method.icon;
                        const isSelected = selectedPayment === method.id;

                        return (
                            <label
                                key={method.id}
                                className={[
                                    "flex cursor-pointer items-start gap-3 p-4 transition-colors hover:bg-white",
                                    index !== paymentMethods.length - 1
                                        ? "border-b border-[#D5D9D9]"
                                        : "",
                                    isSelected ? "bg-white" : "",
                                ].join(" ")}
                            >
                                <div className="flex-shrink-0 pt-0.5">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.id}
                                        checked={isSelected}
                                        onChange={(event) => onChangePayment(event.target.value)}
                                        className="h-4 w-4 cursor-pointer accent-[#007185] focus:ring-[#007185]"
                                    />
                                </div>

                                <div className="flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                        <Icon className="h-5 w-5 text-[#565959]" />

                                        <span className="text-[14px] font-bold text-[#222222]">
                                            {method.label}
                                        </span>
                                    </div>

                                    <p className="text-[12px] text-[#565959]">
                                        {method.description}
                                    </p>
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
