import { fetchWithAuth } from "@/lib/apiClient";
import type { AppNotification, NotificationPagination } from "@/types/notification";

async function readError(response: Response, fallback: string) {
    const error = await response.json().catch(() => null);
    return error?.message || fallback;
}

export async function getNotifications(params: { page?: number; limit?: number; type?: string } = {}) {
    const search = new URLSearchParams();
    if (params.page) search.set("page", String(params.page));
    if (params.limit) search.set("limit", String(params.limit));
    if (params.type && params.type !== "ALL") search.set("type", params.type);

    const response = await fetchWithAuth(`/notifications${search.toString() ? `?${search}` : ""}`);
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tải thông báo."));
    }

    return response.json() as Promise<{
        notifications: AppNotification[];
        unreadCount: number;
        pagination: NotificationPagination;
    }>;
}

export async function getUnreadNotificationCount() {
    const response = await fetchWithAuth("/notifications/unread-count");
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể tải số thông báo chưa đọc."));
    }

    return response.json() as Promise<{ unreadCount: number }>;
}

export async function markNotificationAsRead(notificationId: string) {
    const response = await fetchWithAuth(`/notifications/${notificationId}/read`, {
        method: "PATCH",
    });
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể đánh dấu thông báo đã đọc."));
    }

    return response.json() as Promise<{ notification: AppNotification }>;
}

export async function markAllNotificationsAsRead() {
    const response = await fetchWithAuth("/notifications/read-all", {
        method: "PATCH",
    });
    if (!response.ok) {
        throw new Error(await readError(response, "Không thể đánh dấu tất cả thông báo đã đọc."));
    }

    return response.json() as Promise<{ message: string }>;
}
