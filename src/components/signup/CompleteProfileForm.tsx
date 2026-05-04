"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { fetchWithAuth } from "@/lib/apiClient";
import { supabase } from "@/lib/supabase";

export default function CompleteProfileForm() {
  const { user, profile } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [idCard, setIdCard] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setEmail(profile.email || user?.email || "");
      setIdCard(profile.id_number || "");
    } else if (user) {
      setEmail(user.email || "");
    }
  }, [profile, user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Cập nhật thông tin auth nếu có email/password
      const updateData: { email?: string; password?: string; data?: any } = {
        data: { full_name: fullName }
      };
      
      if (email && email !== user?.email) {
        updateData.email = email;
      }
      if (password) {
        updateData.password = password;
      }

      const { error: authError } = await supabase.auth.updateUser(updateData);
      
      if (authError) {
        throw new Error(authError.message);
      }

      // Cập nhật profile database
      const res = await fetchWithAuth("/auth/profile", {
        method: "POST",
        body: JSON.stringify({
          fullName: fullName.trim(),
          idNumber: idCard.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Cập nhật thông tin thất bại.");
      }

      const data = await res.json();
      useAuthStore.getState().setProfile(data.profile);

      // Xong thì chuyển sang trang welcome
      window.location.href = "/welcome";

    } catch (err: any) {
      setSubmitError(err.message || "Lỗi cập nhật. Thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <main className="flex flex-1 items-center justify-center bg-[#FFFFFF] px-4 py-12">
        <p>Vui lòng chờ...</p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#FFFFFF] px-4 py-12">
      <div className="w-full max-w-[400px] rounded-[16px] border border-[#E6E6E6] bg-white p-6 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)] md:p-8">
        <h1 className="mb-2 text-[28px] font-bold tracking-[-0.02em] text-[#222222]">
          Hoàn tất hồ sơ
        </h1>
        <p className="mb-6 text-[14px] text-[#565959]">
          Cập nhật thông tin cơ bản để trải nghiệm tốt nhất các tính năng.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-[14px] font-medium text-[#222222]">
              Họ và tên
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full rounded-[12px] border border-[#D5D9D9] px-3 py-2 text-[14px] text-[#222222] shadow-[0_1px_2px_rgba(15,17,17,0.05)] outline-none transition-all focus:border-[#FF9900] focus:ring-[3px] focus:ring-[#FF9900]/22"
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="email" className="text-[14px] font-medium text-[#222222]">
              Email (Không bắt buộc)
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[12px] border border-[#D5D9D9] px-3 py-2 text-[14px] text-[#222222] shadow-[0_1px_2px_rgba(15,17,17,0.05)] outline-none transition-all focus:border-[#FF9900] focus:ring-[3px] focus:ring-[#FF9900]/22"
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="password" className="text-[14px] font-medium text-[#222222]">
              Tạo mật khẩu (Không bắt buộc)
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              placeholder="Để trống nếu không muốn dùng mật khẩu"
              className="w-full rounded-[12px] border border-[#D5D9D9] px-3 py-2 text-[14px] text-[#222222] shadow-[0_1px_2px_rgba(15,17,17,0.05)] outline-none transition-all focus:border-[#FF9900] focus:ring-[3px] focus:ring-[#FF9900]/22"
            />
          </div>

          <div className="mb-4 flex flex-col gap-1.5">
            <label htmlFor="idCard" className="text-[14px] font-medium text-[#222222]">
              Số CCCD (Không bắt buộc)
            </label>
            <input
              id="idCard"
              type="text"
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
              className="w-full rounded-[12px] border border-[#D5D9D9] px-3 py-2 text-[14px] text-[#222222] shadow-[0_1px_2px_rgba(15,17,17,0.05)] outline-none transition-all focus:border-[#FF9900] focus:ring-[3px] focus:ring-[#FF9900]/22"
            />
          </div>

          {submitError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
              {submitError}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-[10px] border border-[#F0C14B] bg-[#FFD814] py-2.5 text-[14px] font-semibold text-[#111111] shadow-sm transition-colors hover:bg-[#F0C14B] disabled:border-[#D5D9D9] disabled:bg-[#F7F7F7] disabled:text-[#9B9B9B]"
          >
            {isSubmitting ? "Đang lưu..." : "Hoàn tất & Tiếp tục"}
          </button>
        </form>
      </div>
    </main>
  );
}
