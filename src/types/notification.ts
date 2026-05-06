export type AppNotification = {
    notificationId: string;
    notification_id?: string;
    userId: string;
    user_id?: string;
    type: string;
    title: string;
    content: string | null;
    isRead: boolean;
    is_read?: boolean;
    actionUrl: string | null;
    action_url?: string | null;
    relatedType: string | null;
    related_type?: string | null;
    relatedId: string | null;
    related_id?: string | null;
    orderId?: string | null;
    order_id?: string | null;
    metadata?: {
        orderId?: string | null;
        order_id?: string | null;
        [key: string]: unknown;
    } | null;
    createdAt: string;
    created_at?: string;
};

export type NotificationPagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};
