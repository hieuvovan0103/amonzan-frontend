export default function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-[#FFD814]/30 to-[#FFFFFF] pt-16 pb-12 px-4 text-center">
      <div className="max-w-[1280px] mx-auto">
        <h1 className="text-[32px] md:text-[40px] font-bold text-[#222222] leading-[1.2] tracking-[-0.03em] mb-4">
          Thuê trang phục. Trở thành tâm điểm.
        </h1>

        <p className="text-[16px] md:text-[20px] text-[#565959] font-medium max-w-2xl mx-auto mb-8">
          Khám phá trang phục, cosplay và đạo cụ từ các cửa hàng cho thuê uy tín.
        </p>

        <a 
          href="/products" 
          className="inline-block bg-[#232F3E] text-white font-bold text-[16px] md:text-[18px] px-8 py-3.5 rounded-[12px] hover:bg-[#111111] hover:scale-105 transition-all shadow-[0_8px_20px_rgba(35,47,62,0.2)]"
        >
          Khám phá ngay
        </a>
      </div>
    </section>
  );
}