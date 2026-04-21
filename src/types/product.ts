export type ProductListItem = {
    id: number;
    title: string;
    shopName: string;
    rating: number;
    reviews: number;
    price: string;
    image: string;
    category?: string;
    location?: string;
};