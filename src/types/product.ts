export type ProductListItem = {
    id: string;
    slug: string;
    title: string;
    shopName: string;
    rating: number;
    reviews: number;
    price: string;
    image: string;
    category?: string;
    location?: string;
};
