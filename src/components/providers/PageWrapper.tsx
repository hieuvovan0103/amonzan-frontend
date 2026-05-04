"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginModal from "@/components/login/LoginModal";
import PhoneVerificationGate from "@/components/providers/PhoneVerificationGate";
import ToastContainer from "@/components/ui/ToastContainer";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith("/dashboard");
    const isVendor = pathname?.startsWith("/vendor");
    const hideGlobalNavAndFooter = isDashboard || isVendor;

    return (
        <>
            {!hideGlobalNavAndFooter && <Navbar />}
            <main className="flex-1 min-h-screen bg-[#F7F7F7] md:bg-white">{children}</main>
            {!hideGlobalNavAndFooter && <Footer />}
            <PhoneVerificationGate />
            <LoginModal />
            <ToastContainer />
        </>
    );
}
