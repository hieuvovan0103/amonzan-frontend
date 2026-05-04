"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabase";
import { BASE_URL } from "@/lib/apiClient";
import type { Session } from "@supabase/supabase-js";

// Retry fetch với exponential backoff — xử lý khi backend vừa khởi động hoặc network chập chờn
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3,
  delayMs = 800,
): Promise<Response | null> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout mỗi lần
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeout);
      return res;
    } catch (e: any) {
      const isLast = attempt === maxRetries - 1;
      if (isLast) {
        console.warn(`[AuthProvider] Gọi ${url} thất bại sau ${maxRetries} lần thử:`, e?.message);
        return null;
      }
      // Chờ 800ms, 1600ms, 2400ms... trước mỗi lần retry
      await new Promise((r) => setTimeout(r, delayMs * (attempt + 1)));
    }
  }
  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const fetchProfile = async (session: Session) => {
      const res = await fetchWithRetry(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res?.ok) {
        const data = await res.json();
        useAuthStore.getState().setProfile(data.profile);
      }
    };

    // Lắng nghe các event đăng nhập, đăng xuất, token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('✅ [AuthProvider] Sự kiện cập nhật trạng thái:', event);
      if (session) {
        console.log('✅ [AuthProvider] Đã lấy được Session hợp lệ cho:', session.user.email);

        if (event === 'SIGNED_IN') {
          // Đảm bảo user tạo qua Google cũng được lưu vào Backend PostgreSQL
          // Đọc số điện thoại được lưu tạm trong sessionStorage (từ luồng OTP login)
          const pendingPhone = sessionStorage.getItem('pending_phone') || undefined;
          if (pendingPhone) sessionStorage.removeItem('pending_phone');

          fetchWithRetry(`${BASE_URL}/auth/bootstrap-profile`, {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              fullName: session.user.user_metadata?.full_name || session.user.email,
              phoneNumber: pendingPhone,
            }),
          }).then(() => fetchProfile(session));
        } else {
          fetchProfile(session);
        }
      } else {
        console.log('⚠️ [AuthProvider] Nhận Session Rỗng (Đăng xuất hoặc lỗi).');
        useAuthStore.getState().setProfile(null);
      }
      setAuth(session, session?.user || null);
    });

    // Load session lần đầu khi app mount
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error('❌ [AuthProvider] Lỗi tải session cục bộ:', error);
      else {
        console.log(
          '✅ [AuthProvider] Load lần đầu:',
          session ? `Thành công (${session.user.email})` : 'Không có session.',
        );
        if (session) fetchProfile(session);
      }
      setAuth(session, session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuth]);

  return <>{children}</>;
}
