"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck } from "lucide-react";
import { ProfileTab } from "@/types/user-profile";
import { useAuthStore } from "@/stores/useAuthStore";
import AddressBookView from "./components/AddressBookView";
import FavoritesView from "./components/FavoritesView";
import MyOrdersView from "./components/MyOrdersView";
import NotificationsView from "./components/NotificationsView";
import PaymentMethodsView from "./components/PaymentMethodsView";
import ProfileInfoView from "./components/ProfileInfoView";
import ProfileSidebar from "./components/ProfileSidebar";

const VALID_TABS: ProfileTab[] = [
    "profile",
    "my_orders",
    "favorites",
    "notifications",
    "addresses",
    "payments",
];

function isProfileTab(value: string | null): value is ProfileTab {
    return VALID_TABS.includes(value as ProfileTab);
}

function getInitials(name: string) {
    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

export default function ProfilePage() {
    const router = useRouter();
    const profile = useAuthStore((state) => state.profile);
    const user = useAuthStore((state) => state.user);
    const [activeTab, setActiveTab] = useState<ProfileTab>("profile");

    useEffect(() => {
        const syncTabFromUrl = () => {
            const tabParam = new URLSearchParams(window.location.search).get("tab");
            setActiveTab(isProfileTab(tabParam) ? tabParam : "profile");
        };

        syncTabFromUrl();
        window.addEventListener("popstate", syncTabFromUrl);
        return () => window.removeEventListener("popstate", syncTabFromUrl);
    }, []);

    const displayName = profile?.full_name || profile?.email || user?.email || "Người dùng Amonzan";
    const email = profile?.email || user?.email || "Chưa có email";
    const avatarUrl = profile?.avatar_url || null;

    const profileStats = useMemo(
        () => [
            { label: "Hồ sơ", value: profile?.is_phone_verified ? "Đã xác thực" : "Cần cập nhật" },
            { label: "Đơn thuê", value: "Theo dõi tại đây" },
            { label: "Thông báo", value: "Luôn cập nhật" },
        ],
        [profile?.is_phone_verified],
    );

    const handleChangeTab = (tab: ProfileTab) => {
        setActiveTab(tab);
        const params = new URLSearchParams(window.location.search);
        params.set("tab", tab);
        router.push(`/profile?${params.toString()}`, { scroll: false });
    };

    const renderContent = () => {
        switch (activeTab) {
            case "notifications":
                return <NotificationsView />;
            case "my_orders":
                return <MyOrdersView />;
            case "favorites":
                return <FavoritesView />;
            case "payments":
                return <PaymentMethodsView />;
            case "addresses":
                return <AddressBookView />;
            case "profile":
            default:
                return <ProfileInfoView />;
        }
    };

    return (
        <main className="min-h-screen bg-[#F3F4F6]">
            <div className="mx-auto w-full max-w-[1280px] px-4 py-5 md:px-8 md:py-8">
                <section className="mb-5 overflow-hidden rounded-[8px] border border-[#D5D9D9] bg-white shadow-sm">
                    <div className="bg-[#232F3E] px-5 py-5 text-white md:px-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex min-w-0 items-center gap-4">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="Ảnh đại diện"
                                        className="h-16 w-16 rounded-full border-2 border-white/40 object-cover"
                                    />
                                ) : (
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF9900] text-[22px] font-bold text-[#111111]">
                                        {getInitials(displayName) || "A"}
                                    </div>
                                )}

                                <div className="min-w-0">
                                    <h1 className="truncate text-[22px] font-bold tracking-[-0.01em]">
                                        {displayName}
                                    </h1>
                                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-white/80">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Mail className="h-4 w-4" />
                                            {email}
                                        </span>
                                        {profile?.is_phone_verified ? (
                                            <span className="inline-flex items-center gap-1.5 text-[#7DDC8A]">
                                                <ShieldCheck className="h-4 w-4" />
                                                Số điện thoại đã xác thực
                                            </span>
                                        ) : null}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 md:min-w-[360px]">
                                {profileStats.map((item) => (
                                    <div key={item.label} className="rounded-[6px] bg-white/10 px-3 py-2">
                                        <div className="text-[11px] uppercase tracking-wide text-white/60">
                                            {item.label}
                                        </div>
                                        <div className="mt-1 text-[12px] font-bold text-white">
                                            {item.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
                    <ProfileSidebar activeTab={activeTab} onChangeTab={handleChangeTab} />
                    <div className="min-w-0">{renderContent()}</div>
                </div>
            </div>
        </main>
    );
}
