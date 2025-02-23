"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useHomepageStore } from "@/store/useHomepageStore";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types";

export default function FeaturedCategories() {
  const { featuredProducts, fetchFeaturedProducts, isLoading } =
    useHomepageStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (!featuredProducts?.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-neutral-500">No featured products available</p>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Products</h2>
          <p className="text-neutral-600 mt-2">
            Discover our handpicked selection of featured items
          </p>
        </div>

        <div className="grid grid-cols-2 product-grid  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {featuredProducts.map((product: Product) => (
            <ProductCard
              key={product.id}
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
                  startTime: "",
                  endTime: "",
                },
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
