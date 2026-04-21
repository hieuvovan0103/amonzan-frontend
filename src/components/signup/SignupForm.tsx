"use client";

import InputField from "@/components/signup/InputField";
import { BASE_URL } from "@/lib/apiClient";
import { supabase } from "@/lib/supabase";

export default function SignupForm() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string; // Mapping "Tên đăng nhập" to full_name

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username,
        },
      },
    });

    if (error) {
      console.error("Lỗi đăng ký:", error.message);
      alert("Đăng ký thất bại: " + error.message);
    } else {
      console.log("Tạo tài khoản Supabase thành công:", data);
      
      const token = data.session?.access_token;
      if (token) {
        try {
          const mobile = formData.get("mobile") as string;
          
          // Gửi request API đến NestJS để tạo Profile vào các Public Table
          const res = await fetch(`${BASE_URL}/auth/bootstrap-profile`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              fullName: username,
              phoneNumber: mobile
            })
          });
          
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Lỗi tạo profile từ Server");
          }
          
          alert("Đăng ký và tạo hồ sơ hoàn chỉnh thành công!");
        } catch (err: any) {
          console.error("Lỗi gọi API bootstrap profile:", err);
          alert("Lỗi khi đồng bộ profile: " + err.message);
        }
      } else {
        // Trường hợp Supabase cài đặt yêu cầu xác thực Email -> Không trả về Session ngay
        alert("Đăng ký thành công! Vui lòng kiểm tra hòm thư email của bạn để xác thực tài khoản.");
      }
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center py-12 px-4 bg-[#FFFFFF]">
      <div className="w-full max-w-[400px] bg-white border border-[#E6E6E6] rounded-[16px] p-6 md:p-8 shadow-[0_1px_2px_rgba(15,17,17,0.06),_0_4px_14px_rgba(15,17,17,0.05)]">
        <h1 className="text-[28px] font-bold text-[#222222] mb-6 tracking-[-0.02em]">
          Tạo tài khoản mới
        </h1>

        <form onSubmit={handleSubmit}>
          <InputField label="Tên đăng nhập" id="username" />
          <InputField label="Số điện thoại di động" id="mobile" type="tel" />
          <InputField label="Email" id="email" type="email" />
          <InputField label="Mật khẩu" id="password" type="password" />
          <InputField label="Số chứng minh nhân dân/CCCD" id="idCard" />

          <button
            type="submit"
            className="w-full bg-[#FFD814] hover:bg-[#F0C14B] border border-[#F0C14B] text-[#111111] font-semibold text-[14px] py-2.5 rounded-[10px] mt-2 transition-colors shadow-sm"
          >
            Đăng ký
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <p className="text-[12px] text-[#222222] leading-[1.5]">
            Bằng cách tiếp tục, bạn đồng ý với{" "}
            <a
              href="#"
              className="text-[#007185] hover:text-[#E47911] hover:underline"
            >
              Điều kiện sử dụng
            </a>{" "}
            và{" "}
            <a
              href="#"
              className="text-[#007185] hover:text-[#E47911] hover:underline"
            >
              Chính sách bảo mật
            </a>
            {" "}của Amonzan.
          </p>

          <div>
            <a
              href="#"
              className="text-[13px] text-[#007185] hover:text-[#E47911] hover:underline font-medium"
            >
              Cần trợ giúp?
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}