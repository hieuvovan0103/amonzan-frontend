"use client";

import { Loader2, X } from "lucide-react";
import type { AppNotification } from "@/types/notification";
import NotificationItem from "@/components/notifications/NotificationItem";

type NotificationDropdownProps = {
    notifications: AppNotification[];
    isLoading: boolean;
    onItemClick: (notification: AppNotification) => void;
    onReadAll: () => void;
    onClose: () => void;
};

export default function NotificationDropdown({
    notifications,
    isLoading,
    onItemClick,
    onReadAll,
    onClose,
}: NotificationDropdownProps) {
    return (
        <div className="fixed left-3 right-3 top-[72px] z-[70] max-h-[calc(100vh-88px)] overflow-hidden rounded-[10px] border border-[#E6E6E6] bg-white text-[#222222] shadow-[0_16px_40px_rgba(0,0,0,0.22)] md:absolute md:left-auto md:right-0 md:top-[calc(100%+10px)] md:z-50 md:w-[360px] md:max-h-none md:rounded-[12px] md:shadow-[0_10px_30px_rgba(0,0,0,0.14)]">
            <div className="flex items-center justify-between gap-3 border-b border-[#E6E6E6] px-4 py-3">
                <div>
                    <div className="text-[16px] font-bold md:text-[14px]">Thông báo</div>
                    <div className="mt-0.5 text-[12px] text-[#565959] md:hidden">
                        Cập nhật mới nhất từ Amonzan
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onReadAll}
                        disabled={isLoading || notifications.length === 0}
                        className="rounded-[4px] px-2 py-1.5 text-[12px] font-bold text-[#007185] transition-colors hover:bg-[#F7F7F7] hover:text-[#E47911] disabled:cursor-not-allowed disabled:text-[#8A8A8A]"
                    >
                        Đánh dấu đã đọc
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D5D9D9] transition-colors hover:bg-[#F7F7F7] md:hidden"
                        aria-label="Đóng thông báo"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="max-h-[calc(100vh-168px)] overflow-y-auto md:max-h-[420px]">
                {isLoading ? (
                    <div className="flex h-36 items-center justify-center md:h-28">
                        <Loader2 className="h-6 w-6 animate-spin text-[#FF9900]" />
                    </div>
                ) : notifications.length ? (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.notificationId}
                            notification={notification}
                            onClick={onItemClick}
                        />
                    ))
                ) : (
                    <div className="px-5 py-10 text-center text-[14px] text-[#565959] md:px-4 md:py-8 md:text-[13px]">
                        Chưa có thông báo nào.
                    </div>
                )}
            </div>
        </div>
    );
}
