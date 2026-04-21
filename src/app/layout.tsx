import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import PageWrapper from "@/components/providers/PageWrapper";
import AuthProvider from "@/components/providers/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Amonzan - Marketplace cho thuê đồ tiện lợi",
  description:
    "Amonzan là nền tảng marketplace giúp bạn dễ dàng thuê và cho thuê các sản phẩm như trang phục, thiết bị, phụ kiện với chi phí hợp lý.",
  keywords: [
    "thuê đồ",
    "marketplace",
    "thuê trang phục",
    "cho thuê đồ",
    "rent marketplace",
    "Amonzan",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#222222]">
        <AuthProvider>
          <PageWrapper>
            {children}
          </PageWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}