"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import NotificationItem from "@/components/notifications/NotificationItem";
import { useNotificationStore } from "@/stores/notificationStore";
import { useToastStore } from "@/stores/useToastStore";
import type { AppNotification } from "@/types/notification";

function normalizeInternalHref(href: string) {
    return href.startsWith("/") ? href : `/${href}`;
}

function getNotificationHref(notification: AppNotification) {
    const actionUrl = notification.actionUrl ?? notification.action_url;
    if (actionUrl) return normalizeInternalHref(actionUrl);

    const relatedType = notification.relatedType ?? notification.related_type;
    const relatedId = notification.relatedId ?? notification.related_id;
    if (relatedType === "ORDER" && relatedId) {
        return `/profile?tab=my_orders&orderId=${relatedId}`;
    }

    const orderId =
        notification.orderId ??
        notification.order_id ??
        notification.metadata?.orderId ??
        notification.metadata?.order_id;

    return orderId ? `/profile?tab=my_orders&orderId=${orderId}` : null;
}

export default function NotificationsView() {
    const router = useRouter();
    const showToast = useToastStore((state) => state.show);
    const {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
    } = useNotificationStore();

    useEffect(() => {
        fetchNotifications().catch((error: any) => {
            showToast(error?.message || "Không thể tải thông báo.", "error");
        });
    }, [fetchNotifications, showToast]);

    const handleItemClick = async (notification: AppNotification) => {
        try {
            await markAsRead(notification.notificationId);
            const href = getNotificationHref(notification);
            if (href) router.push(href);
        } catch (error: any) {
            showToast(error?.message || "Không thể đánh dấu thông báo đã đọc.", "error");
        }
    };

    const handleReadAll = async () => {
        try {
            await markAllAsRead();
        } catch (error: any) {
            showToast(error?.message || "Không thể đánh dấu tất cả đã đọc.", "error");
        }
    };

    return (
        <section className="rounded-[8px] border border-[#E6E6E6] bg-white">
            <div className="flex flex-col gap-3 border-b border-[#E6E6E6] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
                <div>
                    <h2 className="text-[18px] font-bold text-[#222222]">Thông báo</h2>
                    <p className="mt-1 text-[13px] text-[#565959]">
                        {unreadCount > 0
                            ? `Bạn có ${unreadCount} thông báo chưa đọc.`
                            : "Bạn đã đọc hết thông báo mới."}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleReadAll}
                    disabled={loading || notifications.length === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-[4px] border border-[#D5D9D9] bg-white px-4 py-2 text-[13px] font-bold text-[#007185] transition-colors hover:bg-[#F7F7F7] hover:text-[#E47911] disabled:cursor-not-allowed disabled:text-[#8A8A8A]"
                >
                    <CheckCheck className="h-4 w-4" />
                    Đánh dấu tất cả đã đọc
                </button>
            </div>

            <div>
                {loading ? (
                    <div className="flex min-h-[260px] items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#FF9900]" />
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-[#E6E6E6]">
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.notificationId}
                                notification={notification}
                                onClick={handleItemClick}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
                        <Bell className="mb-3 h-12 w-12 text-[#A0A0A0]" />
                        <h3 className="text-[16px] font-bold text-[#222222]">Chưa có thông báo nào</h3>
                        <p className="mt-1 text-[14px] text-[#565959]">
                            Các cập nhật về đơn hàng, hoàn trả và tranh chấp sẽ xuất hiện tại đây.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
