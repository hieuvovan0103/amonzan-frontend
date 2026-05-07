"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    // Ensure the recovery session is available (Supabase will parse tokens on this route)
    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      if (!data.session) {
        setError("Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.trim().length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password.trim(),
      });
      if (updateError) throw updateError;

      setSuccess("Đặt lại mật khẩu thành công. Đang chuyển về trang đăng nhập...");
      window.setTimeout(() => {
        router.replace("/");
      }, 900);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể đặt lại mật khẩu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[420px] rounded-[16px] border border-[#E6E6E6] bg-white p-6 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)] md:p-8">
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#222222]">Đặt lại mật khẩu</h1>
        <p className="mt-2 text-[13px] text-[#565959]">Nhập mật khẩu mới cho tài khoản của bạn.</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[14px] font-medium text-[#222222]">
              Mật khẩu mới
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className="w-full rounded-[12px] border border-[#D5D9D9] px-3 py-2 text-[14px] text-[#222222] shadow-sm outline-none transition-all focus:border-[#FF9900] focus:ring-[3px] focus:ring-[#FF9900]/22"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirmPassword" className="text-[14px] font-medium text-[#222222]">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
              className="w-full rounded-[12px] border border-[#D5D9D9] px-3 py-2 text-[14px] text-[#222222] shadow-sm outline-none transition-all focus:border-[#FF9900] focus:ring-[3px] focus:ring-[#FF9900]/22"
            />
            {confirmPassword && confirmPassword !== password ? (
              <div className="text-[12px] font-medium text-[#C62828]">Mật khẩu xác nhận không khớp.</div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13px] font-medium text-green-700">
              {success}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-[10px] border border-[#F0C14B] bg-[#FFD814] py-2.5 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-[#F0C14B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
          </button>
        </form>
      </div>
    </main>
  );
}

