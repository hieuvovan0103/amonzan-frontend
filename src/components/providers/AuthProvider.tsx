"use client";

import { useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  isInvalidRefreshTokenError,
  resetBrokenSupabaseSession,
  supabase,
} from "@/lib/supabase";
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
  const syncRunIdRef = useRef(0);

  const fetchProfile = useCallback(async (session: Session) => {
    const res = await fetchWithRetry(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res?.ok) {
      const data = await res.json();
      useAuthStore.getState().setProfile(data.profile);
      return;
    }

    if (res?.status === 401) {
      useAuthStore.getState().setProfile(null);
      useAuthStore.getState().setAuth(null, null);
    }
  }, []);

  const syncAuthFromSupabase = useCallback(async () => {
    const runId = syncRunIdRef.current + 1;
    syncRunIdRef.current = runId;
    useAuthStore.getState().setSyncing(true);

    let session: Session | null = null;
    let error: unknown = null;

    try {
      const result = await supabase.auth.getSession();
      session = result.data.session;
      error = result.error;
    } catch (err) {
      error = err;
    }

    if (runId !== syncRunIdRef.current) {
      return;
    }

    if (error) {
      if (isInvalidRefreshTokenError(error)) {
        await resetBrokenSupabaseSession();
      } else {
        console.warn("❌ [AuthProvider] Lỗi đồng bộ session:", error);
      }
      useAuthStore.getState().setProfile(null);
      setAuth(null, null);
      return;
    }

    setAuth(session, session?.user || null);

    if (session) {
      await fetchProfile(session);
    } else {
      useAuthStore.getState().setProfile(null);
    }
  }, [fetchProfile, setAuth]);

  useEffect(() => {
    let isMounted = true;
    let subscription: { unsubscribe: () => void } | null = null;
    // Lắng nghe các event đăng nhập, đăng xuất, token refresh
    const handleAuthChange = (event: string, session: Session | null) => {
      if (!isMounted) return;

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
    };

    syncAuthFromSupabase().then(() => {
      if (!isMounted) return;

      const result = supabase.auth.onAuthStateChange(handleAuthChange);
      subscription = result.data.subscription;
      void supabase.auth.startAutoRefresh();
    });

    const handlePageShow = () => {
      syncAuthFromSupabase();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncAuthFromSupabase();
      }
    };

    const handleFocus = () => {
      syncAuthFromSupabase();
    };

    window.addEventListener("pageshow", handlePageShow);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
      void supabase.auth.stopAutoRefresh();
      window.removeEventListener("pageshow", handlePageShow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchProfile, setAuth, syncAuthFromSupabase]);

  return <>{children}</>;
}
