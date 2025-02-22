"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";

const recommendedProducts = [
  {
    id: 1,
    name: "Leather Mini Bag",
    brand: "Saint Laurent",
    price: 1290,
    image: "/images/products/product10.webp",
    images: [
      "/images/products/product5.webp",
      "/images/products/product3.webp",
    ],
    href: "/products/leather-mini-bag",
    isNew: true,
  },
  {
    id: 2,
    name: "Leather Big Bag",
    brand: "Saint Laurent",
    price: 5290,
    image: "/images/products/product6.webp",
    images: [
      "/images/products/product2.webp",
      "/images/products/product4.webp",
    ],
    href: "/products/leather-mini-bag",
    isNew: true,
  },
  {
    id: 3,
    name: "Casa Blanca",
    brand: "Saint Laurent",
    price: 3290,
    image: "/images/products/product1.webp",
    images: [
      "/images/products/product4.webp",
      "/images/products/product8.webp",
    ],
    href: "/products/leather-mini-bag",
    isNew: true,
  },
  {
    id: 4,
    name: "Leather Mini Bag",
    brand: "Saint Laurent",
    price: 1290,
    image: "/images/products/product9.webp",
    images: [
      "/images/products/product4.webp",
      "/images/products/product4.webp",
    ],
    href: "/products/leather-mini-bag",
    isNew: true,
  },
  {
    id: 5,
    name: "Leather Mini Bag",
    brand: "Saint Laurent",
    price: 1290,
    image: "/images/products/product6.webp",
    images: [
      "/images/products/product3.webp",
      "/images/products/product7.webp",
    ],
    href: "/products/leather-mini-bag",
    isNew: true,
  },
  // Add more products...
];

export default function PersonalizedRecommendations() {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-medium mb-2">Recommended For You</h2>
          <p className="text-neutral-600">Based on your style preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
