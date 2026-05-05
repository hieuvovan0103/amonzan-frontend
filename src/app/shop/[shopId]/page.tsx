import { notFound } from "next/navigation";
import { getPublicShopProfile } from "@/lib/api/shops";
import ShopProfilePage from "./components/ShopProfilePage";

export const metadata = {
    title: "Thông tin cửa hàng | Amonzan",
    description:
        "Xem thông tin cửa hàng, sản phẩm cho thuê, chính sách và đánh giá trên Amonzan.",
};

type ShopPageProps = {
    params: Promise<{
        shopId: string;
    }>;
};

export default async function ShopPage({ params }: ShopPageProps) {
    const { shopId } = await params;
    const shop = await getPublicShopProfile(shopId);

    if (!shop) {
        notFound();
    }

    return <ShopProfilePage shop={shop} />;
}
