"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronLeft,
  FiChevronRight,
  FiShoppingCart,
  FiHeart,
  FiShare2,
  FiStar,
  FiTruck,
  FiPackage,
} from "react-icons/fi";
import { IoMdCheckmark } from "react-icons/io";
import { useProductStore } from "@/store/UseProductsStore";
import { Product } from "@/types";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/hooks/use-toast";

interface ProductDetailsProps {
  id: string;
}

// Dummy reviews data
const DUMMY_REVIEWS = [
  {
    id: 1,
    user: { name: "Sarah J.", avatar: "/avatars/sarah.jpg" },
    rating: 5,
    date: "2024-02-15",
    title: "Perfect fit and great quality",
    comment:
      "These shoes are exactly what I was looking for. The quality is outstanding and they fit perfectly. Highly recommend!",
    verified: true,
  },
  {
    id: 2,
    user: { name: "Mike R.", avatar: "/avatars/mike.jpg" },
    rating: 4,
    date: "2024-02-10",
    title: "Good value for money",
    comment:
      "Comfortable shoes, good build quality. Only giving 4 stars because delivery took longer than expected.",
    verified: true,
  },
  // Add more reviews...
];

// Dummy shipping info
const SHIPPING_INFO = {
  methods: [
    {
      name: "Standard Shipping",
      duration: "3-5 business days",
      price: "Free",
      icon: FiTruck,
    },
    {
      name: "Express Delivery",
      duration: "1-2 business days",
      price: "$12.99",
      icon: FiPackage,
    },
  ],
  policies: [
    "Free returns within 30 days",
    "Secure checkout with SSL encryption",
    "International shipping available",
  ],
};

export default function ProductDetails({ id }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [hoveredThumb, setHoveredThumb] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const getProductById = useProductStore((state) => state.getProductById);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const fetchProductsForClient = useProductStore(
    (state) => state.fetchProductsForClient
  );
  const { addToCart } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProductById]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await fetchProductsForClient({
          page: 1,
          isFeatured: true,
        });
        setFeaturedProducts(products.filter((p) => p.id !== id));
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      }
    };

    fetchFeaturedProducts();
  }, [fetchProductsForClient, id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.productImages[0].url,
        color: selectedColor,
        size: selectedSize,
        quantity: quantity,
      });

      setSelectedSize("");
      setSelectedColor("");
      setQuantity(1);

      toast({
        title: "Product is added to cart",
      });
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600">{error || "Product not found"}</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.productImages.length - 1 : prev - 1
    );
  };

  const isFlashSale = product.flashSale;
  const flashSaleProduct = isFlashSale ? product.flashSale : null;
  const currentPrice = flashSaleProduct
    ? flashSaleProduct.discountPrice
    : product.price;

  const availableSizes = Array.from(
    new Set(product.variations.map((v) => v.size))
  );
  const availableColors = Array.from(
    new Set(product.variations.map((v) => v.color))
  );

  const getStockForVariation = (size: string, color: string) => {
    const variation = product.variations.find(
      (v) => v.size === size && v.color === color
    );
    return variation?.stock || 0;
  };

  const updateQuantity = (newQuantity: number) => {
    const maxStock =
      selectedSize && selectedColor
        ? getStockForVariation(selectedSize, selectedColor)
        : 0;

    if (newQuantity > 0 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 text-sm text-gray-500">
        <span className="hover:text-black cursor-pointer">Home</span>
        <span className="mx-2">/</span>
        <span className="hover:text-black cursor-pointer">
          {product.category.name}
        </span>
        <span className="mx-2">/</span>
        <span className="text-black">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImageIndex}
                src={product.productImages[currentImageIndex].url}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>

            {/* Navigation arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={prevImage}
                className="bg-white/90 p-2 rounded-full shadow-lg"
              >
                <FiChevronLeft size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextImage}
                className="bg-white/90 p-2 rounded-full shadow-lg"
              >
                <FiChevronRight size={20} />
              </motion.button>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {product.productImages.map((image, index) => (
              <motion.button
                key={image.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredThumb(index)}
                onHoverEnd={() => setHoveredThumb(null)}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden
                  ${
                    currentImageIndex === index
                      ? "ring-2 ring-black"
                      : "ring-1 ring-gray-200"
                  }`}
              >
                <img
                  src={image.thumbnailUrl}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{product.brand}</span>
              <span>•</span>
              <span>{product.category.name}</span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            {isFlashSale ? (
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-red-600">
                  ${flashSaleProduct?.discountPrice}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  ${product.price}
                </span>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {flashSaleProduct?.discount}% OFF
                </motion.span>
              </div>
            ) : (
              <span className="text-3xl font-bold">${product.price}</span>
            )}
          </div>

          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Select Size</h3>
              <button className="text-sm text-gray-500 hover:text-black">
                Size Guide
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {availableSizes.map((size) => (
                <motion.button
                  key={size}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded-lg border transition-all duration-200
                    ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {size}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div className="space-y-4">
            <h3 className="font-medium">Select Color</h3>
            <div className="grid grid-cols-4 gap-2">
              {availableColors.map((color) => (
                <motion.button
                  key={color}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedColor(color || "")}
                  className={`py-3 rounded-lg border transition-all duration-200
                    ${
                      selectedColor === color
                        ? "border-black bg-black text-white"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {color}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <button
                onClick={() => updateQuantity(quantity - 1)}
                className="p-2 rounded-md bg-white border hover:border-black transition-colors"
              >
                -
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => updateQuantity(quantity + 1)}
                className="p-2 rounded-md bg-white border hover:border-black transition-colors"
              >
                +
              </button>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-black text-white py-4 rounded-lg font-medium
                  hover:bg-gray-900 transition-colors"
                onClick={handleAddToCart}
              >
                Add to Cart
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 rounded-lg border border-gray-200 hover:border-black transition-colors"
              >
                <FiHeart size={20} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 rounded-lg border border-gray-200 hover:border-black transition-colors"
              >
                <FiShare2 size={20} />
              </motion.button>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start border-b">
                <TabsTrigger value="description" className="text-lg">
                  Description
                </TabsTrigger>
                <TabsTrigger value="reviews" className="text-lg">
                  Reviews
                </TabsTrigger>
                <TabsTrigger value="shipping" className="text-lg">
                  Shipping
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Specifications */}
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4">
                      Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.specifications.map((spec) => (
                        <div
                          key={spec.id}
                          className="flex items-center p-4 bg-gray-50 rounded-lg"
                        >
                          <span className="font-medium">{spec.key}:</span>
                          <span className="ml-2 text-gray-600">
                            {spec.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-8">
                  {/* Reviews Summary */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold">Customer Reviews</h3>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FiStar
                              key={star}
                              className="w-5 h-5 text-yellow-400 fill-current"
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-gray-600">
                          Based on {DUMMY_REVIEWS.length} reviews
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors">
                      Write a Review
                    </button>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {DUMMY_REVIEWS.map((review) => (
                      <div key={review.id} className="border-b pb-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={review.user.avatar} />
                              <AvatarFallback>
                                {review.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">
                                {review.user.name}
                              </h4>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {Array.from({ length: review.rating }).map(
                                    (_, i) => (
                                      <FiStar
                                        key={i}
                                        className="w-4 h-4 text-yellow-400 fill-current"
                                      />
                                    )
                                  )}
                                </div>
                                {review.verified && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    Verified Purchase
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h5 className="font-medium mt-4">{review.title}</h5>
                        <p className="mt-2 text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="mt-6">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">
                      Shipping Methods
                    </h3>
                    <div className="grid gap-4">
                      {SHIPPING_INFO.methods.map((method) => (
                        <div
                          key={method.name}
                          className="flex items-center justify-between p-6 border rounded-xl hover:border-black transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <method.icon className="w-6 h-6" />
                            <div>
                              <h4 className="font-medium">{method.name}</h4>
                              <p className="text-sm text-gray-600">
                                Estimated delivery: {method.duration}
                              </p>
                            </div>
                          </div>
                          <span className="font-medium">{method.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-xl font-bold mb-4">
                      Shipping Policies
                    </h3>
                    <ul className="space-y-3">
                      {SHIPPING_INFO.policies.map((policy) => (
                        <li key={policy} className="flex items-center gap-2">
                          <IoMdCheckmark className="text-green-500" />
                          <span>{policy}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <div className="mt-24">
        <div className="border-b pb-8 mb-12">
          <h2 className="text-3xl font-bold">You May Also Like</h2>
          <p className="text-gray-600 mt-2">
            Discover similar items from our collection
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <motion.div
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                {/* Product Image */}
                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                  <motion.img
                    src={product.productImages[0]?.mediumUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-black truncate">
                    {product.name}
                  </h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-500">
                        {product.category.name}
                      </p>
                      <div className="flex items-center gap-2">
                        {product.flashSale ? (
                          <>
                            <span className="font-bold text-red-600">
                              ${product.flashSale.discountPrice}
                            </span>
                            <span className="text-sm text-gray-400 line-through">
                              ${product.price}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold">${product.price}</span>
                        )}
                      </div>
                    </div>

                    {/* Quick Add Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiShoppingCart size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-3">
                  {product.isFeatured && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Featured
                    </span>
                  )}
                  {product.isNewArrival && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      New
                    </span>
                  )}
                  {product.flashSale && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                      Sale
                    </span>
                  )}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
