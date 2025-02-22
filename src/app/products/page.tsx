"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import { useProductStore } from "@/store/UseProductsStore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const { products, fetchProductsForClient, isLoading, totalPages } =
    useProductStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: "createdAt",
    categoryId: "",
    minPrice: 0,
    maxPrice: 10000,
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products when page or filters change
  useEffect(() => {
    fetchProductsForClient({ ...filters, page: currentPage });
  }, [currentPage, filters]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const productVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const filterVariants = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container-width py-8 px-4 md:px-6">
        {/* Header with modern design */}
        <div className="relative z-10 mb-12">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70"
          >
            Discover Our Collection
          </motion.h1>
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto"
          >
            Explore our curated selection of premium products designed for the
            modern lifestyle
          </motion.p>
        </div>

        {/* Filters and Sort Section */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <SlidersHorizontal size={16} />
            Filters
          </Button>

          <Select
            defaultValue={filters.sortBy}
            onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
          >
            <SelectTrigger className="w-[180px] bg-background/50 backdrop-blur-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="createdAt">Latest Arrivals</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="soldCount">Most Popular</SelectItem>
                <SelectItem value="rating">Best Rated</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid with Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 product-grid  lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12"
        >
          <AnimatePresence mode="wait">
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={productVariants}
                layout
                className="group"
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid place-items-center my-12">
            <div className="loading-spinner" />
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ChevronLeft size={16} />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "min-w-[40px] transition-all",
                currentPage === page && "bg-primary text-primary-foreground"
              )}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="hover:bg-primary hover:text-primary-foreground transition-all"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {/* Add this to your globals.css */}
      <style jsx global>{`
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .container-width {
          max-width: 1440px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}
