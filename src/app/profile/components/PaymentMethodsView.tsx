import { CreditCard, Landmark, Plus, ShieldCheck } from "lucide-react";

const bankAccounts = [
    {
        id: 1,
        name: "VCB - Ngân hàng TMCP Ngoại thương Việt Nam",
        fullName: "NGUYEN VAN A",
        branch: "Chi nhánh Cần Thơ",
        number: "**101",
        isDefault: true,
    },
    {
        id: 2,
        name: "TCB - Ngân hàng TMCP Kỹ thương Việt Nam",
        fullName: "NGUYEN VAN A",
        branch: "Chi nhánh Hồ Chí Minh",
        number: "**202",
        isDefault: false,
    },
];

export default function PaymentMethodsView() {
    return (
        <section className="rounded-[8px] border border-[#E6E6E6] bg-white">
            <div className="border-b border-[#E6E6E6] px-5 py-4 md:px-6">
                <h2 className="text-[18px] font-bold text-[#222222]">Thanh toán</h2>
                <p className="mt-1 text-[13px] text-[#565959]">
                    Quản lý thẻ và tài khoản nhận hoàn tiền.
                </p>
            </div>

            <div className="space-y-6 p-5 md:p-6">
                <div className="rounded-[8px] border border-[#E6E6E6]">
                    <div className="flex flex-col gap-3 border-b border-[#E6E6E6] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-[16px] font-bold text-[#222222]">Thẻ thanh toán</h3>
                            <p className="mt-1 text-[13px] text-[#565959]">Dùng để thanh toán đơn thuê nhanh hơn.</p>
                        </div>
                        <button className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#FF9900] px-4 py-2 text-[13px] font-bold text-[#111111]">
                            <Plus className="h-4 w-4" />
                            Thêm thẻ
                        </button>
                    </div>

                    <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
                        <CreditCard className="mb-3 h-10 w-10 text-[#A0A0A0]" />
                        <div className="text-[14px] font-bold text-[#222222]">Chưa liên kết thẻ</div>
                        <p className="mt-1 text-[13px] text-[#565959]">
                            Bạn có thể thêm thẻ khi hệ thống thanh toán thẻ được kích hoạt.
                        </p>
                    </div>
                </div>

                <div className="rounded-[8px] border border-[#E6E6E6]">
                    <div className="flex flex-col gap-3 border-b border-[#E6E6E6] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-[16px] font-bold text-[#222222]">Tài khoản ngân hàng</h3>
                            <p className="mt-1 text-[13px] text-[#565959]">Dùng cho hoàn tiền và đối soát giao dịch.</p>
                        </div>
                        <button className="inline-flex items-center justify-center gap-2 rounded-[4px] bg-[#FF9900] px-4 py-2 text-[13px] font-bold text-[#111111]">
                            <Plus className="h-4 w-4" />
                            Thêm tài khoản
                        </button>
                    </div>

                    <div className="divide-y divide-[#E6E6E6]">
                        {bankAccounts.map((bank) => (
                            <div key={bank.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-[#F7F7F7]">
                                        <Landmark className="h-5 w-5 text-[#565959]" />
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="font-bold text-[#222222]">{bank.name}</span>
                                            {bank.isDefault ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2 py-0.5 text-[11px] font-bold text-[#007600]">
                                                    <ShieldCheck className="h-3 w-3" />
                                                    Mặc định
                                                </span>
                                            ) : null}
                                        </div>
                                        <div className="mt-1 text-[13px] text-[#565959]">
                                            {bank.fullName} - {bank.branch}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-[15px] font-bold tracking-widest text-[#222222]">
                                    {bank.number}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
