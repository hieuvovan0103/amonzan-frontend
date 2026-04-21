"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { isInitialized, profile, session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isInitialized) {
      if (!session) {
        // Chưa đăng nhập, đá về trang chủ
        router.push("/");
        return;
      }

      if (profile && profile.user_roles) {
        console.log("🛡️ [RoleGuard] Profile data:", profile);
        // Kiểm tra xem user có chứa role nằm trong allowedRoles không
        // Chú ý: phòng trường hợp .roles trả về mảng (mặc dù cấu trúc là 1 object)
        const currentRoles = profile.user_roles.map((ur: any) => {
           if (Array.isArray(ur.roles)) return ur.roles[0]?.role_name;
           return ur.roles?.role_name;
        }).filter(Boolean);
        
        console.log("🛡️ [RoleGuard] currentRoles extracted:", currentRoles);
        
        const hasAccess = allowedRoles.some(role => currentRoles.includes(role));
        
        if (!hasAccess) {
          // Có đăng nhập nhưng không có quyền, đá về trang chủ hoặc trang báo lỗi
          router.push("/");
        }
      }
    }
  }, [isInitialized, session, profile, allowedRoles, router]);

  // Trong lúc chưa init (đang check session) hoặc đang check profile, hiện loading rỗng hoặc skeleton
  if (!isInitialized || !session || !profile) return null;

  const currentRoles = profile.user_roles.map((ur: any) => {
     if (Array.isArray(ur.roles)) return ur.roles[0]?.role_name;
     return ur.roles?.role_name;
  }).filter(Boolean);
  const hasAccess = allowedRoles.some((role: string) => currentRoles.includes(role));

  if (!hasAccess) return null;

  return <>{children}</>;
}
