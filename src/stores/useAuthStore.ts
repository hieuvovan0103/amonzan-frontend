import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { isInvalidRefreshTokenError, resetBrokenSupabaseSession, supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isInitialized: boolean;
  isSyncing: boolean;
  setAuth: (session: Session | null, user: User | null) => void;
  setProfile: (profile: any | null) => void;
  setSyncing: (isSyncing: boolean) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  isInitialized: false,
  isSyncing: true,
  setAuth: (session, user) => set({ session, user, isInitialized: true, isSyncing: false }),
  setProfile: (profile) => set({ profile }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (isInvalidRefreshTokenError(error)) {
          await resetBrokenSupabaseSession();
        } else {
          console.warn("[AuthStore] Sign out failed:", error.message);
        }
      }
    } catch (error) {
      if (isInvalidRefreshTokenError(error)) {
        await resetBrokenSupabaseSession();
      } else {
        console.warn("[AuthStore] Sign out failed:", error);
      }
    }
    set({ session: null, user: null, profile: null, isInitialized: true, isSyncing: false });

    // Import dynamically để tránh circular dependency
    const { useToastStore } = await import('@/stores/useToastStore');
    useToastStore.getState().show('Đã đăng xuất thành công. Hẹn gặp lại!', 'success', 3000);

    // Redirect về trang chủ
    window.location.href = '/products';
  },
}));
