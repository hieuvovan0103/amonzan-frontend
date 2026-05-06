import { create } from "zustand";
import {
    getNotifications,
    getUnreadNotificationCount,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/lib/api/notifications";
import type { AppNotification } from "@/types/notification";

type NotificationState = {
    isOpen: boolean;
    notifications: AppNotification[];
    unreadCount: number;
    loading: boolean;
    error: string;
    openDropdown: () => Promise<void>;
    closeDropdown: () => void;
    fetchNotifications: () => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    markAsRead: (notificationId: string) => Promise<AppNotification | null>;
    markAllAsRead: () => Promise<void>;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
    isOpen: false,
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: "",

    openDropdown: async () => {
        set({ isOpen: true });
        await get().fetchNotifications();
    },

    closeDropdown: () => set({ isOpen: false }),

    fetchNotifications: async () => {
        set({ loading: true, error: "" });
        try {
            const data = await getNotifications({ limit: 20 });
            set({
                notifications: data.notifications,
                unreadCount: data.unreadCount,
            });
        } catch (err: any) {
            set({ error: err.message || "Không thể tải thông báo." });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const data = await getUnreadNotificationCount();
            set({ unreadCount: data.unreadCount });
        } catch {
            set({ unreadCount: 0 });
        }
    },

    markAsRead: async (notificationId: string) => {
        const current = get().notifications.find((item) => item.notificationId === notificationId);
        if (!current) return null;

        if (!current.isRead) {
            const result = await markNotificationAsRead(notificationId);
            set((state) => ({
                notifications: state.notifications.map((item) =>
                    item.notificationId === notificationId ? result.notification : item,
                ),
                unreadCount: Math.max(0, state.unreadCount - 1),
            }));
            return result.notification;
        }

        return current;
    },

    markAllAsRead: async () => {
        await markAllNotificationsAsRead();
        set((state) => ({
            notifications: state.notifications.map((item) => ({ ...item, isRead: true })),
            unreadCount: 0,
        }));
    },
}));
