export default function Footer() {
  return (
    <footer className="bg-[#0F1111] text-[#FFFFFF] py-8 text-center text-[12px] md:text-[13px] mt-16">
      <div className="max-w-[1280px] mx-auto px-4 flex flex-col items-center gap-2">
        <div className="flex gap-4 md:gap-6 justify-center mb-2">
          <a href="#" className="hover:underline">
            Điều kiện sử dụng
          </a>
          <a href="#" className="hover:underline">
            Chính sách bảo mật
          </a>
          <a href="#" className="hover:underline">
            Trợ giúp
          </a>
        </div>

        <p className="text-[#6B7280]">
          © 1996-2026, Amonzan.com, Inc. hoặc các chi nhánh
        </p>
      </div>
    </footer>
  );
}