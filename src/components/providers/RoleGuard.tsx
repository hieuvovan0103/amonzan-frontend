"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

type RoleGuardProps = {
  children: React.ReactNode;
  allowedRoles: string[];
};

function getCurrentRoles(profile: any) {
  return (
    profile?.user_roles
      ?.map((userRole: any) => {
        if (Array.isArray(userRole.roles)) {
          return userRole.roles[0]?.role_name;
        }

        return userRole.roles?.role_name;
      })
      .filter(Boolean) || []
  );
}

function hasApprovedVendorProfile(profile: any) {
  const shopProfiles = Array.isArray(profile?.shop_profiles)
    ? profile.shop_profiles
    : profile?.shop_profiles
      ? [profile.shop_profiles]
      : [];

  return shopProfiles.some(
    (shopProfile: any) => shopProfile?.verification_status === "VERIFIED"
  );
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { isInitialized, profile, session } = useAuthStore();
  const router = useRouter();

  const isVendorOnlyRoute =
    allowedRoles.length > 0 &&
    allowedRoles.every((role) => role === "VENDOR" || role === "SHOP_OWNER");

  const currentRoles = getCurrentRoles(profile);
  const matchesRole = allowedRoles.some((role) => currentRoles.includes(role));
  const accessAllowed =
    matchesRole && (!isVendorOnlyRoute || hasApprovedVendorProfile(profile));

  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    if (!session) {
      router.push("/");
      return;
    }

    if (profile && !accessAllowed) {
      router.push("/");
    }
  }, [accessAllowed, isInitialized, profile, router, session]);

  if (!isInitialized || !session || !profile) {
    return null;
  }

  if (!accessAllowed) {
    return null;
  }

  return <>{children}</>;
}
