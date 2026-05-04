export type ProfileTab =
    | 'profile'
    | 'notifications'
    | 'my_orders'
    | 'payments'
    | 'addresses';

export type NotificationType = 'ORDER' | 'SYSTEM' | 'WARNING' | 'MESSAGE';

export type UserNotification = {
    id: number;
    type: NotificationType;
    title: string;
    content: string;
    time: string;
    isRead: boolean;
};

export type RentalOrderStatus = 'ACTIVE_RENTAL' | 'COMPLETED' | 'PENDING';

export type RentalOrder = {
    id: string;
    shop: string;
    datePlaced: string;
    total: string;
    item: {
        title: string;
        size: string;
        image: string;
    };
    status: RentalOrderStatus;
    statusText: string;
    deliveryInfo: string;
    rentDates: string;
};

export type BankAccount = {
    id: number;
    name: string;
    fullName: string;
    branch: string;
    number: string;
    isVerified: boolean;
    isDefault: boolean;
};

export type UserAddress = {
    id: number;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    isDefault: boolean;
};