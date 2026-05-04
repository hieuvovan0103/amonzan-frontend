import { Plus } from 'lucide-react';
import { MOCK_ADDRESSES } from '@/data/userProfile';

export default function AddressBookView() {
    return (
        <div className="flex-1 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-4 mb-6">
                <h2 className="text-[20px] font-bold text-[#222222]">
                    Địa chỉ của tôi
                </h2>

                <button className="bg-[#FF9900] text-[#111111] font-semibold text-[13px] px-4 py-2 rounded-[8px] flex items-center gap-1.5">
                    <Plus className="w-4 h-4" />
                    Thêm địa chỉ
                </button>
            </div>

            <div className="flex flex-col gap-0">
                {MOCK_ADDRESSES.map((address, index) => (
                    <div
                        key={address.id}
                        className={`flex flex-col sm:flex-row justify-between py-5 gap-4 ${index !== MOCK_ADDRESSES.length - 1
                                ? 'border-b border-[#E6E6E6]'
                                : ''
                            }`}
                    >
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[15px] font-bold">{address.name}</span>
                                <span className="text-[14px] text-[#565959]">
                                    {address.phone}
                                </span>
                            </div>

                            <div className="text-[13px] text-[#565959]">
                                {address.addressLine1}
                                <br />
                                {address.addressLine2}
                            </div>
                        </div>

                        {address.isDefault && (
                            <span className="border border-[#FF9900] text-[#FF9900] bg-[#FF9900]/10 text-[12px] font-semibold px-2 py-0.5 rounded-[4px] h-fit">
                                Mặc định
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}