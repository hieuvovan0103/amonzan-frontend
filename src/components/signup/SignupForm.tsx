"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, ChevronRight, ShieldCheck } from "lucide-react";
import PhoneOtpDialog from "@/components/signup/PhoneOtpDialog";
import { BASE_URL, fetchWithAuth } from "@/lib/apiClient";
import { normalizePhoneNumber } from "@/lib/phone";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

function mapSignupError(message?: string) {
  if (!message) {
    return "Khong the tao tai khoan moi.";
  }

  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("already registered") ||
    normalizedMessage.includes("already exists")
  ) {
    return "Tai khoan nay da duoc dang ky. Vui long dang nhap.";
  }

  if (
    normalizedMessage.includes("email rate limit exceeded") ||
    normalizedMessage.includes("over_email_send_rate_limit") ||
    normalizedMessage.includes("over request rate limit")
  ) {
    return "Ban vua yeu cau gui qua nhieu email xac nhan. Vui long doi it phut roi thu lai.";
  }

  if (
    normalizedMessage.includes("email address") &&
    normalizedMessage.includes("invalid")
  ) {
    return "Email khong hop le. Vui long kiem tra lai va thu lai.";
  }

  return message;
}

export default function SignupForm() {
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [identifier, setIdentifier] = useState(""); // Email or Phone
  const [password, setPassword] = useState("");
  
  // For OTP mode if needed
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [skipInitialOtp, setSkipInitialOtp] = useState(false);

  const handleGoogleLogin = async () => {
      try {
          const { error } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                  redirectTo: `${window.location.origin}/auth/callback`
              }
          });
          if (error) throw error;
      } catch (err: any) {
          setSubmitError(err.message || "Không thể đăng nhập bằng Google.");
      }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    const normalizedIdentifier = identifier.trim();

    if (!normalizedIdentifier) {
        setSubmitError("Vui lòng nhập email hoặc số điện thoại.");
        setIsSubmitting(false);
        return;
    }

    let credentials;
    const isEmail = normalizedIdentifier.includes("@");

    if (isEmail) {
        credentials = { email: normalizedIdentifier.toLowerCase(), password };
    } else {
        const normalizedPhoneNumber = normalizePhoneNumber(normalizedIdentifier);
        if (!normalizedPhoneNumber) {
            setSubmitError("Số điện thoại không hợp lệ.");
            setIsSubmitting(false);
            return;
        }
        credentials = { phone: normalizedPhoneNumber, password };
    }

    // ĐĂNG KÝ TÀI KHOẢN MỚI
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(credentials);
    
    if (signUpError) {
        const mappedError = mapSignupError(signUpError.message);
        if (mappedError !== signUpError.message) {
            setSubmitError(mappedError);
            setIsSubmitting(false);
            return;
        }
        // Nếu lỗi là do tài khoản đã tồn tại
        if (signUpError.message.toLowerCase().includes("already registered") || signUpError.message.toLowerCase().includes("already exists")) {
            setSubmitError("Tài khoản này đã được đăng ký. Vui lòng đăng nhập.");
        } else {
            setSubmitError(signUpError.message || "Không thể tạo tài khoản mới.");
        }
        setIsSubmitting(false);
    } else {
        if (signUpData.session) {
            // Đăng nhập luôn, không cần OTP
            window.location.href = "/complete-profile";
        } else {
            if (isEmail) {
                setSubmitSuccess("Đăng ký thành công! Vui lòng kiểm tra hộp thư email của bạn để xác nhận tài khoản.");
                setIsSubmitting(false);
            } else {
                // Số điện thoại: Supabase đã gửi 1 mã OTP. Mở hộp thoại OTP để nhập.
                const normalizedPhone =
                    normalizePhoneNumber(normalizedIdentifier) || normalizedIdentifier;
                setMobile(normalizedPhone);
                setSkipInitialOtp(true); // Tránh gửi thêm OTP lần 2
                setShowOtpDialog(true);
                setIsSubmitting(false);
            }
        }
    }
  };

  return (
    <>
      <main className="flex flex-1 items-center justify-center bg-[#FFFFFF] px-4 py-12">
        <div className="w-full max-w-[400px] rounded-[16px] border border-[#E6E6E6] bg-white p-6 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)] md:p-8">
          <h1 className="mb-6 text-[28px] font-bold tracking-[-0.02em] text-[#222222]">
            Tạo tài khoản
          </h1>

          <form onSubmit={handleSubmit}>
                <div className="mb-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                      <label htmlFor="identifier" className="text-[14px] font-medium text-[#222222]">
                        Email hoặc Số điện thoại
                      </label>
                      <input
                        id="identifier"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="email@example.com hoặc 0912345678"
                        required
                        className="w-full rounded-[12px] border border-[#D5D9D9] px-3 py-2 text-[14px] text-[#222222] shadow-[0_1px_2px_rgba(15,17,17,0.05)] outline-none transition-all focus:border-[#FF9900] focus:ring-[3px] focus:ring-[#FF9900]/22"
                      />
                  </div>
                  <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-[14px] font-medium text-[#222222]">
                            Mật khẩu
                          </label>
                      </div>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu tối thiểu 6 ký tự"
                        required
                        minLength={6}
                        className="w-full rounded-[12px] border border-[#D5D9D9] px-3 py-2 text-[14px] text-[#222222] shadow-[0_1px_2px_rgba(15,17,17,0.05)] outline-none transition-all focus:border-[#FF9900] focus:ring-[3px] focus:ring-[#FF9900]/22"
                      />
                  </div>
                </div>

            {submitError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                {submitError}
              </div>
            )}

            {submitSuccess && (
              <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-[13px] text-green-700">
                {submitSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-[10px] border border-[#F0C14B] bg-[#FFD814] py-2.5 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-[#F0C14B] disabled:border-[#D5D9D9] disabled:bg-[#F7F7F7] disabled:text-[#9B9B9B]"
            >
              Tiếp tục
            </button>
          </form>

            <div className="mt-6 space-y-4">
              <p className="text-[12px] leading-[1.5] text-[#222222]">
                Bằng cách tiếp tục, bạn đồng ý với{" "}
                <a href="#" className="text-[#007185] hover:text-[#E47911] hover:underline">
                  Điều kiện sử dụng
                </a>{" "}
                và{" "}
                <a href="#" className="text-[#007185] hover:text-[#E47911] hover:underline">
                  Chính sách bảo mật
                </a>{" "}
                của Amonzan.
              </p>

              <div className="flex items-center justify-between">
                <a
                  href="#"
                  className="text-[13px] font-medium text-[#007185] hover:text-[#E47911] hover:underline"
                >
                  Cần trợ giúp?
                </a>
              </div>

              <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#E6E6E6]"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-[12px] text-[#565959]">Hoặc đăng nhập bằng</span>
                  </div>
              </div>

              <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center gap-2 rounded-[10px] border border-[#D5D9D9] bg-white py-2.5 text-[14px] font-medium text-[#222222] shadow-sm transition-colors hover:bg-[#F7F7F7]"
              >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
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
                      <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Tiếp tục với Google
              </button>

              <div className="pt-4 mt-4 border-t border-[#E6E6E6]">
                <p className="text-[13px] font-medium text-[#222222] mb-1">
                  Đã có tài khoản?{" "}
                  <button onClick={() => {
                    // Logic to open Login modal would go here if this wasn't a separate page.
                    // For now, redirect to homepage where they can open login modal
                    window.location.href = "/";
                  }} className="text-[#007185] hover:text-[#E47911] hover:underline">
                    Đăng nhập
                  </button>
                </p>
                
                <div className="mt-4">
                  <p className="text-[13px] font-medium text-[#222222] mb-1">
                    Bạn muốn cho thuê đồ trên Amonzan?
                  </p>
                  <Link
                    href="/vendor/register"
                    className="text-[13px] font-medium text-[#007185] hover:text-[#E47911] hover:underline inline-flex items-center"
                  >
                    Đăng ký trở thành Đối tác Vendor <ChevronRight className="w-4 h-4 ml-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>

      {showOtpDialog && (
        <PhoneOtpDialog
          phoneNumber={mobile}
          mode="login"
          skipInitialOtp={skipInitialOtp}
          onSuccess={async () => {
            setShowOtpDialog(false);
            // Lưu số điện thoại để AuthProvider truyền vào bootstrap-profile
            sessionStorage.setItem("pending_phone", mobile);
            try {
              const res = await fetchWithAuth("/auth/me");
              if (res.ok) {
                const data = await res.json();
                if (data.profile && data.profile.full_name) {
                  window.location.href = "/products";
                  return;
                }
              }
            } catch (error) {
              console.error("Lỗi khi lấy thông tin profile:", error);
            }
            window.location.href = "/complete-profile";
          }}
          onClose={() => {
            setShowOtpDialog(false);
          }}
        />
      )}
    </>
  );
}
