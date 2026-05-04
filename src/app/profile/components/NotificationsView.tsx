import {
    AlertCircle,
    Bell,
    CheckCircle2,
    MessageSquare,
    MoreVertical,
    Package,
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '@/data/userProfile';
import { NotificationType } from '@/types/user-profile';

function getNotificationIcon(type: NotificationType) {
    switch (type) {
        case 'ORDER':
            return <Package className="w-5 h-5 text-[#007185]" />;
        case 'SYSTEM':
            return <CheckCircle2 className="w-5 h-5 text-[#007600]" />;
        case 'WARNING':
            return <AlertCircle className="w-5 h-5 text-[#E47911]" />;
        case 'MESSAGE':
            return <MessageSquare className="w-5 h-5 text-[#565959]" />;
        default:
            return <Bell className="w-5 h-5 text-[#565959]" />;
    }
}

export default function NotificationsView() {
    return (
        <div className="flex-1 bg-white rounded-[16px] border border-[#E6E6E6] shadow-sm p-6 md:p-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-[#E6E6E6] pb-4 mb-2">
                <div>
                    <h1 className="text-[20px] font-bold text-[#222222] uppercase mb-1">
                        Thông báo của tôi
                    </h1>
                    <p className="text-[14px] text-[#565959]">
                        Cập nhật trạng thái đơn hàng và tin nhắn mới nhất.
                    </p>
                </div>

                <button className="text-[13px] text-[#007185] hover:text-[#E47911] hover:underline font-medium">
                    Đánh dấu tất cả đã đọc
                </button>
            </div>

            <div className="flex flex-col">
                {MOCK_NOTIFICATIONS.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex gap-4 p-4 border-b border-[#E6E6E6] hover:bg-[#F9FAFB] cursor-pointer transition-colors relative ${!notification.isRead ? 'bg-[#FF9900]/5' : ''
                            }`}
                    >
                        {!notification.isRead && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF9900]" />
                        )}

                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!notification.isRead ? 'bg-white shadow-sm' : 'bg-[#F7F7F7]'
                                }`}
                        >
                            {getNotificationIcon(notification.type)}
                        </div>

                        <div className="flex-1">
                            <h3
                                className={`text-[14px] mb-1 ${!notification.isRead
                                        ? 'font-bold text-[#222222]'
                                        : 'font-medium text-[#222222]'
                                    }`}
                            >
                                {notification.title}
                            </h3>

                            <p className="text-[13px] text-[#565959] mb-2 leading-[1.5]">
                                {notification.content}
                            </p>

                            <span className="text-[11px] text-[#6B7280] font-medium">
                                {notification.time}
                            </span>
                        </div>

                        <button className="p-1 hover:bg-[#E6E6E6] rounded-md text-[#6B7280] h-fit">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <div className="py-6 text-center">
                    <button className="text-[14px] text-[#007185] hover:text-[#E47911] hover:underline font-medium">
                        Xem thêm thông báo cũ hơn
                    </button>
                </div>
            </div>
        </div>
    );
}