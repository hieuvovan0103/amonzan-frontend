import { Category } from "@/types/category";

export const CATEGORIES: Category[] = [
  {
    id: 1,
    title: "COSPLAY",
    subtitle: "Nhân vật Anime, manga, game",
    type: "single-image",
    image:
      "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=800&auto=format&fit=crop",
    links: [],
  },
  {
    id: 2,
    title: "Trang phục truyền thống",
    subtitle: "",
    type: "split-image",
    images: [
      {
        url: "https://images.unsplash.com/photo-1552234994-66ba234fd567?q=80&w=400&auto=format&fit=crop",
        label: "Việt Nam",
      },
      {
        url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=400&auto=format&fit=crop",
        label: "Nhật Bản",
      },
    ],
    links: ["Triều Tiên", "Khác"],
  },
  {
    id: 3,
    title: "Trang phục đặc biệt",
    subtitle: "Để chụp ảnh, du lịch, chuyến đi theo chủ đề, v.v.",
    type: "single-image",
    image:
      "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop",
    links: [],
  },
  {
    id: 4,
    title: "Trang phục sự kiện",
    subtitle: "",
    type: "text-grid",
    links: ["Halloween", "Tiệc tùng", "Lễ hội", "Khác"],
  },
];