export type CartItem = {
    id: string;
    productId: string;
    variantId?: string;
    slug: string;
    title: string;
    rentDates: string;
    pricePerDay: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
    selected: boolean;
};
