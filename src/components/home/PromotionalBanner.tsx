"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useHomepageStore } from "@/store/useHomepageStore";
import { Loader2 } from "lucide-react";

export default function PromotionalBanner() {
  const { promotionalBanners, fetchPromotionalBanners, isLoading } =
    useHomepageStore();

  useEffect(() => {
    fetchPromotionalBanners();
  }, [fetchPromotionalBanners]);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
      </div>
    );
  }

  if (!promotionalBanners?.length) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <p className="text-neutral-500">No promotional banners available</p>
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotionalBanners.map((promo) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] overflow-hidden rounded-2xl group"
            >
              {/* Background Image */}
              <Image
                src={promo.image}
                alt={promo.title}
                fill
                className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                priority
              />

              {/* Dark Overlay with Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 
                  to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300`}
              />

              {/* Content */}
              <div
                className={`absolute inset-0 flex flex-col justify-end p-8 text-white
                ${
                  promo.position === "center"
                    ? "text-center items-center"
                    : promo.position === "right"
                    ? "text-right items-end"
                    : "text-left items-start"
                }`}
              >
                <div className="transform group-hover:translate-y-[-8px] transition-transform duration-300">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-3"
                  >
                    <span className="inline-block text-sm font-light tracking-wider">
                      {promo.subtitle}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-medium leading-tight group-hover:underline decoration-2 underline-offset-4">
                      {promo.title}
                    </h2>
                    <p className="text-sm md:text-base font-light opacity-90">
                      {promo.description}
                    </p>
                    <Link
                      href={promo.href}
                      className="inline-block mt-4 px-6 py-3 bg-white text-black rounded-full 
                        hover:bg-black hover:text-white transition-colors duration-300
                        border border-transparent hover:border-white"
                    >
                      {promo.buttonText}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
