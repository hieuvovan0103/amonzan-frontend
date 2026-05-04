import {
    Bell,
    ClipboardList,
    UserCircle,
} from 'lucide-react';
import { ProfileTab } from '@/types/user-profile';

type ProfileSidebarProps = {
    activeTab: ProfileTab;
    onChangeTab: (tab: ProfileTab) => void;
};

export default function ProfileSidebar({
    activeTab,
    onChangeTab,
}: ProfileSidebarProps) {
    return (
        <aside className="w-full md:w-[240px] flex-shrink-0 bg-[#F7F7F7] md:bg-transparent">
            <nav className="flex flex-col gap-2 md:sticky md:top-[90px]">
                <button
                    onClick={() => onChangeTab('notifications')}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-[10px] transition-all font-medium ${activeTab === 'notifications'
                            ? 'bg-white shadow-sm text-[#FF9900]'
                            : 'text-[#222222] hover:bg-white hover:shadow-sm'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5" />
                        <span>Thông báo</span>
                    </div>

                    <span className="bg-[#C62828] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">
                        2
                    </span>
                </button>

                <button
                    onClick={() => onChangeTab('my_orders')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all font-medium ${activeTab === 'my_orders'
                            ? 'bg-white shadow-sm text-[#FF9900]'
                            : 'text-[#222222] hover:bg-white hover:shadow-sm'
                        }`}
                >
                    <ClipboardList className="w-5 h-5" />
                    <span>Đơn đi thuê</span>
                </button>

                <div className="flex flex-col mt-4">
                    <div className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] text-[#222222] font-medium cursor-default">
                        <UserCircle className="w-5 h-5 text-[#565959]" />
                        <span>Tài khoản của tôi</span>
                    </div>

                    <div className="pl-[44px] pr-4 py-2 flex flex-col gap-4 text-left border-l border-[#D5D9D9] ml-6 mt-1">
                        <button
                            onClick={() => onChangeTab('profile')}
                            className={`text-[14px] font-bold text-left ${activeTab === 'profile'
                                    ? 'text-[#FF9900]'
                                    : 'text-[#565959] hover:text-[#222222]'
                                }`}
                        >
                            Hồ sơ cá nhân
                        </button>

                        <button
                            onClick={() => onChangeTab('payments')}
                            className={`text-[14px] font-bold text-left ${activeTab === 'payments'
                                    ? 'text-[#FF9900]'
                                    : 'text-[#565959] hover:text-[#222222]'
                                }`}
                        >
                            Phương thức thanh toán
                        </button>

                        <button
                            onClick={() => onChangeTab('addresses')}
                            className={`text-[14px] font-bold text-left ${activeTab === 'addresses'
                                    ? 'text-[#FF9900]'
                                    : 'text-[#565959] hover:text-[#222222]'
                                }`}
                        >
                            Địa chỉ giao nhận
                        </button>
                    </div>
                </div>
            </nav>
        </aside>
    );
}