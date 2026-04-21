"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle, X } from "lucide-react";
import { useAuthModal } from "@/stores/useAuthModal";
import { supabase } from "@/lib/supabase";

export default function LoginModal() {
  const { isLoginOpen, closeLogin } = useAuthModal();

  const [visible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoginOpen) {
      setVisible(true);
      return;
    }

    const timeout = setTimeout(() => {
      setVisible(false);
      setStep(1);
      setPassword("");
      setError("");
      setShowPassword(false);
    }, 200);

    return () => clearTimeout(timeout);
  }, [isLoginOpen]);

  if (!visible && !isLoginOpen) return null;

  const handleContinue = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!loginId.trim()) {
      setError("Vui lòng nhập số điện thoại hoặc email.");
      return;
    }

    setIsLoading(true);
    setError("");

      setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 600);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/products`,
      },
    });

    if (authError) {
      setError("Đăng nhập Google thất bại: " + authError.message);
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password.trim()) {
      setError("Vui lòng nhập mật khẩu.");
      return;
    }

    setIsLoading(true);
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: loginId, // We use loginId as email based on the step 1 input
      password,
    });
    setIsLoading(false);

    if (authError) {
      setError("Đăng nhập thất bại: " + authError.message);
      return;
    }

    alert(`Đăng nhập thành công với tài khoản: ${loginId}`);
    closeLogin();
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center px-4 transition-all duration-200 ${
        isLoginOpen
          ? "bg-black/50 opacity-100"
          : "bg-black/0 opacity-0 pointer-events-none"
      }`}
      onClick={closeLogin}
    >
      <div
        className={`relative w-full max-w-[400px] bg-white border border-[#E6E6E6] rounded-[16px] p-6 md:p-8 shadow-[0_20px_50px_rgba(15,17,17,0.25)] transition-all duration-200 ${
          isLoginOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-3"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
      >
        <button
          type="button"
          onClick={closeLogin}
          className="absolute right-4 top-4 p-1 rounded-md text-[#6B7280] hover:text-[#222222] hover:bg-[#F7F7F7]"
          aria-label="Đóng đăng nhập"
        >
          <X className="w-5 h-5" />
        </button>

        <h1
          id="login-modal-title"
          className="text-[24px] font-bold text-[#222222] mb-6 tracking-[-0.02em]"
        >
          {step === 1 ? "Đăng nhập hoặc tạo tài khoản" : "Đăng nhập"}
        </h1>

        <form onSubmit={step === 1 ? handleContinue : handleLogin}>
          {step === 1 ? (
            <div>
              <div className="flex flex-col mb-4">
                <label
                  htmlFor="loginId"
                  className="text-[14px] font-medium text-[#222222] mb-1.5"
                >
                  Nhập số điện thoại hoặc email
                </label>

                <input
                  type="text"
                  id="loginId"
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                    if (error) setError("");
                  }}
                  className={`w-full border rounded-[12px] px-3 py-2.5 outline-none focus:ring-[3px] focus:ring-[#FF9900]/22 transition-all text-[14px] text-[#222222] shadow-sm ${
                    error
                      ? "border-[#C62828] focus:border-[#C62828]"
                      : "border-[#D5D9D9] focus:border-[#FF9900]"
                  }`}
                  autoFocus
                />

                {error && (
                  <div className="flex items-start gap-1.5 mt-2">
                    <AlertCircle className="w-4 h-4 text-[#C62828] flex-shrink-0 mt-0.5" />
                    <span className="text-[#C62828] text-[13px] font-medium leading-[1.4]">
                      {error}
                    </span>
                  </div>
                )}

                {/* Removed mock tip */}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] disabled:opacity-70 disabled:cursor-not-allowed text-[#111111] font-semibold text-[14px] py-2.5 rounded-[10px] transition-colors shadow-sm mb-4 flex items-center justify-center gap-2"
              >
                {isLoading ? "Đang xử lý..." : "Tiếp tục"}
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px bg-[#E6E6E6]" />
                <span className="text-[12px] text-[#6B7280] font-medium">
                  hoặc
                </span>
                <div className="flex-1 h-px bg-[#E6E6E6]" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full bg-[#FFFFFF] hover:bg-[#F7F7F7] border border-[#D5D9D9] text-[#222222] font-semibold text-[14px] py-2.5 rounded-[10px] transition-colors shadow-sm flex items-center justify-center gap-3 mb-6"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Đăng nhập với Google
              </button>

              <p className="text-[13px] text-[#565959]">
                Chưa có tài khoản?{" "}
                <Link
                  href="/signup"
                  className="text-[#007185] hover:text-[#E47911] hover:underline font-medium"
                  onClick={closeLogin}
                >
                  Tạo tài khoản
                </Link>
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E6E6E6]">
                <span className="text-[14px] text-[#222222] font-medium break-all pr-4">
                  {loginId}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setPassword("");
                    setError("");
                  }}
                  className="text-[13px] text-[#007185] hover:text-[#E47911] hover:underline whitespace-nowrap font-medium"
                >
                  Thay đổi
                </button>
              </div>

              <div className="flex flex-col mb-4">
                <div className="flex justify-between items-end mb-1.5">
                  <label
                    htmlFor="password"
                    className="text-[14px] font-medium text-[#222222]"
                  >
                    Mật khẩu
                  </label>

                  <a
                    href="#"
                    className="text-[12px] text-[#007185] hover:text-[#E47911] hover:underline font-medium"
                  >
                    Quên mật khẩu?
                  </a>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    autoFocus
                    className={`w-full border rounded-[12px] pl-3 pr-10 py-2.5 outline-none focus:ring-[3px] focus:ring-[#FF9900]/22 transition-all text-[14px] text-[#222222] shadow-sm ${
                      error
                        ? "border-[#C62828] focus:border-[#C62828]"
                        : "border-[#D5D9D9] focus:border-[#FF9900]"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#222222] p-1"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {error && (
                  <div className="flex items-start gap-1.5 mt-2">
                    <AlertCircle className="w-4 h-4 text-[#C62828] flex-shrink-0 mt-0.5" />
                    <span className="text-[#C62828] text-[13px] font-medium leading-[1.4]">
                      {error}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-[#FF9900]"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-[13px] text-[#222222] cursor-pointer select-none"
                >
                  Lưu thông tin đăng nhập
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-semibold text-[14px] py-2.5 rounded-[10px] transition-colors shadow-sm mb-6"
              >
                Đăng nhập
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}