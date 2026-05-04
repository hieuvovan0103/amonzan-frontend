"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

const NEW_ACCOUNT_WINDOW_MS = 24 * 60 * 60 * 1000;

export default function PhoneVerificationGate() {
  const pathname = usePathname();
  const router = useRouter();
  const { isInitialized, user, profile } = useAuthStore();
  const [isDismissed, setIsDismissed] = useState(false);

  const userRoles =
    profile?.user_roles
      ?.map((userRole: any) => {
        if (Array.isArray(userRole.roles)) {
          return userRole.roles[0]?.role_name;
        }

        return userRole.roles?.role_name;
      })
      .filter(Boolean) || [];

  const isAdmin = userRoles.includes("ADMIN");
  const hasPhoneNumber = Boolean(profile?.phone_number);

  const needsPhoneVerification =
    isInitialized &&
    !!user &&
    !!profile &&
    hasPhoneNumber &&
    !isAdmin &&
    profile.is_phone_verified === false;

  const isNewAccount = useMemo(() => {
    if (!profile?.created_at) return false;

    const createdAt = new Date(profile.created_at).getTime();
    if (Number.isNaN(createdAt)) return false;

    return Date.now() - createdAt <= NEW_ACCOUNT_WINDOW_MS;
  }, [profile?.created_at]);

  const shouldForceSignup =
    Boolean(pathname) &&
    pathname !== "/signup" &&
    needsPhoneVerification &&
    isNewAccount;

  const shouldShowReminder =
    Boolean(pathname) &&
    pathname !== "/signup" &&
    needsPhoneVerification &&
    !isNewAccount &&
    !isDismissed;

  useEffect(() => {
    if (!user?.id) {
      setIsDismissed(false);
      return;
    }

    const dismissedKey = `phone-verification-reminder:${user.id}`;
    setIsDismissed(sessionStorage.getItem(dismissedKey) === "dismissed");
  }, [user?.id]);

  useEffect(() => {
    if (shouldForceSignup) {
      router.replace("/signup");
    }
  }, [router, shouldForceSignup]);

  const handleDismiss = () => {
    if (user?.id) {
      sessionStorage.setItem(`phone-verification-reminder:${user.id}`, "dismissed");
    }
    setIsDismissed(true);
  };

  if (!shouldShowReminder) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/45 px-4">
      <div className="relative w-full max-w-[460px] rounded-[24px] border border-amber-200 bg-white p-6 shadow-[0_30px_80px_rgba(15,17,17,0.28)]">
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-full p-1 text-[#8A8F98] transition-colors hover:bg-[#F5F5F5] hover:text-[#222222]"
          aria-label="Đóng thông báo"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[#222222]">
              Tài khoản chưa xác minh số điện thoại
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-[#5D6066]">
              Vui lòng vào trang đăng ký để bổ sung thông tin và xác minh SĐT bằng SMS OTP.
            </p>
          </div>
        </div>

        {/* <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-[13px] leading-relaxed text-amber-900">
          Hệ thống sẽ tự động điền trước các trường đã có sẵn trong profile để user không phải nhập lại.
        </div> */}

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-[12px] border border-[#D5D9D9] px-4 py-2 text-[13px] font-medium text-[#222222] transition-colors hover:bg-[#F7F7F7]"
          >
            Để sau
          </button>
          <Link
            href="/signup"
            className="rounded-[12px] bg-[#007185] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#005a6a]"
          >
            Đi đến trang đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
