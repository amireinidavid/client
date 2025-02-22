"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductType, ProductStatus } from "@/store/UseProductsStore";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { brands } from "@/utils/config";
const variationSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number",
  }),
  price: z.string().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  style: z.string().optional(),
  storage: z.string().optional(),
  ram: z.string().optional(),
  variant: z.string().optional(),
  format: z.string().optional(),
  language: z.string().optional(),
});

const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  brand: z.string().min(2, "Brand name must be at least 2 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  baseStock: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Base stock must be a non-negative number",
    }),
  categoryId: z.string().min(1, "Please select a category"),
  status: z.nativeEnum(ProductStatus),
  isFeatured: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  variations: z.array(variationSchema),
});

const categoryOptions = Object.entries(ProductType).map(([key, value]) => ({
  id: key,
  value: value,
  label: value.replace(/_/g, " "),
}));

const statusOptions = Object.entries(ProductStatus).map(([key, value]) => ({
  id: key,
  value: value,
  label: value.replace(/_/g, " "),
}));

// Define variation fields for each category
const categoryVariationFields = {
  [ProductType.FASHION]: ["size", "color", "material", "style"],
  [ProductType.ELECTRONICS]: ["storage", "ram", "color"],
  [ProductType.BEAUTY]: ["size", "variant"],
  [ProductType.HOME_DECOR]: ["size", "color", "material"],
  [ProductType.ACCESSORIES]: ["size", "color", "material"],
  [ProductType.BOOKS]: ["format", "language"],
};

interface ProductFormProps {
  formState: {
    name: string;
    brand: string;
    description: string;
    categoryId: string;
    price: string;
    baseStock: string;
    status: string;
    isFeatured: boolean;
    isTrending: boolean;
    isNewArrival: boolean;
  };
  setFormState: (state: any) => void;
}

export function ProductForm({ formState, setFormState }: ProductFormProps) {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormState((prev: any) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Product Name</Label>
        <Input
          name="name"
          value={formState.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
          className="mt-1.5"
        />
      </div>

      <div>
        <Label>Brand</Label>
        <Select
          value={formState.brand}
          onValueChange={(value) => handleSelectChange("brand", value)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand.toLowerCase()}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          name="description"
          value={formState.description}
          onChange={handleInputChange}
          placeholder="Enter product description"
          className="mt-1.5 min-h-[100px]"
        />
      </div>

      <div>
        <Label>Category</Label>
        <Select
          value={formState.categoryId}
          onValueChange={(value) => handleSelectChange("categoryId", value)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ProductType).map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Price</Label>
          <Input
            name="price"
            type="number"
            value={formState.price}
            onChange={handleInputChange}
            placeholder="Enter price"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label>Base Stock</Label>
          <Input
            name="baseStock"
            type="number"
            value={formState.baseStock}
            onChange={handleInputChange}
            placeholder="Enter base stock"
            className="mt-1.5"
          />
        </div>
      </div>

      <div>
        <Label>Status</Label>
        <Select
          value={formState.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(ProductStatus).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Featured Product</Label>
          <Switch
            checked={formState.isFeatured}
            onCheckedChange={(checked) =>
              handleSwitchChange("isFeatured", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Trending Product</Label>
          <Switch
            checked={formState.isTrending}
            onCheckedChange={(checked) =>
              handleSwitchChange("isTrending", checked)
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>New Arrival</Label>
          <Switch
            checked={formState.isNewArrival}
            onCheckedChange={(checked) =>
              handleSwitchChange("isNewArrival", checked)
            }
          />
        </div>
      </div>
    </div>
  );
}
