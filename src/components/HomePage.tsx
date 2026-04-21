import { Search, Menu } from "lucide-react";

// --- TYPES ---
type Category =
    | {
        id: number;
        title: string;
        subtitle: string;
        type: "single-image";
        image: string;
        links: string[];
    }
    | {
        id: number;
        title: string;
        subtitle: string;
        type: "split-image";
        images: { url: string; label: string }[];
        links: string[];
    }
    | {
        id: number;
        title: string;
        subtitle: string;
        type: "text-grid";
        links: string[];
    };

// --- CONFIG & MOCK DATA ---
const CATEGORIES: Category[] = [
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

function Navbar() {
    return (
        <header className="bg-[#232F3E] text-white py-3 px-4 md:px-8 sticky top-0 z-50">
            <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4 md:gap-8">
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Menu className="w-6 h-6 md:hidden cursor-pointer" />
                    <a href="/" className="text-2xl font-bold tracking-tighter">
                        AMONZAN
                    </a>
                </div>

                <div className="hidden md:flex flex-1 max-w-3xl">
                    <div className="flex w-full bg-white rounded-[10px] overflow-hidden border focus-within:ring-2 focus-within:ring-[#FF9900]/50 transition-all">
                        <input
                            type="text"
                            placeholder="Tìm kiếm trang phục, đạo cụ, đồ cho thuê..."
                            className="flex-1 px-4 py-2 text-[#222222] outline-none text-[14px]"
                        />
                        <button className="bg-[#FF9900] hover:bg-[#E47911] transition-colors px-6 flex items-center justify-center cursor-pointer">
                            <Search className="w-5 h-5 text-[#111111]" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0 text-[14px] font-semibold">
                    <button className="bg-[#FFD814] hover:bg-[#F0C14B] text-[#111111] px-5 py-2 rounded-[10px] transition-colors border border-[#F0C14B]">
                        Đăng nhập
                    </button>
                    <a
                        href="/signup"
                        className="hidden md:block text-[#FF9900] hover:text-[#E47911] hover:underline transition-colors"
                    >
                        Đăng ký
                    </a>
                </div>
            </div>

            <div className="md:hidden mt-3">
                <div className="flex w-full bg-white rounded-[8px] overflow-hidden">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        className="flex-1 px-3 py-2 text-[#222222] outline-none text-[14px]"
                    />
                    <button className="bg-[#FF9900] px-4 flex items-center justify-center">
                        <Search className="w-4 h-4 text-[#111111]" />
                    </button>
                </div>
            </div>
        </header>
    );
}

function HeroSection() {
    return (
        <section className="bg-gradient-to-b from-[#FFD814]/30 to-[#FFFFFF] pt-16 pb-12 px-4 text-center">
            <div className="max-w-[1280px] mx-auto">
                <h1 className="text-[32px] md:text-[40px] font-bold text-[#222222] leading-[1.2] tracking-[-0.03em] mb-4">
                    Thuê trang phục. Trở thành tâm điểm.
                </h1>
                <p className="text-[16px] md:text-[20px] text-[#565959] font-medium max-w-2xl mx-auto">
                    Khám phá trang phục, cosplay và đạo cụ từ các cửa hàng cho thuê uy tín.
                </p>
            </div>
        </section>
    );
}

function CategoryCard({ data }: { data: Category }) {
    return (
        <div className="bg-white rounded-[18px] border border-[#E6E6E6] p-5 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)] hover:shadow-[0_6px_20px_rgba(15,17,17,0.10)] transition-shadow duration-300 flex flex-col h-full cursor-pointer group">
            <div className="mb-4">
                <h3 className="text-[20px] font-semibold text-[#222222] leading-[1.3] tracking-[-0.01em]">
                    {data.title}
                </h3>
                {data.subtitle && (
                    <p className="text-[13px] text-[#6B7280] mt-1 leading-[1.4]">
                        {data.subtitle}
                    </p>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
                {data.type === "single-image" && (
                    <div className="w-full aspect-[4/5] rounded-[10px] overflow-hidden bg-[#F7F7F7] mt-auto">
                        <img
                            src={data.image}
                            alt={data.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                {data.type === "split-image" && (
                    <div className="flex flex-col gap-6 mt-auto">
                        <div className="grid grid-cols-2 gap-3">
                            {data.images.map((img, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                    <div className="w-full aspect-square rounded-[8px] overflow-hidden bg-[#F7F7F7]">
                                        <img
                                            src={img.url}
                                            alt={img.label}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="text-[13px] font-medium text-[#222222]">
                                        {img.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            {data.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href="#"
                                    className="text-[13px] font-medium text-[#007185] hover:text-[#E47911] hover:underline text-center"
                                >
                                    {link}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {data.type === "text-grid" && (
                    <div className="grid grid-cols-2 gap-y-12 gap-x-4 my-auto pt-8">
                        {data.links.map((link, idx) => (
                            <a
                                key={idx}
                                href="#"
                                className="text-[14px] font-medium text-[#222222] hover:text-[#E47911] hover:underline flex items-center justify-center p-4 bg-[#F7F7F7] rounded-[10px] transition-colors"
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Footer() {
    return (
        <footer className="bg-[#0F1111] text-[#FFFFFF] py-8 text-center text-[12px] md:text-[13px] mt-16">
            <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center gap-2">
                <div className="flex gap-4 md:gap-6 justify-center mb-2">
                    <a href="#" className="hover:underline">
                        Điều kiện sử dụng
                    </a>
                    <a href="#" className="hover:underline">
                        Chính sách bảo mật
                    </a>
                    <a href="#" className="hover:underline">
                        Trợ giúp
                    </a>
                </div>
                <p className="text-[#6B7280]">
                    © 1996-2026, Amonzan.com, Inc. hoặc các chi nhánh
                </p>
            </div>
        </footer>
    );
}

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#FFFFFF] font-sans text-[#222222] flex flex-col">
            <Navbar />

            <main className="flex-1">
                <HeroSection />

                <section className="max-w-[1280px] mx-auto px-4 md:px-8 -mt-6 relative z-10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CATEGORIES.map((category) => (
                            <CategoryCard key={category.id} data={category} />
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}