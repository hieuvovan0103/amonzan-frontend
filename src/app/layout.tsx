import type { Metadata } from "next";
import "./globals.css";

import PageWrapper from "@/components/providers/PageWrapper";
import AuthProvider from "@/components/providers/AuthProvider";

import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
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
      className={`${inter.variable} font-sans h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-[#222222]" suppressHydrationWarning>
        <AuthProvider>
          <PageWrapper>
            {children}
          </PageWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}