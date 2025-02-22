"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import {
  ProductType,
  CLOTHING_SIZES,
  SHOE_SIZES,
  COLORS,
  ProductStatus,
  ProductVariation,
  ProductSpec,
} from "@/store/UseProductsStore";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { ImageUpload } from "@/components/ImageUpload";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FlashSaleConfig } from "@/components/super-admin/products/FlashSaleConfig";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/store/UseProductsStore";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Shirt, X } from "lucide-react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Clock } from "lucide-react";
import { protectProductFormAction } from "@/actions/product";
import Image from "next/image";
import { Upload } from "lucide-react";

interface FlashSale {
  enabled: boolean;
  discountPercentage: string;
  startDate: string;
  endDate: string;
}

// First, let's define our variation field types
interface VariationFields {
  sku: string;
  stock: number;
  price?: number;
  size?: string;
  color?: string;
  material?: string;
  style?: string;
  storage?: string;
  ram?: string;
  variant?: string;
  format?: string;
  language?: string;
}

// Update the product schema with proper typing
const productSchema = z.object({
  // Basic Details
  name: z.string().min(3, "Name must be at least 3 characters"),
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  baseStock: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Must be a valid number"),
  categoryId: z.string().min(1, "Please select a category"),

  // Feature Toggles
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),

  // Add these new fields to the schema
  images: z.array(z.instanceof(File)).default([]),
  variations: z
    .array(
      z.object({
        type: z.enum(["clothes", "shoes"]),
        size: z.string().optional(),
        color: z.string().optional(),
        stock: z.number().min(0, "Stock must be non-negative"),
      })
    )
    .default([]),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.string().min(1, "Value is required"),
        group: z.string().default("General"),
        order: z.number(),
      })
    )
    .default([]),

  // Flash Sale
  flashSale: z
    .object({
      enabled: z.boolean().default(false),
      discountPercentage: z.string().optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
    })
    .default({
      enabled: false,
      discountPercentage: "",
      startTime: "",
      endTime: "",
    }),

  // Add SKU to main product details if needed
  sku: z.string().optional(),
});

// Define the form type
type ProductFormValues = z.infer<typeof productSchema>;

// Add these interfaces
interface Variation {
  sku: string;
  stock: number;
  price?: number;
  size?: string;
  color?: string;
  material?: string;
  style?: string;
  storage?: string;
  ram?: string;
  variant?: string;
  format?: string;
  language?: string;
}

// Update the specification interface
interface SpecificationItem {
  key: string;
  value: string;
  order: number;
  group?: string;
}

export interface Category {
  id: string;
  name: string;
  type: ProductType;
  description?: string;
  image?: string;
}

// Define interface for form state
interface ProductFormState {
  name: string;
  brand: string;
  description: string;
  price: string;
  baseStock: string;
  categoryId: string;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  status: ProductStatus;
  variations: ProductVariation[];
  specifications: ProductSpec[];
  flashSale: {
    enabled: boolean;
    discountPercentage: string;
    startTime: string;
    endTime: string;
  };
}

const SuperAdminProductsAddPage = () => {
  const {
    createProduct,
    isLoading,
    fetchCategories,
    getProductById,
    updateProduct,
  } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<ProductType | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const isEditMode = !!productId;

  const [formState, setFormState] = useState<ProductFormState>({
    name: "",
    brand: "",
    description: "",
    price: "",
    baseStock: "",
    categoryId: "",
    isFeatured: false,
    isTrending: false,
    isNewArrival: false,
    status: ProductStatus.DRAFT,
    variations: [],
    specifications: [],
    flashSale: {
      enabled: false,
      discountPercentage: "",
      startTime: "",
      endTime: "",
    },
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (isEditMode && productId) {
        try {
          const product = await getProductById(productId);
          if (product) {
            setFormState({
              name: product.name,
              brand: product.brand,
              description: product.description,
              price: product.price.toString(),
              baseStock: product.baseStock.toString(),
              categoryId: product.categoryId,
              isFeatured: product.isFeatured,
              isTrending: product.isTrending,
              isNewArrival: product.isNewArrival,
              status: product.status,
              variations: product.variations || [],
              specifications: product.specifications || [],
              flashSale: product.flashSale
                ? {
                    enabled: true,
                    discountPercentage: product.flashSale.discount.toString(),
                    startTime: product.flashSale.startTime,
                    endTime: product.flashSale.endTime,
                  }
                : {
                    enabled: false,
                    discountPercentage: "",
                    startTime: "",
                    endTime: "",
                  },
            });
            setExistingImages(product.productImages || []);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast({
            title: "Error",
            description: "Failed to fetch product details",
            variant: "destructive",
          });
        }
      }
    };

    fetchProduct();
  }, [isEditMode, productId, getProductById, toast]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      brand: "",
      description: "",
      price: "",
      baseStock: "",
      categoryId: "",
      isFeatured: false,
      isTrending: false,
      isNewArrival: false,
      images: [],
      variations: [],
      specifications: [],
      flashSale: {
        enabled: false,
        discountPercentage: "",
        startTime: "",
        endTime: "",
      },
    },
  });

  // First, update the type state to be more specific
  const [variationType, setVariationType] = useState<
    "clothes" | "shoes" | null
  >(null);

  // Add state to track local loading
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast({
          title: "Failed to load Categories",
        });
      }
    };

    loadCategories();
  }, [fetchCategories]);

  useEffect(() => {
    console.log("Store loading state:", isLoading); // Debug log
  }, [isLoading]);

  // Get variation fields based on category
  const getVariationFields = (category: ProductType) => {
    switch (category) {
      case ProductType.FASHION:
        return ["size", "color", "material", "style"];
      case ProductType.ELECTRONICS:
        return ["storage", "ram", "color"];
      case ProductType.BEAUTY:
        return ["size", "variant"];
      case ProductType.HOME_DECOR:
        return ["size", "color", "material"];
      case ProductType.ACCESSORIES:
        return ["size", "color", "material"];
      case ProductType.BOOKS:
        return ["format", "language"];
      default:
        return [];
    }
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value as ProductType);
    form.setValue("categoryId", value);
    // Reset variations when category changes
    form.setValue("variations", []);
  };

  // Then update the addVariation function with a type guard
  const addVariation = () => {
    if (!variationType) return; // Don't add if no type is selected

    const currentVariations = form.getValues("variations");
    form.setValue("variations", [
      ...currentVariations,
      {
        type: variationType as "clothes" | "shoes", // Now we know it's not null
        size: "",
        color: variationType === "shoes" ? "" : undefined, // Only add color for shoes
        stock: 0,
      },
    ]);
  };

  // Update the addSpecification function
  const addSpecification = () => {
    const currentSpecs = form.getValues("specifications");
    form.setValue("specifications", [
      ...currentSpecs,
      {
        key: "",
        value: "",
        order: currentSpecs.length,
        group: "General",
      },
    ]);
  };

  // Handle image upload
  const handleImageUpload = (files: File[]) => {
    form.setValue("images", files);
  };

  const onSubmit = async (data: ProductFormValues) => {
    const checkFirstLevelFormSanitization = await protectProductFormAction();

    if (!checkFirstLevelFormSanitization.success) {
      toast({
        title: checkFirstLevelFormSanitization.error,
      });
      return;
    }
    try {
      setLocalLoading(true);
      const formData = new FormData();

      // Append basic product data
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "variations" &&
          key !== "specifications" &&
          key !== "flashSale"
        ) {
          formData.append(key, value.toString());
        }
      });

      // Append variations
      formData.append("variations", JSON.stringify(data.variations));

      // Append specifications
      formData.append("specifications", JSON.stringify(data.specifications));

      // Append flash sale data
      formData.append("flashSale", JSON.stringify(data.flashSale));

      // Append new images
      data.images.forEach((image) => {
        formData.append("images", image);
      });

      // Append existing image IDs to keep
      formData.append(
        "existingImages",
        JSON.stringify(existingImages.map((img) => img.id))
      );

      const response = await (isEditMode
        ? updateProduct(productId, formData)
        : createProduct(formData));

      if (response) {
        toast({
          title: "Success",
          description: "Product created successfully",
        });
        router.push("/super-admin/products/list");
      }
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setLocalLoading(false);
    }
  };

  // Add helper function to get required variation fields based on category
  const getRequiredVariationFields = (categoryType: ProductType) => {
    switch (categoryType) {
      case ProductType.FASHION:
        return ["size"];
      case ProductType.SHOES:
        return ["size", "color"];
      case ProductType.ELECTRONICS:
        return ["size"]; // For storage capacity
      default:
        return [];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/50 dark:from-background dark:to-background/50"
    >
      <div className="container max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Fill in the details to add a new product to your inventory
            </p>
          </div>
        </motion.div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {/* Basic Information Card */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="group"
              >
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-primary/5 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-primary rounded-full" />
                      <CardTitle className="text-2xl">
                        Basic Information
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 },
                      }}
                      className="space-y-2"
                    >
                      <Label className="text-base">Product Name</Label>
                      <Input
                        {...form.register("name")}
                        className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-300"
                        placeholder="Enter product name"
                      />
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        show: { opacity: 1, x: 0 },
                      }}
                      className="space-y-2"
                    >
                      <Label className="text-base">Brand</Label>
                      <Input
                        {...form.register("brand")}
                        className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-300"
                        placeholder="Enter brand name"
                      />
                    </motion.div>

                    <motion.div className="md:col-span-2 space-y-2">
                      <Label className="text-base">Description</Label>
                      <Textarea
                        {...form.register("description")}
                        className="min-h-[120px] bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-300"
                        placeholder="Enter product description"
                      />
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pricing & Stock Card */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="mt-8 group"
              >
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-primary/5 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-primary rounded-full" />
                      <CardTitle className="text-2xl">
                        Pricing & Stock
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 grid gap-6 md:grid-cols-2">
                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        show: { opacity: 1, x: 0 },
                      }}
                      className="space-y-2"
                    >
                      <Label className="text-base">Price</Label>
                      <Input
                        {...form.register("price")}
                        type="number"
                        step="0.01"
                        className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-300"
                        placeholder="0.00"
                      />
                    </motion.div>

                    <motion.div
                      variants={{
                        hidden: { opacity: 0, x: 20 },
                        show: { opacity: 1, x: 0 },
                      }}
                      className="space-y-2"
                    >
                      <Label className="text-base">Base Stock</Label>
                      <Input
                        {...form.register("baseStock")}
                        type="number"
                        className="h-12 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-300"
                        placeholder="0"
                      />
                    </motion.div>

                    <motion.div className="md:col-span-2 space-y-2">
                      <Label className="text-base">Category</Label>
                      <Select
                        {...form.register("categoryId")}
                        onValueChange={(value) => {
                          form.setValue("categoryId", value);
                          setSelectedCategory(
                            categories.find((cat) => cat.id === value)?.type ||
                              null
                          );
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Images Upload Card */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="mt-8"
              >
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-primary/5 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-primary rounded-full" />
                      <CardTitle className="text-2xl">Product Images</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {isEditMode && existingImages.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-muted-foreground mb-2">Existing Images:</p>
                          <div className="flex flex-wrap gap-2">
                            {existingImages.map((image, index) => (
                              <div key={index} className="relative">
                                <Image
                                  src={image.url}
                                  alt={`Product image ${index + 1}`}
                                  width={80}
                                  height={80}
                                  className="h-20 w-20 object-cover rounded-md"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            form.setValue("images", files);
                          }}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex flex-col items-center"
                        >
                          <Upload className="h-10 w-10 text-gray-400" />
                          <span className="mt-2 text-sm text-gray-500">
                            {isEditMode ? "Upload new images" : "Upload product images"}
                          </span>
                        </label>
                      </div>
                      {form.watch("images").length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">New Images:</p>
                          <div className="flex flex-wrap gap-2">
                            {form.watch("images").map((file, index) => (
                              <div key={index} className="relative">
                                <Image
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index + 1}`}
                                  width={80}
                                  height={80}
                                  className="h-20 w-20 object-cover rounded-md"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Variations Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="mt-8"
              >
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-primary/5 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-primary rounded-full" />
                      <CardTitle className="text-2xl">
                        Product Variations
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <VariationsSection form={form} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Specifications Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="mt-8"
              >
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-primary/5 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-primary rounded-full" />
                      <CardTitle className="text-2xl">Specifications</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <SpecificationsSection form={form} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Flash Sale Section */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="mt-8"
              >
                <Card className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="bg-primary/5 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-1 bg-primary rounded-full" />
                      <CardTitle className="text-2xl">Flash Sale</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <FlashSaleSection form={form} />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 },
                }}
                className="mt-8 flex justify-end gap-4"
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="h-12 px-6"
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        ⌛
                      </motion.div>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </div>
                  ) : (
                    isEditMode ? "Update Product" : "Create Product"
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
};

const VariationsSection = ({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) => {
  const [variationType, setVariationType] = useState<
    "clothes" | "shoes" | null
  >(null);
  const selectedCategory = form.watch("categoryId");

  const addVariation = () => {
    if (!variationType) return;
    const currentVariations = form.getValues("variations");
    form.setValue("variations", [
      ...currentVariations,
      {
        type: variationType,
        size: "",
        color: variationType === "shoes" ? "" : undefined,
        stock: 0,
      },
    ]);
  };

  const removeVariation = (index: number) => {
    const currentVariations = form.getValues("variations");
    form.setValue(
      "variations",
      currentVariations.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Button
          type="button"
          onClick={() => setVariationType("clothes")}
          variant={variationType === "clothes" ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          <Shirt className="w-4 h-4" />
          Clothes
        </Button>
        <Button
          type="button"
          onClick={() => setVariationType("shoes")}
          variant={variationType === "shoes" ? "default" : "outline"}
          className="flex items-center gap-2"
        >
          Shoes
        </Button>
      </div>

      {variationType && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Button type="button" onClick={addVariation} className="mb-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Variation
          </Button>

          <div className="space-y-4">
            {form.watch("variations")?.map((variation, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4 border rounded-lg relative group hover:border-primary transition-all"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeVariation(index)}
                >
                  <X className="w-4 h-4 text-destructive" />
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Size</Label>
                    <Select
                      value={variation.size}
                      onValueChange={(value) => {
                        const variations = form.getValues("variations");
                        variations[index].size = value;
                        form.setValue("variations", variations);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {(variationType === "clothes"
                          ? CLOTHING_SIZES
                          : SHOE_SIZES
                        ).map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {variationType === "shoes" && (
                    <div>
                      <Label>Color</Label>
                      <Select
                        value={variation.color}
                        onValueChange={(value) => {
                          const variations = form.getValues("variations");
                          variations[index].color = value;
                          form.setValue("variations", variations);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLORS.map((color) => (
                            <SelectItem key={color} value={color}>
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{
                                    backgroundColor: color.toLowerCase(),
                                  }}
                                />
                                {color}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div>
                    <Label>Stock</Label>
                    <Input
                      type="number"
                      min="0"
                      value={variation.stock}
                      onChange={(e) => {
                        const variations = form.getValues("variations");
                        variations[index].stock = parseInt(e.target.value);
                        form.setValue("variations", variations);
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

const SpecificationsSection = ({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) => {
  const specGroups = [
    "General",
    "Technical",
    "Physical",
    "Performance",
    "Other",
  ];

  const addSpecification = () => {
    const currentSpecs = form.getValues("specifications");
    form.setValue("specifications", [
      ...currentSpecs,
      {
        key: "",
        value: "",
        group: "General",
        order: currentSpecs.length,
      },
    ]);
  };

  const removeSpecification = (index: number) => {
    const currentSpecs = form.getValues("specifications");
    form.setValue(
      "specifications",
      currentSpecs.filter((_, i) => i !== index)
    );
  };

  const moveSpecification = (from: number, to: number) => {
    const specs = form.getValues("specifications");
    const [removed] = specs.splice(from, 1);
    specs.splice(to, 0, removed);
    specs.forEach((spec, index) => {
      spec.order = index;
    });
    form.setValue("specifications", specs);
  };

  return (
    <div className="space-y-6">
      <motion.div className="flex justify-between items-center">
        <Button
          type="button"
          onClick={addSpecification}
          className="bg-primary/10 hover:bg-primary/20 text-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Specification
        </Button>
      </motion.div>

      <AnimatePresence mode="popLayout">
        {specGroups.map((group) => {
          const groupSpecs =
            form
              .watch("specifications")
              ?.filter((spec) => spec.group === group) || [];

          if (groupSpecs.length === 0) return null;

          return (
            <motion.div
              key={group}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold text-primary/80">{group}</h3>

              {groupSpecs.map((spec, index) => {
                const actualIndex = form
                  .getValues("specifications")
                  .findIndex((s) => s === spec);

                return (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="group relative grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="space-y-2">
                      <Label>Key</Label>
                      <Input
                        value={spec.key}
                        onChange={(e) => {
                          const specs = form.getValues("specifications");
                          specs[actualIndex].key = e.target.value;
                          form.setValue("specifications", specs);
                        }}
                        placeholder="e.g., Material, Weight, Dimensions"
                        className="bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Value</Label>
                      <Input
                        value={spec.value}
                        onChange={(e) => {
                          const specs = form.getValues("specifications");
                          specs[actualIndex].value = e.target.value;
                          form.setValue("specifications", specs);
                        }}
                        placeholder="e.g., Cotton, 200g, 10x20x30cm"
                        className="bg-background/50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Group</Label>
                      <Select
                        value={spec.group}
                        onValueChange={(value) => {
                          const specs = form.getValues("specifications");
                          specs[actualIndex].group = value;
                          form.setValue("specifications", specs);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {specGroups.map((group) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          moveSpecification(actualIndex, actualIndex - 1)
                        }
                        disabled={actualIndex === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          moveSpecification(actualIndex, actualIndex + 1)
                        }
                        disabled={
                          actualIndex ===
                          form.getValues("specifications").length - 1
                        }
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSpecification(actualIndex)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

const FlashSaleSection = ({
  form,
}: {
  form: UseFormReturn<ProductFormValues>;
}) => {
  const basePrice = form.watch("price");
  const flashSale = form.watch("flashSale");

  const calculateDiscountedPrice = (price: string, discount: string) => {
    const baseAmount = parseFloat(price) || 0;
    const discountPercent = parseFloat(discount) || 0;
    return baseAmount - baseAmount * (discountPercent / 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label>Enable Flash Sale</Label>
          <div className="text-sm text-muted-foreground">
            Set up a time-limited discount for this product
          </div>
        </div>
        <Switch
          checked={flashSale.enabled}
          onCheckedChange={(checked) => {
            form.setValue("flashSale.enabled", checked);
          }}
        />
      </div>

      <AnimatePresence>
        {flashSale.enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6 pt-4"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Discount Percentage</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={flashSale.discountPercentage}
                    onChange={(e) => {
                      form.setValue(
                        "flashSale.discountPercentage",
                        e.target.value
                      );
                    }}
                    className="pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Start Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !flashSale.startTime && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {flashSale.startTime ? (
                        format(new Date(flashSale.startTime), "PPP HH:mm")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        flashSale.startTime
                          ? new Date(flashSale.startTime)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const datetime = new Date(date);
                          datetime.setHours(0, 0, 0, 0);
                          form.setValue(
                            "flashSale.startTime",
                            datetime.toISOString()
                          );
                        }
                      }}
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const date = flashSale.startTime
                            ? new Date(flashSale.startTime)
                            : new Date();
                          date.setHours(
                            parseInt(hours),
                            parseInt(minutes),
                            0,
                            0
                          );
                          form.setValue(
                            "flashSale.startTime",
                            date.toISOString()
                          );
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Time</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !flashSale.endTime && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {flashSale.endTime ? (
                        format(new Date(flashSale.endTime), "PPP HH:mm")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        flashSale.endTime
                          ? new Date(flashSale.endTime)
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const datetime = new Date(date);
                          datetime.setHours(23, 59, 59, 999);
                          form.setValue(
                            "flashSale.endTime",
                            datetime.toISOString()
                          );
                        }
                      }}
                    />
                    <div className="p-3 border-t">
                      <Input
                        type="time"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const date = flashSale.endTime
                            ? new Date(flashSale.endTime)
                            : new Date();
                          date.setHours(
                            parseInt(hours),
                            parseInt(minutes),
                            0,
                            0
                          );
                          form.setValue(
                            "flashSale.endTime",
                            date.toISOString()
                          );
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {basePrice && flashSale.discountPercentage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-lg bg-primary/10 border border-primary"
              >
                <h4 className="text-sm font-medium mb-2">Price Preview</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Original Price:
                    </span>
                    <div className="text-lg font-semibold">
                      ${parseFloat(basePrice).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Discounted Price:
                    </span>
                    <div className="text-lg font-semibold text-primary">
                      $
                      {calculateDiscountedPrice(
                        basePrice,
                        flashSale.discountPercentage
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuperAdminProductsAddPage;
