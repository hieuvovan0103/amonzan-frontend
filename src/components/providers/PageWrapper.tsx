"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/login/LoginModal";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");

    return (
        <>
            {!isDashboard && <Navbar />}
            <main className="flex-1 min-h-screen bg-[#F7F7F7] md:bg-white">{children}</main>
            {!isDashboard && <Footer />}
            <LoginModal />
        </>
    );
}