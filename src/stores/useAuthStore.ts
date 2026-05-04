import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: any | null;
  isInitialized: boolean;
  setAuth: (session: Session | null, user: User | null) => void;
  setProfile: (profile: any | null) => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  isInitialized: false,
  setAuth: (session, user) => set({ session, user, isInitialized: true }),
  setProfile: (profile) => set({ profile }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });

    // Import dynamically để tránh circular dependency
    const { useToastStore } = await import('@/stores/useToastStore');
    useToastStore.getState().show('Đã đăng xuất thành công. Hẹn gặp lại!', 'success', 3000);

    // Redirect về trang chủ
    window.location.href = '/products';
  },
}));

