import VendorDashboardPage from "@/components/dashboard/vendor/VendorDashboardPage";
import RoleGuard from "@/components/providers/RoleGuard";

export default function Page() {
    return (
        <RoleGuard allowedRoles={["SHOP_OWNER", "VENDOR"]}>
            <VendorDashboardPage />
        </RoleGuard>
    );
}
