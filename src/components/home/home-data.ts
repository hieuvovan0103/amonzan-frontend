import {
  Search,
  Shirt,
  Sparkles,
  Gem,
  Briefcase,
  Zap,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

export const categories = [
  {
    id: 1,
    name: "Váy dạ hội",
    icon: Sparkles,
    count: "3.2k+",
  },
  {
    id: 2,
    name: "Vest & suit nam",
    icon: Briefcase,
    count: "1.5k+",
  },
  {
    id: 3,
    name: "Trang phục truyền thống",
    icon: Shirt,
    count: "2.8k+",
  },
  {
    id: 4,
    name: "Phụ kiện & trang sức",
    icon: Gem,
    count: "1.1k+",
  },
];

export const trendingItems = [
  {
    id: "1",
    title: "Váy dạ hội đuôi cá đính đá pha lê cao cấp",
    image:
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&q=80&w=500",
    price: 350000,
    unit: "ngày",
    rating: 4.9,
    reviews: 128,
    location: "Quận 1, TP.HCM",
    vendor: "Linh Boutique",
  },
  {
    id: "2",
    title: "Bộ suit nam navy sọc chìm thanh lịch",
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=500",
    price: 250000,
    unit: "ngày",
    rating: 4.8,
    reviews: 56,
    location: "Cầu Giấy, Hà Nội",
    vendor: "The Tuxedo Guy",
  },
  {
    id: "3",
    title: "Áo dài lụa tơ tằm thêu tay hoạ tiết hoa sen",
    image:
      "https://images.unsplash.com/photo-1617260843477-8bb3628e9389?auto=format&fit=crop&q=80&w=500",
    price: 150000,
    unit: "ngày",
    rating: 5.0,
    reviews: 84,
    location: "Quận 3, TP.HCM",
    vendor: "Hương Lụa Bridal",
  },
  {
    id: "4",
    title: "Vương miện đính đá Zirconia dùng cho tiệc cưới",
    image:
      "https://images.unsplash.com/photo-1535032506456-11f8e87498c1?auto=format&fit=crop&q=80&w=500",
    price: 80000,
    unit: "ngày",
    rating: 4.7,
    reviews: 42,
    location: "Bình Thạnh, TP.HCM",
    vendor: "Glow Accessories",
  },
];

export const steps = [
  {
    icon: Search,
    title: "Tìm kiếm",
    desc: "Chọn trang phục ưng ý từ hàng ngàn thiết kế.",
  },
  {
    icon: Zap,
    title: "Đặt thuê",
    desc: "Chọn ngày, size, thanh toán cọc và nhận xác nhận.",
  },
  {
    icon: ShoppingBag,
    title: "Toả sáng",
    desc: "Nhận trang phục đã được giặt ủi sạch sẽ và mặc đi sự kiện.",
  },
  {
    icon: RefreshCw,
    title: "Hoàn trả",
    desc: "Trả lại đồ sau sự kiện và nhận lại tiền cọc nhanh chóng.",
  },
];

export const suggestedKeywords = [
  "Váy dạ hội",
  "Vest nam",
  "Áo dài cưới",
  "Đầm dự tiệc",
];