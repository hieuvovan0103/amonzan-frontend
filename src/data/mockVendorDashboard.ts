import { VendorProduct } from "@/types/vendor";

export const MOCK_VENDOR_PRODUCTS: VendorProduct[] = [
    {
        id: "VP-1",
        title: "Armin Attack on Titan Cosplay",
        image:
            "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=400&auto=format&fit=crop",
        rating: 5.0,
        reviews: 68,
        price: "120.000",
        shop: "Shikaru Store",
        status: "ENABLE",
        stock: 5,
    },
    {
        id: "VP-2",
        title: "Trang phục Maid phong cách Pháp",
        image:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
        rating: 4.8,
        reviews: 12,
        price: "80.000",
        shop: "Shikaru Store",
        status: "IN_USE",
        stock: 0,
    },
    {
        id: "VP-3",
        title: "Áo Kimono truyền thống Nhật Bản",
        image:
            "https://images.unsplash.com/photo-1552234994-66ba234fd567?q=80&w=400&auto=format&fit=crop",
        rating: 4.5,
        reviews: 4,
        price: "200.000",
        shop: "Shikaru Store",
        status: "DISABLE",
        stock: 2,
    },
    {
        id: "VP-4",
        title: "Máy ảnh Sony A7III Body",
        image:
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=400&auto=format&fit=crop",
        rating: 4.9,
        reviews: 150,
        price: "500.000",
        shop: "Shikaru Store",
        status: "ENABLE",
        stock: 1,
    },
];