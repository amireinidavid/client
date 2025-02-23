"use client";

// import { motion } from "framer-motion";
// import ProductCard from "@/components/ui/ProductCard";
// import { Product } from "@/types";
// import { ProductStatus } from "@/store/UseProductsStore";

// const recommendedProducts: Product[] = [
//   {
//     id: "1",
//     name: "Leather Mini Bag",
//     brand: "Saint Laurent",
//     description: "Luxury leather mini bag",
//     price: 1290,
//     categoryId: "1",
//     baseStock: 100,
//     soldCount: 0,
//     rating: null,
//     status: ProductStatus.PUBLISHED,
//     metadata: null,
//     slug: "leather-mini-bag",
//     isFeatured: true,
//     isTrending: false,
//     isNewArrival: true,
//     specifications: [],
//     variations: [],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     category: {
//       id: "1",
//       name: "Bags",
//       type: "FASHION",
//       description: "Luxury bags",
//       image: null,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     productImages: [{
//       id: "1",
//       url: "/images/products/product10.webp",
//       publicId: "product10",
//       width: 800,
//       height: 800,
//       format: "webp",
//       size: 1000,
//       thumbnailUrl: "/images/products/product10.webp",
//       mediumUrl: "/images/products/product10.webp",
//       order: 1
//     }],
//   },
//   {
//     id: "2",
//     name: "Leather Big Bag",
//     brand: "Saint Laurent",
//     description: "Luxury leather big bag",
//     price: 5290,
//     categoryId: "1",
//     baseStock: 100,
//     soldCount: 0,
//     rating: null,
//     status: ProductStatus.PUBLISHED,
//     metadata: null,
//     slug: "leather-big-bag",
//     isFeatured: true,
//     isTrending: false,
//     isNewArrival: true,
//     specifications: [],
//     variations: [],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     category: {
//       id: "1",
//       name: "Bags",
//       type: "FASHION",
//       description: "Luxury bags",
//       image: null,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     productImages: [{
//       id: "2",
//       url: "/images/products/product6.webp",
//       publicId: "product6",
//       width: 800,
//       height: 800,
//       format: "webp",
//       size: 1000,
//       thumbnailUrl: "/images/products/product6.webp",
//       mediumUrl: "/images/products/product6.webp",
//       order: 1
//     }],
//   },
//   {
//     id: "3",
//     name: "Casa Blanca",
//     brand: "Saint Laurent",
//     description: "Luxury leather mini bag",
//     price: 3290,
//     categoryId: "1",
//     baseStock: 100,
//     soldCount: 0,
//     rating: null,
//     status: ProductStatus.PUBLISHED,
//     metadata: null,
//     slug: "casa-blanca",
//     isFeatured: true,
//     isTrending: false,
//     isNewArrival: true,
//     specifications: [],
//     variations: [],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     category: {
//       id: "1",
//       name: "Bags",
//       type: "FASHION",
//       description: "Luxury bags",
//       image: null,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     productImages: [{
//       id: "3",
//       url: "/images/products/product1.webp",
//       publicId: "product1",
//       width: 800,
//       height: 800,
//       format: "webp",
//       size: 1000,
//       thumbnailUrl: "/images/products/product1.webp",
//       mediumUrl: "/images/products/product1.webp",
//       order: 1
//     }],
//   },
//   {
//     id: "4",
//     name: "Leather Mini Bag",
//     brand: "Saint Laurent",
//     description: "Luxury leather mini bag",
//     price: 1290,
//     categoryId: "1",
//     baseStock: 100,
//     soldCount: 0,
//     rating: null,
//     status: ProductStatus.PUBLISHED,
//     metadata: null,
//     slug: "leather-mini-bag",
//     isFeatured: true,
//     isTrending: false,
//     isNewArrival: true,
//     specifications: [],
//     variations: [],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     category: {
//       id: "1",
//       name: "Bags",
//       type: "FASHION",
//       description: "Luxury bags",
//       image: null,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     productImages: [{
//       id: "4",
//       url: "/images/products/product9.webp",
//       publicId: "product9",
//       width: 800,
//       height: 800,
//       format: "webp",
//       size: 1000,
//       thumbnailUrl: "/images/products/product9.webp",
//       mediumUrl: "/images/products/product9.webp",
//       order: 1
//     }],
//   },
//   {
//     id: "5",
//     name: "Leather Mini Bag",
//     brand: "Saint Laurent",
//     description: "Luxury leather mini bag",
//     price: 1290,
//     categoryId: "1",
//     baseStock: 100,
//     soldCount: 0,
//     rating: null,
//     status: ProductStatus.PUBLISHED,
//     metadata: null,
//     slug: "leather-mini-bag",
//     isFeatured: true,
//     isTrending: false,
//     isNewArrival: true,
//     specifications: [],
//     variations: [],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//     category: {
//       id: "1",
//       name: "Bags",
//       type: "FASHION",
//       description: "Luxury bags",
//       image: null,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     },
//     productImages: [{
//       id: "5",
//       url: "/images/products/product6.webp",
//       publicId: "product6",
//       width: 800,
//       height: 800,
//       format: "webp",
//       size: 1000,
//       thumbnailUrl: "/images/products/product6.webp",
//       mediumUrl: "/images/products/product6.webp",
//       order: 1
//     }],
//   },
//   // Add more products...
// ];

export default function PersonalizedRecommendations() {
  return (
    <div>Recomendations</div>
    // <section className="py-16 bg-neutral-100">
    //   <div className="container mx-auto px-4">
    //     <motion.div
    //       initial={{ opacity: 0, y: 20 }}
    //       whileInView={{ opacity: 1, y: 0 }}
    //       viewport={{ once: true }}
    //       className="text-center mb-12"
    //     >
    //       <h2 className="text-2xl font-medium mb-2">Recommended For You</h2>
    //       <p className="text-neutral-600">Based on your style preferences</p>
    //     </motion.div>

    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    //       {recommendedProducts.map((product) => (
    //         <ProductCard key={product.id} product={product} />
    //       ))}
    //     </div>
    //   </div>
    // </section>
  );
}
