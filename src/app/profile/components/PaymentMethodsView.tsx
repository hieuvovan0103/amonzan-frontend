import { CreditCard, Plus } from 'lucide-react';
import { MOCK_BANKS } from '@/data/userProfile';

export default function PaymentMethodsView() {
    return (
        <div className="flex-1 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8 animate-in fade-in duration-300">
            <div className="mb-10">
                <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-4 mb-6">
                    <h2 className="text-[20px] font-bold text-[#222222]">
                        Thẻ tín dụng / ghi nợ
                    </h2>

                    <button className="bg-[#FF9900] text-[#111111] font-semibold text-[13px] px-4 py-2 rounded-[8px] flex items-center gap-1.5">
                        <Plus className="w-4 h-4" />
                        Thêm thẻ mới
                    </button>
                </div>

                <div className="py-8 text-center text-[#6B7280] text-[14px] bg-[#F7F7F7] rounded-[12px] border border-dashed border-[#D5D9D9]">
                    Bạn chưa liên kết thẻ.
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-4 mb-6">
                    <h2 className="text-[20px] font-bold text-[#222222]">
                        Tài khoản ngân hàng
                    </h2>

                    <button className="bg-[#FF9900] text-[#111111] font-semibold text-[13px] px-4 py-2 rounded-[8px] flex items-center gap-1.5">
                        <Plus className="w-4 h-4" />
                        Thêm tài khoản
                    </button>
                </div>

                <div className="flex flex-col gap-4">
                    {MOCK_BANKS.map((bank) => (
                        <div
                            key={bank.id}
                            className="flex flex-col sm:flex-row justify-between sm:items-center p-5 border border-[#D5D9D9] rounded-[12px]"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#F7F7F7] rounded-[8px] flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-[#565959]" />
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[15px] font-bold">{bank.name}</span>

                                        {bank.isDefault && (
                                            <span className="text-[11px] font-bold text-white bg-[#007600] px-2 py-0.5 rounded-full">
                                                Mặc định
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-[13px] text-[#565959]">
                                        {bank.fullName} - {bank.branch}
                                    </div>
                                </div>
                            </div>

                            <div className="text-[16px] font-bold tracking-widest mt-2 sm:mt-0">
                                {bank.number}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}