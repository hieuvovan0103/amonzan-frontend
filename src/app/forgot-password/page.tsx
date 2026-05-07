"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmed = email.trim().toLowerCase();
    if (!trimmed) {
      setError("Vui lòng nhập email.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmed, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      setSuccess("Đã gửi email đặt lại mật khẩu. Vui lòng kiểm tra hộp thư của bạn.");
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Không thể gửi email đặt lại mật khẩu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-[420px] rounded-[16px] border border-[#E6E6E6] bg-white p-6 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)] md:p-8">
        <h1 className="text-[24px] font-bold tracking-[-0.02em] text-[#222222]">Quên mật khẩu</h1>
        <p className="mt-2 text-[13px] text-[#565959]">
          Nhập email đã đăng ký. Chúng tôi sẽ gửi link để bạn đặt lại mật khẩu.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[14px] font-medium text-[#222222]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              required
              className="w-full rounded-[12px] border border-[#D5D9D9] px-3 py-2 text-[14px] text-[#222222] shadow-sm outline-none transition-all focus:border-[#FF9900] focus:ring-[3px] focus:ring-[#FF9900]/22"
            />
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
            {isSubmitting ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
          </button>

          <div className="pt-2 text-center text-[13px] text-[#565959]">
            <Link href="/" className="font-semibold text-[#007185] hover:text-[#E47911] hover:underline">
              Quay lại đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

