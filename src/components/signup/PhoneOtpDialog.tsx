"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Loader2, X } from "lucide-react";
import { fetchWithAuth } from "@/lib/apiClient";
import { normalizePhoneNumber } from "@/lib/phone";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/useAuthStore";

interface PhoneOtpDialogProps {
  phoneNumber: string;
  onSuccess?: () => void;
  onClose?: () => void;
  mode?: "login" | "update";
  skipInitialOtp?: boolean;
}

const OTP_LENGTH = 6;
const OTP_DURATION_SECONDS = 10 * 60;

function mapPhoneAuthError(message?: string) {
  if (!message) {
    return "Không thể xử lý yêu cầu xác minh số điện thoại.";
  }

  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("phone provider is disabled") ||
    normalizedMessage.includes("phone_provider_disabled") ||
    normalizedMessage.includes("sms_send_failed")
  ) {
    return "Supabase Phone Auth chưa được bật hoặc SMS provider chưa được cấu hình.";
  }

  if (normalizedMessage.includes("geo-permissions")) {
    return "Số điện thoại thuộc quốc gia đang bị chặn gửi SMS. Vui lòng bật quyền gửi SMS đến Việt Nam (VN) trong cài đặt Geo-Permissions của Twilio.";
  }

  if (
    normalizedMessage.includes("unverified") ||
    normalizedMessage.includes("trial account") ||
    normalizedMessage.includes("21608")
  ) {
    return "Lỗi từ nhà mạng (Twilio): Tài khoản Twilio dùng thử chỉ có thể gửi SMS đến các số đã được xác thực. Vui lòng xác thực số điện thoại này trên Twilio Console hoặc sử dụng số Test đã cấu hình trong Supabase.";
  }

  if (
    normalizedMessage.includes("over_sms_send_rate_limit") ||
    normalizedMessage.includes("over request rate limit") ||
    normalizedMessage.includes("security purposes")
  ) {
    return "Bạn vừa yêu cầu quá nhiều mã OTP. Vui lòng đợi một lúc rồi thử lại.";
  }

  if (
    normalizedMessage.includes("otp_expired") ||
    normalizedMessage.includes("expired")
  ) {
    return "Mã OTP đã hết hạn. Vui lòng gửi lại mã mới.";
  }

  if (
    normalizedMessage.includes("token") ||
    normalizedMessage.includes("otp") ||
    normalizedMessage.includes("invalid")
  ) {
    return "Mã OTP không hợp lệ. Vui lòng thử lại.";
  }

  if (
    normalizedMessage.includes("auth session missing") ||
    normalizedMessage.includes("session_not_found")
  ) {
    return "Bạn cần đăng nhập lại để xác minh số điện thoại.";
  }

  return message;
}

export default function PhoneOtpDialog({
  phoneNumber,
  onSuccess,
  onClose,
  mode = "update",
  skipInitialOtp = false,
}: PhoneOtpDialogProps) {
  const normalizedPhoneNumber = normalizePhoneNumber(phoneNumber);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION_SECONDS);
  const [isSending, setIsSending] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hasSentOtpRef = useRef(false);

  const syncProfile = useCallback(async () => {
    const syncRes = await fetchWithAuth("/auth/phone/sync", {
      method: "POST",
    });

    if (!syncRes.ok) {
      const syncData = await syncRes.json().catch(() => null);
      throw new Error(syncData?.message || "Không thể đồng bộ trạng thái số điện thoại.");
    }

    const meRes = await fetchWithAuth("/auth/me");
    if (meRes.ok) {
      const meData = await meRes.json();
      useAuthStore.getState().setProfile(meData.profile);
    }
  }, []);

  const sendOtp = useCallback(async () => {
    if (!normalizedPhoneNumber) {
      setError("Số điện thoại không hợp lệ. Hãy nhập theo định dạng 0912 345 678 hoặc +84912345678.");
      setIsSending(false);
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      if (mode === "update") {
        console.log(`[PhoneOtpDialog] Bắt đầu gửi OTP update tới số: ${normalizedPhoneNumber}`);
        const { error: authError } = await supabase.auth.updateUser({
          phone: normalizedPhoneNumber,
        });

        if (authError) {
          throw new Error(mapPhoneAuthError(authError.message));
        }
      } else {
        console.log(`[PhoneOtpDialog] Gọi signInWithOtp tới số: ${normalizedPhoneNumber}`);
        const { error: authError } = await supabase.auth.signInWithOtp({
          phone: normalizedPhoneNumber,
        });

        if (authError) {
          throw new Error(mapPhoneAuthError(authError.message));
        }
      }

      const startRes = await fetchWithAuth("/auth/phone/start-verification", {
        method: "POST",
        body: JSON.stringify({ phoneNumber: normalizedPhoneNumber }),
      });

      if (!startRes.ok) {
        const startData = await startRes.json().catch(() => null);
        throw new Error(startData?.message || "Không thể lưu thông tin số điện thoại đang chờ xác minh.");
      }
    } catch (err: any) {
      setError(err.message || "Không thể gửi OTP. Thử lại sau.");
    } finally {
      setIsSending(false);
    }
  }, [normalizedPhoneNumber]);

  useEffect(() => {
    if (!hasSentOtpRef.current) {
      hasSentOtpRef.current = true;
      if (!skipInitialOtp) {
        sendOtp();
      } else {
        setIsSending(false);
      }
    }
  }, [sendOtp, skipInitialOtp]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const id = setInterval(() => {
      setTimeLeft((currentTime) => currentTime - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timeLeft]);

  useEffect(() => {
    if (!isSending) {
      const focusTimeout = window.setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);

      return () => window.clearTimeout(focusTimeout);
    }
  }, [isSending]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    setDigits(nextDigits);
    setError(null);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      if (digits[index]) {
        const nextDigits = [...digits];
        nextDigits[index] = "";
        setDigits(nextDigits);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;

    const nextDigits = [...digits];
    pasted.split("").forEach((digit, index) => {
      nextDigits[index] = digit;
    });

    setDigits(nextDigits);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    const otp = digits.join("");

    if (!normalizedPhoneNumber) {
      setError("Số điện thoại không hợp lệ.");
      return;
    }

    if (otp.length < OTP_LENGTH) {
      setError("Vui lòng nhập đủ 6 chữ số OTP.");
      return;
    }

    if (timeLeft <= 0) {
      setError("OTP đã hết hạn. Vui lòng gửi lại.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const { error: verifyError, data } = await supabase.auth.verifyOtp({
        phone: normalizedPhoneNumber,
        token: otp,
        type: mode === "login" ? "sms" : "phone_change",
      });

      if (verifyError) {
        throw new Error(mapPhoneAuthError(verifyError.message));
      }

      if (mode === "login") {
        // Wait for AuthProvider to sync session
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
        return;
      }

      await syncProfile();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "OTP không đúng. Vui lòng thử lại.");
      setDigits(Array(OTP_LENGTH).fill(""));
      window.setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setDigits(Array(OTP_LENGTH).fill(""));
    setTimeLeft(OTP_DURATION_SECONDS);
    setError(null);
    sendOtp();
  };

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === overlayRef.current) {
      onClose?.();
    }
  };

  const isExpired = timeLeft <= 0;
  const otpFull = digits.every((digit) => digit !== "");

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Xác minh số điện thoại"
    >
      <div className="relative w-full max-w-[400px] animate-fade-in rounded-2xl bg-white p-6 shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#9B9B9B] transition-colors hover:text-[#222]"
          aria-label="Đóng"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5">
          <h2 className="text-[22px] font-bold tracking-tight text-[#222222]">
            Xác minh số điện thoại
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-[#565959]">
            Supabase sẽ gửi mã OTP 6 chỳ số đến{" "}
            <span className="font-semibold text-[#222]">
              {normalizedPhoneNumber || phoneNumber}
            </span>
          </p>
        </div>

        {isSending ? (
          <div className="flex items-center justify-center gap-2 py-6 text-[#565959]">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-[14px]">Đang gửi OTP...</span>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-2" onPaste={handlePaste}>
              {digits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleDigitChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  disabled={isExpired || isVerifying}
                  className={`
                    h-14 w-12 select-none rounded-xl border-2 text-center text-[22px] font-bold text-[#222222] outline-none transition-all duration-150
                    ${digit ? "border-[#FF9900] bg-[#FFF9EE]" : "border-[#D5D9D9] bg-white"}
                    ${isExpired ? "cursor-not-allowed opacity-40" : "focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20"}
                  `}
                  aria-label={`Chữ số OTP ${index + 1}`}
                />
              ))}
            </div>

            <div className="mb-4 flex items-center justify-between">
              <span
                className={`text-[13px] font-medium tabular-nums ${isExpired
                    ? "text-red-500"
                    : timeLeft < 60
                      ? "text-orange-500"
                      : "text-[#565959]"
                  }`}
              >
                {isExpired ? "OTP đã hết hạn" : `Còn lại: ${formatTime(timeLeft)}`}
              </span>
              {isExpired && (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-[13px] font-medium text-[#007185] transition-colors hover:text-[#E47911] hover:underline"
                >
                  Gửi lại OTP
                </button>
              )}
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                <p className="text-[13px] leading-relaxed text-red-600">{error}</p>
              </div>
            )}

            <button
              type="button"
              onClick={handleVerify}
              disabled={!otpFull || isExpired || isVerifying}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#F0C14B] bg-[#FFD814] py-3 text-[14px] font-semibold text-[#111111] shadow-sm transition-all duration-200 hover:bg-[#F0C14B] disabled:cursor-not-allowed disabled:border-[#D5D9D9] disabled:bg-[#F7F7F7] disabled:text-[#9B9B9B]"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xác minh...
                </>
              ) : (
                "Xác nhận OTP"
              )}
            </button>

            {!isExpired && (
              <p className="mt-4 text-center text-[12px] text-[#9B9B9B]">
                Không nhận được mã?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-[#007185] transition-colors hover:text-[#E47911] hover:underline"
                >
                  Gửi lại
                </button>
              </p>
            )}
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
