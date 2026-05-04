import type { CartItem } from '@/types/cart';

export const INITIAL_CART: CartItem[] = [
    {
        id: 'mock-product-1::One Size Short::Trắng::4 tháng 4 - 10 tháng 4 (6 ngày)',
        productId: 'mock-product-1',
        slug: 'mock-product-1',
        title: 'Chân váy Petticoat voan công chúa múa Ballet lưng thun co giãn màu trắng',
        rentDates: '4 tháng 4 - 10 tháng 4 (6 ngày)',
        pricePerDay: '12.000',
        size: 'One Size Short',
        color: 'Trắng',
        quantity: 1,
        price: 120000,
        image:
            'https://images.unsplash.com/photo-1544261427-4a0b2d6a782b?q=80&w=300&auto=format&fit=crop',
        selected: false,
    },
    {
        id: 'mock-product-2::One Size Short::Trắng::4 tháng 4 - 10 tháng 4 (6 ngày)',
        productId: 'mock-product-2',
        slug: 'mock-product-2',
        title: 'Chân váy Petticoat voan công chúa múa Ballet lưng thun co giãn màu trắng',
        rentDates: '4 tháng 4 - 10 tháng 4 (6 ngày)',
        pricePerDay: '12.000',
        size: 'One Size Short',
        color: 'Trắng',
        quantity: 1,
        price: 120000,
        image:
            'https://images.unsplash.com/photo-1544261427-4a0b2d6a782b?q=80&w=300&auto=format&fit=crop',
        selected: true,
    },
];
