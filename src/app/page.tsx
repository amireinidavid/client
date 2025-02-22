import HeroSection from "@/components/home/HeroSection";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import TrendingProducts from "@/components/home/TrendingProducts";
import PromotionalBanner from "@/components/home/PromotionalBanner";
import PersonalizedRecommendations from "@/components/home/PersonalizedRecommendations";
import FlashSales from "@/components/home/FlashSales";
import BlogSection from "@/components/home/BlogSection";
import TrustSignals from "@/components/home/TrustSignals";

export default function HomePage() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900">
      {/* Hero Section - Full width */}
      <HeroSection />

      {/* Main content with max-width container */}
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="space-y-24 py-16">
          {/* Trust Signals */}
          <section className="py-12">
            <TrustSignals />
          </section>

          {/* Featured Categories */}
          <section className="py-12">
            <FeaturedCategories />
          </section>

          {/* Trending Products */}
          <section className="py-12">
            <TrendingProducts />
          </section>

          {/* Promotional Banner - Full width */}
          <div className="-mx-4">
            <PromotionalBanner />
          </div>

          {/* Personalized Recommendations */}
          <section className="py-12">
            <PersonalizedRecommendations />
          </section>

          {/* Flash Sales */}
          <section className="py-12">
            <FlashSales />
          </section>

          {/* Blog Section */}
          <section className="py-12">
            <BlogSection />
          </section>
        </div>
      </div>
    </div>
  );
}
