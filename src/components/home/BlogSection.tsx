"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Sustainable Fashion",
    excerpt:
      "Exploring eco-friendly materials and ethical production methods...",
    image: "/images/hero-2.jpg",
    category: "Sustainability",
    date: "Mar 15, 2024",
    href: "/blog/future-of-sustainable-fashion",
  },
  // Add more posts...
];

export default function BlogSection() {
  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-medium mb-2">Style Journal</h2>
          <p className="text-neutral-600">Stories from the world of fashion</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link href={post.href}>
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-medium group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="text-neutral-600">{post.excerpt}</p>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
