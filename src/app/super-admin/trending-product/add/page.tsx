"use client";

import { useEffect, useState } from "react";
import { useHomepageStore } from "@/store/useHomepageStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal } from "lucide-react";

export default function TrendingProductsPage() {
  const { allProducts, fetchAllProducts, updateTrendingProducts } =
    useHomepageStore();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "stock">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const initializePage = async () => {
      setIsLoading(true);
      try {
        await fetchAllProducts();
      } catch (error) {
        toast.error("Failed to fetch products");
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [fetchAllProducts]);

  // Initialize selected products with currently trending products
  useEffect(() => {
    const trendingProductIds = allProducts
      .filter((product) => product.isTrending)
      .map((product) => product.id);
    setSelectedProducts(trendingProductIds);
  }, [allProducts]);

  const handleProductToggle = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSaveChanges = async () => {
    try {
      await updateTrendingProducts(selectedProducts);
      toast.success("Trending products updated successfully");

      // Refresh the products list to get the latest state
      await fetchAllProducts();
    } catch (error) {
      toast.error("Failed to update trending products");
    }
  };

  // Get unique categories
  const categories = [
    ...new Set(allProducts.map((product) => product.category.name)),
  ];

  // Filter and sort products
  const filteredProducts = allProducts
    .filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        product.category.name === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const order = sortOrder === "asc" ? 1 : -1;
      if (sortBy === "price") return (a.price - b.price) * order;
      if (sortBy === "stock") return (a.baseStock - b.baseStock) * order;
      return a.name.localeCompare(b.name) * order;
    });

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="animate-pulse flex space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                <div className="space-y-4">
                  <div className="h-4 w-[200px] bg-gray-300 dark:bg-gray-700 rounded" />
                  <div className="h-4 w-[150px] bg-gray-300 dark:bg-gray-700 rounded" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-0 shadow-xl">
        <CardHeader className="flex flex-col space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Trending Products
              </h2>
              <p className="text-muted-foreground mt-2">
                Select products to trend on your homepage
              </p>
            </div>
            <Button
              onClick={handleSaveChanges}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg"
            >
              Save Changes
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-inner">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-transparent"
              />
            </div>

            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px] bg-transparent">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value: "name" | "price" | "stock") =>
                  setSortBy(value)
                }
              >
                <SelectTrigger className="w-[180px] bg-transparent">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
                className="w-10"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 overflow-hidden ${
                  selectedProducts.includes(product.id)
                    ? "ring-2 ring-primary shadow-primary/30"
                    : ""
                }`}
                onClick={() => handleProductToggle(product.id)}
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative">
                    <Image
                      src={
                        product.productImages[0]?.mediumUrl ||
                        "/placeholder.png"
                      }
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    {selectedProducts.includes(product.id) && (
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-white">
                          Trending
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate text-lg">
                      {product.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {product.category.name}
                    </p>
                    <div className="flex justify-between items-center mt-3">
                      <p className="font-medium text-lg text-primary">
                        ${(product.price / 100).toFixed(2)}
                      </p>
                      <Badge variant="secondary">
                        Stock: {product.baseStock}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
