"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Parallax } from "swiper/modules";
import { useHomepageStore } from "@/store/useHomepageStore";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/parallax";
import "swiper/css/autoplay";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";

export default function HeroSection() {
  const { fetchHeroSlides, heroSlides, isLoading } = useHomepageStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchHeroSlides();
  }, [fetchHeroSlides]);

  if (isLoading || heroSlides.length === 0) {
    return (
      <div className="h-[95vh] w-full bg-gradient-to-br from-purple-50 to-indigo-50 animate-pulse flex items-center justify-center">
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-xl font-medium">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <section className="relative h-[95vh] w-full overflow-hidden bg-neutral-950">
      {/* Decorative Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/20 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/20 to-transparent z-10" />
      </div>

      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Parallax]}
        effect="fade"
        parallax={true}
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        navigation={{
          prevEl: '.swiper-button-prev',
          nextEl: '.swiper-button-next',
        }}
        loop={true}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background Image with Advanced Effects */}
              <motion.div
                initial={{ scale: 1.2, opacity: 0 }}
                animate={{ 
                  scale: activeIndex === index ? 1 : 1.2,
                  opacity: 1,
                  filter: isHovered ? "brightness(0.8)" : "brightness(1)"
                }}
                transition={{ duration: 6, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
                {/* Multiple Gradient Overlays for Depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)]" />
              </motion.div>

              {/* Content with Enhanced Animations */}
              <div className="relative z-10 flex h-full items-center justify-start px-8 lg:px-16">
                <div className="max-w-3xl">
                  {/* Animated Subtitle */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="mb-6"
                  >
                    <span className="inline-block rounded-full bg-white/10 px-6 py-2 text-sm backdrop-blur-md border border-white/20 text-white/90">
                      {slide.subtitle}
                    </span>
                  </motion.div>

                  {/* Animated Title with Gradient */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.8 }}
                    className="mb-6 text-7xl font-bold tracking-tight lg:text-8xl"
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/80">
                      {slide.title}
                    </span>
                  </motion.h1>

                  {/* Animated Description */}
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="mb-8 text-xl text-neutral-200/90 font-light leading-relaxed max-w-2xl"
                  >
                    {slide.description}
                  </motion.p>

                  {/* Animated CTA Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="flex gap-4"
                  >
                    <Button
                      size="lg"
                      asChild
                      className="group relative h-14 overflow-hidden bg-white px-8 text-lg text-black transition-all duration-300 hover:shadow-2xl hover:shadow-white/20"
                    >
                      <motion.a 
                        href={slide.ctaLink}
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        {slide.ctaText}
                        <motion.span
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                        >
                          <ArrowRight className="h-5 w-5" />
                        </motion.span>
                      </motion.a>
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="h-14 px-8 text-lg border-white/20 text-white backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
                    >
                      Learn More
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Enhanced Navigation Buttons */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="swiper-button-prev absolute left-8 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-110"
        >
          <ChevronLeft className="h-6 w-6" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="swiper-button-next absolute right-8 top-1/2 z-20 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md border border-white/20 transition-all hover:bg-white/20 hover:scale-110"
        >
          <ChevronRight className="h-6 w-6" />
        </motion.div>

        {/* Enhanced Progress Indicators */}
        <div className="absolute bottom-12 left-8 z-20 flex gap-3 lg:left-16">
          {heroSlides.map((_, index) => (
            <motion.div
              key={index}
              className="relative h-1 overflow-hidden rounded-full bg-white/20"
              initial={{ width: 24 }}
              animate={{ width: activeIndex === index ? 40 : 24 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: activeIndex === index ? 1 : 0,
                }}
                transition={{ duration: activeIndex === index ? 5 : 0.3 }}
                style={{ originX: 0 }}
              />
            </motion.div>
          ))}
        </div>
      </Swiper>
    </section>
  );
}
