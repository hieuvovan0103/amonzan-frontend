import { createClient } from '@supabase/supabase-js'

type AuthStorageMode = "local" | "session";

const AUTH_STORAGE_MODE_KEY = "amonzan-auth-storage-mode";

function getAuthStorageMode(): AuthStorageMode {
  if (typeof window === "undefined") return "local";
  const value = window.localStorage.getItem(AUTH_STORAGE_MODE_KEY);
  return value === "session" ? "session" : "local";
}

export function setAuthStorageMode(mode: AuthStorageMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_MODE_KEY, mode);
}

function resolveWebStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  return getAuthStorageMode() === "session" ? window.sessionStorage : window.localStorage;
}

const dynamicAuthStorage = {
  getItem: (key: string) => {
    const storage = resolveWebStorage();
    if (!storage) return null;
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    const storage = resolveWebStorage();
    if (!storage) return;
    try {
      storage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  removeItem: (key: string) => {
    const storage = resolveWebStorage();
    if (!storage) return;
    try {
      storage.removeItem(key);
    } catch {
      // ignore
    }
  },
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: true,
      storage: dynamicAuthStorage,
    },
  },
)

export function isInvalidRefreshTokenError(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String((error as { message?: unknown }).message)
        : String(error ?? "");

  return (
    message.toLowerCase().includes("invalid refresh token") ||
    message.toLowerCase().includes("refresh token not found")
  );
}

export function clearSupabaseAuthStorage() {
  if (typeof window === "undefined") return;

  const candidates = [window.localStorage, window.sessionStorage];
  candidates.forEach((storage) => {
    Object.keys(storage)
      .filter((key) => key.startsWith("sb-") && key.endsWith("-auth-token"))
      .forEach((key) => storage.removeItem(key));
  });
}

export async function resetBrokenSupabaseSession() {
  try {
    const { error } = await supabase.auth.signOut({ scope: "local" });
    if (error && !isInvalidRefreshTokenError(error)) {
      console.warn("[supabase] Unable to sign out locally:", error.message);
    }
  } catch {
    clearSupabaseAuthStorage();
  }

  clearSupabaseAuthStorage();
}
