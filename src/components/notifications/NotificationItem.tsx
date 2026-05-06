"use client";

import type { AppNotification } from "@/types/notification";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

type NotificationItemProps = {
    notification: AppNotification;
    onClick: (notification: AppNotification) => void;
};

export default function NotificationItem({ notification, onClick }: NotificationItemProps) {
    return (
        <button
            type="button"
            onClick={() => onClick(notification)}
            className={`w-full border-b border-[#E6E6E6] px-4 py-4 text-left transition-colors hover:bg-[#F7F7F7] md:py-3 ${
                notification.isRead ? "bg-white" : "bg-[#FFF8E1]"
            }`}
        >
            <div className="flex items-start gap-3 md:gap-2">
                {!notification.isRead ? (
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-[#C62828]" />
                ) : (
                    <span className="mt-1.5 h-2 w-2 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-[14px] font-bold leading-5 text-[#222222] md:text-[13px] md:leading-normal">
                        {notification.title}
                    </div>
                    {notification.content ? (
                        <div className="mt-1 line-clamp-3 text-[13px] leading-5 text-[#565959] md:line-clamp-2 md:text-[12px] md:leading-normal">
                            {notification.content}
                        </div>
                    ) : null}
                    <div className="mt-2 text-[11px] font-medium text-[#6B7280] md:mt-1">
                        {formatDate(notification.createdAt)}
                    </div>
                </div>
            </div>
        </button>
    );
}
