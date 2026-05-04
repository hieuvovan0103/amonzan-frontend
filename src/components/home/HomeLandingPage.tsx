import HeroSection from "./HeroSection";
import CategorySection from "./CategorySection";
import TrendingSection from "./TrendingSection";
import HowItWorksSection from "./HowItWorksSection";
import VendorCTASection from "./VendorCTASection";

export default function HomeLandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <HeroSection />
      <CategorySection />
      <TrendingSection />
      <HowItWorksSection />
      <VendorCTASection />
    </main>
  );
}