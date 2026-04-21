import { ProductListItem } from "@/types/product";

export const MOCK_PRODUCTS: ProductListItem[] = Array(8)
    .fill({
        id: 1,
        title: "Trang phục Armin Attack on Titan",
        shopName: "Isayama Hajime",
        rating: 5.0,
        reviews: 124,
        price: "5.000.000",
        image:
            "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=600&auto=format&fit=crop",
        category: "Cosplay",
        location: "Hồ Chí Minh",
    })
    .map((item, index) => ({
        ...item,
        id: index + 1,
        title:
            index % 2 === 0
                ? "Trang phục Armin Attack on Titan"
                : "Máy ảnh Sony A7III cho thuê theo ngày",
        shopName: index % 2 === 0 ? "Isayama Hajime" : "Camera Rent Pro",
        price: index % 2 === 0 ? "5.000.000" : "800.000",
        category: index % 2 === 0 ? "Cosplay" : "Thiết bị điện tử",
        location: index % 2 === 0 ? "Hồ Chí Minh" : "Cần Thơ",
    }));