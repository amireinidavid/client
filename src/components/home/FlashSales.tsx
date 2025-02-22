"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHomepageStore } from "@/store/useHomepageStore";
import { Loader2, Timer, Flame } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/types";

export default function FlashSales() {
  const { flashSales, fetchFlashSaleConfigs, isLoading } = useHomepageStore();

  useEffect(() => {
    fetchFlashSaleConfigs();
  }, [fetchFlashSaleConfigs]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (!flashSales?.length) {
    return null;
  }

  const activeFlashSale = flashSales[0];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-transparent dark:from-red-950/10" />

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
              <Flame className="w-6 h-6 text-red-500 animate-pulse" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {activeFlashSale.title}
              </h2>
            </div>
            <p className="text-neutral-600 dark:text-neutral-400">
              {activeFlashSale.description ||
                "Don't miss out on these amazing deals!"}
            </p>
          </motion.div>

          {/* Timer Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 bg-white dark:bg-black/20 p-4 rounded-xl shadow-lg"
          >
            <Timer className="w-5 h-5 text-red-500" />
            <FlashSaleTimer
              endTime={new Date(activeFlashSale.endTime).getTime()}
            />
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 product-grid  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {activeFlashSale.products.map((flashProduct) => (
            <motion.div
              key={flashProduct.product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <ProductCard
                product={
                  {
                    ...flashProduct.product,
                    rating: flashProduct.product.rating || null,
                    flashSale: {
                      isActive: true,
                      discount: flashProduct.discountPercentage || 0,
                      discountPrice:
                        flashProduct.discountPrice ||
                        flashProduct.product.price *
                          (1 - (flashProduct.discountPercentage || 0) / 100),
                      originalPrice:
                        flashProduct.originalPrice ||
                        flashProduct.product.price,
                      stock:
                        flashProduct.stock ||
                        flashProduct.product.baseStock ||
                        0,
                      soldCount:
                        flashProduct.soldCount ||
                        flashProduct.product.soldCount ||
                        0,
                    },
                    productImages: flashProduct.product.productImages || [],
                  } as Product
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Timer Component
function FlashSaleTimer({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="flex gap-3">
      {[
        { label: "Hours", value: timeLeft.hours },
        { label: "Minutes", value: timeLeft.minutes },
        { label: "Seconds", value: timeLeft.seconds },
      ].map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center min-w-[60px] bg-gradient-to-b from-red-500 to-red-600 
                   text-white rounded-lg p-2"
        >
          <span className="text-2xl font-bold tabular-nums">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-xs opacity-80">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
