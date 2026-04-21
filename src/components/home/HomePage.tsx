import HeroSection from "@/components/home/HeroSection";
import CategoryCard from "@/components/home/CategoryCard";
import { CATEGORIES } from "@/data/categories";

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="max-w-[1280px] mx-auto px-4 md:px-8 -mt-6 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard key={category.id} data={category} />
          ))}
        </div>
      </section>
    </>
  );
}