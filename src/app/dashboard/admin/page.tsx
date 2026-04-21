import AdminDashboardPage from "@/components/dashboard/admin/AdminDashboardPage";
import RoleGuard from "@/components/providers/RoleGuard";

export default function Page() {
    return (
        <RoleGuard allowedRoles={["ADMIN"]}>
            <AdminDashboardPage />
        </RoleGuard>
    );
}