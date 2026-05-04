import {
    BankAccount,
    RentalOrder,
    UserAddress,
    UserNotification,
} from '@/types/user-profile';

export const MOCK_NOTIFICATIONS: UserNotification[] = [
    {
        id: 1,
        type: 'ORDER',
        title: 'Đơn thuê #ORD-7829 đã được xác nhận!',
        content:
            'Shop Cosplay Hub HCM đã xác nhận đơn thuê của bạn. Thời gian bắt đầu từ 20/04/2026.',
        time: '10 phút trước',
        isRead: false,
    },
    {
        id: 2,
        type: 'SYSTEM',
        title: 'Hoàn cọc thành công',
        content:
            'Số tiền 500.000đ từ đơn #ORD-7712 đã được hoàn vào Ví Amonzan của bạn.',
        time: '2 giờ trước',
        isRead: false,
    },
    {
        id: 3,
        type: 'WARNING',
        title: 'Sắp đến hạn trả đồ',
        content:
            'Đơn thuê "Máy ảnh Sony A7III" sẽ hết hạn vào ngày mai. Vui lòng chuẩn bị trả đồ cho shop Camera Rent Pro.',
        time: '1 ngày trước',
        isRead: true,
    },
    {
        id: 4,
        type: 'MESSAGE',
        title: 'Tin nhắn mới từ Shikaru Store',
        content:
            'Chào bạn, đồ của bạn đã được giặt sấy sạch sẽ và đóng gói cẩn thận rồi nhé...',
        time: '3 ngày trước',
        isRead: true,
    },
];

export const MOCK_MY_ORDERS: RentalOrder[] = [
    {
        id: 'ORD-7829',
        shop: 'Cosplay Hub HCM',
        datePlaced: '15 Thg 04 2026',
        total: '450.000',
        item: {
            title: 'Trang phục Cosplay Levi Ackerman - Kèm Tóc giả',
            size: 'M',
            image:
                'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=400&auto=format&fit=crop',
        },
        status: 'ACTIVE_RENTAL',
        statusText: 'Đang thuê',
        deliveryInfo: 'Đã nhận hàng ngày 20/04',
        rentDates: '20/04 - 23/04/2026',
    },
    {
        id: 'ORD-7830',
        shop: 'Camera Rent Pro',
        datePlaced: '10 Thg 04 2026',
        total: '1.200.000',
        item: {
            title: 'Máy ảnh Sony A7III + Lens 24-70mm GM',
            size: 'Combo',
            image:
                'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop',
        },
        status: 'COMPLETED',
        statusText: 'Đã hoàn thành',
        deliveryInfo: 'Đã trả đồ và nhận lại cọc ngày 15/04',
        rentDates: '12/04 - 14/04/2026',
    },
    {
        id: 'ORD-7831',
        shop: 'Camping Gear SG',
        datePlaced: '18 Thg 04 2026',
        total: '200.000',
        item: {
            title: 'Lều cắm trại 4 người Naturehike tự bung',
            size: '4 Người',
            image:
                'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=400&auto=format&fit=crop',
        },
        status: 'PENDING',
        statusText: 'Chờ shop xác nhận',
        deliveryInfo: 'Chờ người bán chuẩn bị hàng',
        rentDates: '25/04 - 26/04/2026',
    },
];

export const MOCK_BANKS: BankAccount[] = [
    {
        id: 1,
        name: 'VCB - NH TMCP Ngoại Thương Việt Nam',
        fullName: 'NGUYEN VAN A',
        branch: 'CN Cần Thơ (Vietcombank)',
        number: '**101',
        isVerified: true,
        isDefault: true,
    },
    {
        id: 2,
        name: 'TCB - NH TMCP Kỹ Thương Việt Nam',
        fullName: 'NGUYEN VAN A',
        branch: 'CN Hồ Chí Minh (Techcombank)',
        number: '**202',
        isVerified: true,
        isDefault: false,
    },
];

export const MOCK_ADDRESSES: UserAddress[] = [
    {
        id: 1,
        name: 'Nguyễn Văn A',
        phone: '(+84) 0123456789',
        addressLine1: '436a/81, Đường 3/2',
        addressLine2: 'Phường 12, Quận 10, TP. Hồ Chí Minh',
        isDefault: true,
    },
    {
        id: 2,
        name: 'Nguyễn Văn A',
        phone: '(+84) 0987654321',
        addressLine1: 'Tòa nhà Landmark 81',
        addressLine2: 'Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh',
        isDefault: false,
    },
];