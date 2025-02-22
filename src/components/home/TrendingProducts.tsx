"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { useHomepageStore } from "@/store/useHomepageStore";
import { Loader2, TrendingUp } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";

export default function TrendingProducts() {
  const { trendingProducts, fetchTrendingProducts, isLoading } =
    useHomepageStore();

  useEffect(() => {
    fetchTrendingProducts();
  }, [fetchTrendingProducts]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (!trendingProducts?.length) {
    return null;
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/10" />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                Trending Now
              </h2>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              Discover what's hot and trending in our store
            </p>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2  product-grid  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {trendingProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard
                product={{
                  ...product,
                  rating: product.rating || null,
                  flashSale: product.flashSale || {
                    isActive: false,
                    discount: 0,
                    discountPrice: product.price,
                    originalPrice: product.price,
                    stock: product.baseStock || 0,
                    soldCount: product.soldCount || 0,
                  },
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
