"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { supabase } from "@/lib/supabase";
import { BASE_URL } from "@/lib/apiClient";
import type { Session } from "@supabase/supabase-js";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const fetchProfile = async (session: Session) => {
      try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${session.access_token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          useAuthStore.getState().setProfile(data.profile);
        }
      } catch (e) {
        console.error("Lỗi lấy profile:", e);
      }
    };

    // Lắng nghe các event đăng nhập, đăng xuất, token refresh
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('✅ [AuthProvider] Sự kiện cập nhật trạng thái:', event);
      if (session) {
        console.log('✅ [AuthProvider] Đã lấy được Session hợp lệ cho:', session.user.email);
        
        // Đảm bảo user tạo qua Google cũng được lưu vào Backend PostgreSQL một cách tự động
        if (event === 'SIGNED_IN') {
           fetch(`${BASE_URL}/auth/bootstrap-profile`, {
             method: 'POST',
             headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${session.access_token}`
             },
             body: JSON.stringify({ 
                fullName: session.user.user_metadata?.full_name || session.user.email 
             })
           }).then(() => fetchProfile(session))
             .catch(e => console.error("Lỗi đồng bộ frontend bootstrap:", e));
        } else {
           fetchProfile(session);
        }
      } else {
        console.log('⚠️ [AuthProvider] Nhận Session Rỗng (Đăng xuất hoặc lỗi).');
        useAuthStore.getState().setProfile(null);
      }
      setAuth(session, session?.user || null);
    });

    // Load session lần đầu 
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error('❌ [AuthProvider] Lỗi tải session cục bộ:', error);
      else {
        console.log('✅ [AuthProvider] Load lần đầu:', session ? `Thành công (${session.user.email})` : 'Không có session.');
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
