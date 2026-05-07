import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: true,
      detectSessionInUrl: true,
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

  Object.keys(window.localStorage)
    .filter((key) => key.startsWith("sb-") && key.endsWith("-auth-token"))
    .forEach((key) => window.localStorage.removeItem(key));
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
