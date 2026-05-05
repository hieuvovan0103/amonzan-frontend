export type ProductListItem = {
    id: string;
    shopId?: string;
    slug: string;
    title: string;
    shopName: string;
    rating: number;
    reviews: number;
    price: string;
    image: string;
    availableStock?: number;
    category?: string;
    location?: string;
};
