"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  Product,
  ProductType,
  useProductStore,
} from "@/store/UseProductsStore";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  Eye,
  Star,
  Zap,
  Tag,
  Clock,
  Package,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

function SuperAdminProductListingPage() {
  const { products, isLoading, fetchAllProductsForAdmin, deleteProduct } =
    useProductStore();
  const { toast } = useToast();
  const router = useRouter();
  const productFetchRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!productFetchRef.current) {
      fetchAllProductsForAdmin();
      productFetchRef.current = true;
    }
  }, [fetchAllProductsForAdmin]);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory || product.category.type === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      return (
        multiplier *
        (a[sortField as keyof Product] > b[sortField as keyof Product] ? 1 : -1)
      );
    });
  console.log(filteredProducts, "filted products");

  async function handleDeleteProduct(getId: string) {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const result = await deleteProduct(getId);
      if (result) {
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        fetchAllProductsForAdmin();
      }
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/50 p-6"
    >
      <div className="max-w-[1400px] mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Product Inventory
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and monitor your product catalog
            </p>
          </div>
          <Button
            onClick={() => router.push("/super-admin/products/add")}
            className="bg-primary/10 hover:bg-primary/20 text-primary"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </motion.div>

        <Card className="border-none shadow-lg">
          <CardHeader className="bg-primary/5 border-b border-border/50">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-full md:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSelectedCategory(null)}>
                      All Categories
                    </DropdownMenuItem>
                    {Object.values(ProductType).map((type) => (
                      <DropdownMenuItem
                        key={type}
                        onClick={() => setSelectedCategory(type)}
                      >
                        {type}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {[
                      { label: "Date", value: "createdAt" },
                      { label: "Name", value: "name" },
                      { label: "Price", value: "price" },
                      { label: "Stock", value: "baseStock" },
                    ].map((sort) => (
                      <DropdownMenuItem
                        key={sort.value}
                        onClick={() => {
                          if (sortField === sort.value) {
                            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                          } else {
                            setSortField(sort.value);
                            setSortOrder("desc");
                          }
                        }}
                      >
                        {sort.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Details</TableHead>
                    <TableHead>Category & Status</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Pricing</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredProducts.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="group hover:bg-muted/50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted">
                              {product.productImages &&
                              product.productImages[0] ? (
                                <Image
                                  src={product.productImages[0].url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  loading="lazy"
                                  sizes="(max-width: 64px) 100vw, 64px"
                                  quality={75}
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/placeholder-image.png"; // Add a placeholder image in your public folder
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                  <Package className="h-8 w-8 text-muted-foreground/50" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {product.brand}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Added{" "}
                                {format(
                                  new Date(product.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="mb-1">
                            {product.category.type}
                          </Badge>
                          <Badge
                            variant={
                              product.status === "PUBLISHED"
                                ? "default"
                                : "secondary"
                            }
                            className="ml-2"
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span>{product.baseStock} in stock</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4 text-muted-foreground" />
                              <span>{product.soldCount} sold</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              ${product.price.toFixed(2)}
                            </p>
                            {product.flashSale && (
                              <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm text-muted-foreground">
                                  {product.flashSale.discount}% OFF
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {product.isFeatured && (
                              <Star className="h-4 w-4 text-yellow-500" />
                            )}
                            {product.isTrending && (
                              <Zap className="h-4 w-4 text-blue-500" />
                            )}
                            {product.isNewArrival && (
                              <Clock className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() =>
                                router.push(
                                  `/super-admin/products/${product.id}`
                                )
                              }
                              variant="ghost"
                              size="icon"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() =>
                                router.push(
                                  `/super-admin/products/add?id=${product.id}`
                                )
                              }
                              variant="ghost"
                              size="icon"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              onClick={() => handleDeleteProduct(product.id)}
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive/80"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export default SuperAdminProductListingPage;
