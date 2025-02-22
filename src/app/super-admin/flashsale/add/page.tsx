"use client";

import { useState, useEffect } from "react";
import { useHomepageStore } from "@/store/useHomepageStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Percent,
  Tag,
  Calendar,
  AlertCircle,
  Timer,
  ShoppingBag,
  Sparkles,
  Plus,
  X,
  Search,
  Package,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Product } from "@/types/product";

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  discountPercentage: number;
  discountPrice: number;
  fixedDiscount: number;
  discountType: "PERCENTAGE" | "FIXED";
  order: number;
  image?: string;
  stock: number;
}

export default function AddFlashSaleConfigPage() {
  const { createFlashSaleConfig, fetchProducts } = useHomepageStore();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    startDate: "",
    endDate: "",
    bannerImage: null as File | null,
    isActive: true,
    discountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(
          fetchedProducts.map((product) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            rating: product.rating || undefined,
            productImages: product.productImages,
            brand: product.brand,
            description: product.description,
            baseStock: product.baseStock,
            soldCount: product.soldCount,
            status: product.status,
            isFeatured: product.isFeatured,
            isTrending: product.isTrending,
            isNewArrival: product.isNewArrival,
            categoryId: product.categoryId,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
          }))
        );
      } catch (error) {
        toast.error("Failed to load products");
      }
    };
    loadProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductSelect = (product: Product) => {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          discountPercentage: 0,
          discountPrice: product.price,
          fixedDiscount: 0,
          discountType: "PERCENTAGE",
          order: prev.length,
          image: product.productImages?.[0]?.url,
          stock: product.baseStock,
        },
      ];
    });
  };

  const handleDiscountChange = (
    productId: string,
    value: number,
    type: "PERCENTAGE" | "FIXED"
  ) => {
    setSelectedProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const discountPrice =
            type === "PERCENTAGE"
              ? p.price * (1 - value / 100)
              : p.price - value;

          return {
            ...p,
            discountType: type,
            discountPercentage:
              type === "PERCENTAGE" ? value : (value / p.price) * 100,
            fixedDiscount: type === "FIXED" ? value : p.price * (value / 100),
            discountPrice: Math.max(0, discountPrice),
          };
        }
        return p;
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    setIsLoading(true);
    try {
      // Create a regular object instead of FormData
      const dataToSend = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description || "",
        startTime: new Date(formData.startDate).toISOString(),
        endTime: new Date(formData.endDate).toISOString(),
        isActive: formData.isActive,
        products: selectedProducts.map((product) => ({
          id: product.id,
          price: product.price,
          discountPrice: product.discountPrice,
          discountPercentage: product.discountPercentage,
          fixedDiscount: product.fixedDiscount,
          discountType: product.discountType,
          order: product.order,
          stock: product.stock,
        })),
      };

      console.log("Sending data:", dataToSend); // Debug log
      await createFlashSaleConfig(dataToSend);
      toast.success("Flash sale created successfully!");
      router.push("/super-admin/flashsale");
    } catch (error) {
      console.error("Error creating flash sale:", error);
      toast.error("Failed to create flash sale");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate time remaining for preview
  const now = new Date();
  const startDate = formData.startDate ? new Date(formData.startDate) : now;
  const endDate = formData.endDate ? new Date(formData.endDate) : now;
  const isLive = now >= startDate && now <= endDate;
  const timeRemaining = endDate.getTime() - now.getTime();
  const hoursRemaining = Math.max(
    0,
    Math.floor(timeRemaining / (1000 * 60 * 60))
  );

  return (
    <div className="container mx-auto py-10 px-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Preview */}
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-purple-900 to-indigo-900 border-0 shadow-xl">
              <CardHeader>
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Flash Sale Preview
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Title Section */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-white">
                      {formData.title || "Flash Sale Title"}
                    </h2>
                    <p className="text-gray-300">
                      {formData.subtitle || "Flash sale subtitle goes here"}
                    </p>
                  </div>

                  {/* Timer Display */}
                  <div className="bg-white/10 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Timer className="h-5 w-5 text-yellow-400" />
                        <span className="text-white font-medium">
                          Time Remaining:
                        </span>
                      </div>
                      <Badge
                        variant={formData.isActive ? "default" : "secondary"}
                        className={cn(
                          "animate-pulse",
                          formData.isActive && "bg-green-500 hover:bg-green-600"
                        )}
                      >
                        {formData.isActive ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </div>
                    <div className="mt-3 text-3xl font-bold text-white">
                      {formData.endDate
                        ? format(new Date(formData.endDate), "PPP")
                        : "Set end date"}
                    </div>
                  </div>

                  {/* Selected Products Preview */}
                  <div className="space-y-4">
                    <h4 className="text-white font-medium">
                      Selected Products
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <AnimatePresence>
                        {selectedProducts.map((product) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative group"
                          >
                            <div className="bg-white/10 rounded-lg p-3 space-y-2">
                              <div className="relative h-24 w-full rounded-md overflow-hidden">
                                {product.image ? (
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Package className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div className="space-y-1">
                                <h5 className="text-sm text-white font-medium truncate">
                                  {product.name}
                                </h5>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-gray-300 line-through">
                                    ${product.price}
                                  </span>
                                  <span className="text-sm font-bold text-green-400">
                                    ${product.discountPrice}
                                  </span>
                                </div>
                              </div>
                              <Badge className="absolute -top-2 -right-2 bg-red-500">
                                -{product.discountPercentage}%
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Configuration */}
          <div className="space-y-6">
            {/* Flash Sale Details */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Flash Sale Details</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      placeholder="Enter flash sale title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      placeholder="Enter flash sale subtitle"
                      value={formData.subtitle}
                      onChange={(e) =>
                        setFormData({ ...formData, subtitle: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Enter flash sale description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        type="datetime-local"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            startDate: e.target.value,
                          })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        type="datetime-local"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData({ ...formData, endDate: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Banner Image Upload */}
                <div className="space-y-2">
                  <Label>Banner Image</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bannerImage: e.target.files?.[0] || null,
                      })
                    }
                  />
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between">
                  <Label>Active Status</Label>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isActive: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Add Products</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Product List */}
                  <ScrollArea className="h-[300px] border rounded-md p-4">
                    <div className="space-y-2">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-md overflow-hidden">
                              {product.productImages?.[0]?.url ? (
                                <Image
                                  src={product.productImages[0].url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <Package className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-gray-500">
                                ${product.price}
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleProductSelect(product)}
                            disabled={selectedProducts.some(
                              (p) => p.id === product.id
                            )}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Selected Products */}
                  {selectedProducts.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium">Selected Products</h4>
                      <div className="space-y-2">
                        {selectedProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative h-10 w-10 rounded-md overflow-hidden">
                                {product.image ? (
                                  <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <Package className="h-4 w-4 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-2">
                                    <select
                                      value={product.discountType}
                                      onChange={(e) =>
                                        handleDiscountChange(
                                          product.id,
                                          product.discountType === "PERCENTAGE"
                                            ? product.discountPercentage
                                            : product.fixedDiscount,
                                          e.target.value as
                                            | "PERCENTAGE"
                                            | "FIXED"
                                        )
                                      }
                                      className="h-8 rounded-md border border-gray-300"
                                    >
                                      <option value="PERCENTAGE">%</option>
                                      <option value="FIXED">$</option>
                                    </select>
                                    <Input
                                      type="number"
                                      placeholder={
                                        product.discountType === "PERCENTAGE"
                                          ? "Discount %"
                                          : "Discount $"
                                      }
                                      value={
                                        product.discountType === "PERCENTAGE"
                                          ? product.discountPercentage
                                          : product.fixedDiscount
                                      }
                                      onChange={(e) =>
                                        handleDiscountChange(
                                          product.id,
                                          parseFloat(e.target.value),
                                          product.discountType
                                        )
                                      }
                                      className="w-24 h-8"
                                    />
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    ${product.discountPrice.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setSelectedProducts((prev) =>
                                  prev.filter((p) => p.id !== product.id)
                                )
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Creating Flash Sale...
                </div>
              ) : (
                "Create Flash Sale"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
