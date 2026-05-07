"use client";

import { useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import NotificationBadge from "@/components/notifications/NotificationBadge";
import NotificationDropdown from "@/components/notifications/NotificationDropdown";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { AppNotification } from "@/types/notification";

type NotificationBellProps = {
    buttonClassName?: string;
    iconClassName?: string;
};

function normalizeInternalHref(href: string) {
    return href.startsWith("/") ? href : `/${href}`;
}

function getNotificationHref(notification: AppNotification) {
    const actionUrl = notification.actionUrl ?? notification.action_url;
    if (actionUrl) return normalizeInternalHref(actionUrl);

    const relatedType = notification.relatedType ?? notification.related_type;
    const relatedId = notification.relatedId ?? notification.related_id;
    if (relatedType === "DISPUTE") {
        return relatedId
            ? `/dashboard/admin?tab=disputes&disputeId=${relatedId}`
            : "/dashboard/admin?tab=disputes";
    }
    if (relatedType === "REVIEW_REPORT") {
        return relatedId
            ? `/dashboard/admin?tab=reviews&reviewId=${relatedId}`
            : "/dashboard/admin?tab=reviews";
    }

    if (relatedType === "ORDER" && relatedId) {
        return `/profile?tab=my_orders&orderId=${relatedId}`;
    }

    const orderId =
        notification.orderId ??
        notification.order_id ??
        notification.metadata?.orderId ??
        notification.metadata?.order_id;
    if (orderId) {
        return `/profile?tab=my_orders&orderId=${orderId}`;
    }

    return null;
}

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export default function NotificationBell({
    buttonClassName = "p-2.5 hover:bg-white/10 rounded-full",
    iconClassName = "h-5 w-5",
}: NotificationBellProps) {
    const router = useRouter();
    const userId = useAuthStore((state) => state.user?.id ?? null);
    const showToast = useToastStore((state) => state.show);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const {
        isOpen,
        notifications,
        unreadCount,
        loading,
        openDropdown,
        closeDropdown,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        reset,
    } = useNotificationStore();

    useEffect(() => {
        reset();
        if (!userId) return;

        fetchUnreadCount();
    }, [fetchUnreadCount, reset, userId]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeDropdown]);

    const toggleOpen = async () => {
        if (isOpen) {
            closeDropdown();
            return;
        }

        try {
            await openDropdown();
        } catch (err: unknown) {
            showToast(getErrorMessage(err, "Không thể tải thông báo."), "error");
        }
    };

    const handleItemClick = async (notification: AppNotification) => {
        try {
            await markAsRead(notification.notificationId);
            closeDropdown();
            const href = getNotificationHref(notification);
            if (href) {
                router.push(href);
            }
        } catch (err: unknown) {
            showToast(getErrorMessage(err, "Không thể đánh dấu thông báo đã đọc."), "error");
        }
    };

    const handleReadAll = async () => {
        try {
            await markAllAsRead();
        } catch (err: unknown) {
            showToast(getErrorMessage(err, "Không thể đánh dấu tất cả thông báo đã đọc."), "error");
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <button type="button" onClick={toggleOpen} className={`relative transition-colors ${buttonClassName}`}>
                <Bell className={iconClassName} />
                <NotificationBadge count={unreadCount} />
            </button>

            {isOpen ? (
                <NotificationDropdown
                    notifications={notifications}
                    isLoading={loading}
                    onItemClick={handleItemClick}
                    onReadAll={handleReadAll}
                    onClose={closeDropdown}
                />
            ) : null}
        </div>
    );
}
