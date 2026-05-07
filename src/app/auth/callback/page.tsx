"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Supabase client is configured with detectSessionInUrl: true.
    // AuthProvider will pick up the session via onAuthStateChange.
    const timer = window.setTimeout(() => {
      router.replace("/products");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <div className="text-[16px] font-bold text-[#222222]">Đang hoàn tất đăng nhập...</div>
        <div className="mt-2 text-[13px] text-[#565959]">Vui lòng chờ trong giây lát.</div>
      </div>
    </main>
  );
}

