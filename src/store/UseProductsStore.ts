import { API_ROUTES } from "@/utils/api";
import axios from "axios";
import { create } from "zustand";
import { z } from "zod";
import type { Product } from "@/types";
export type { Product };

// Add this at the top of the file
const axiosInstance = axios.create({
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Export all interfaces and types
export enum ProductType {
  FASHION = "FASHION",
  ELECTRONICS = "ELECTRONICS",
  BEAUTY = "BEAUTY",
  SHOES = "SHOES",
  HOME_DECOR = "HOME_DECOR",
  ACCESSORIES = "ACCESSORIES",
  BOOKS = "BOOKS",
}

export enum ProductStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

export interface ProductVariation {
  id: string;
  type: "clothes" | "shoes";
  size: string;
  color?: string;
  stock: number;
}

export interface ProductSpec {
  id: string;
  key: string;
  value: string;
  group?: string;
  order: number;
}

export interface FlashSale {
  id: string;
  discount: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface FlashSaleProduct {
  id: string;
  discountPrice: number;
  order: number;
}

export interface ProductImage {
  id: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
  thumbnailUrl: string;
  mediumUrl: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  type: ProductType;
  description: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  type?: ProductType;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  status?: ProductStatus;
}

interface SizeGuideType {
  CLOTHING: "CLOTHING";
  SHOES: "SHOES";
  ACCESSORIES: "ACCESSORIES";
}

interface SizeGuide {
  id: string;
  type: SizeGuideType;
  sizeChart: Record<string, any>;
  measurements: string[];
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  categories: Category[];

  // Admin Actions
  fetchAllProductsForAdmin: () => Promise<void>;
  createProduct: (productData: FormData) => Promise<Product>;
  updateProduct: (id: string, productData: FormData) => Promise<Product>;
  deleteProduct: (id: string) => Promise<boolean>;

  // Client Actions
  getProductById: (id: string) => Promise<Product | null>;
  fetchProductsForClient: (params: {
    page: number;
    sortBy?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    isFeatured?: boolean;
  }) => Promise<Product[]>;
  setCurrentPage: (page: number) => void;

  // Flash Sale Actions
  createFlashSale: (
    productId: string,
    flashSaleData: Partial<FlashSale>
  ) => Promise<void>;
  updateFlashSale: (
    id: string,
    flashSaleData: Partial<FlashSale>
  ) => Promise<void>;

  // Cache Management
  clearProductCache: () => Promise<void>;

  // Category Actions
  fetchCategories: () => Promise<Category[]>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  categories: [],

  fetchAllProductsForAdmin: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-admin-products`,
        {
          withCredentials: true,
        }
      );
      set({ products: response.data, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to fetch products",
        isLoading: false,
      });
    }
  },

  createProduct: async (productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `${API_ROUTES.PRODUCTS}/create-new-product`,
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      await get().clearProductCache();
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create product",
        isLoading: false,
      });
      throw error;
    }
  },

  updateProduct: async (id: string, productData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(
        `${API_ROUTES.PRODUCTS}/${id}`,
        productData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      await get().clearProductCache();
      set({ isLoading: false });
      return response.data;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update product",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteProduct: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_ROUTES.PRODUCTS}/${id}`, {
        withCredentials: true,
      });
      await get().clearProductCache();
      set({ isLoading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to delete product",
        isLoading: false,
      });
      return false;
    }
  },

  getProductById: async (id: string) => {
    try {
      const response = await axiosInstance.get(`${API_ROUTES.PRODUCTS}/${id}`);
      console.log("API Response:", response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  fetchProductsForClient: async (params: {
    page: number;
    sortBy?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
  }) => {
    try {
      set({ isLoading: true });
      const response = await axios.get(
        `${API_ROUTES.PRODUCTS}/fetch-client-products`,
        {
          params,
          withCredentials: true,
        }
      );

      const newProducts = response.data.products as Product[];

      set((state) => ({
        products:
          params.page === 1 ? newProducts : [...state.products, ...newProducts],
        isLoading: false,
        currentPage: params.page,
        totalPages: response.data.totalPages,
        totalProducts: response.data.totalProducts,
      }));

      return newProducts;
    } catch (error) {
      set({ error: "Failed to fetch products", isLoading: false });
      return [];
    }
  },

  createFlashSale: async (
    productId: string,
    flashSaleData: Partial<FlashSale>
  ) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(
        `${API_ROUTES.PRODUCTS}/${productId}/flash-sale`,
        flashSaleData,
        {
          withCredentials: true,
        }
      );
      await get().clearProductCache();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to create flash sale",
        isLoading: false,
      });
      throw error;
    }
  },

  updateFlashSale: async (id: string, flashSaleData: Partial<FlashSale>) => {
    set({ isLoading: true, error: null });
    try {
      await axios.put(
        `${API_ROUTES.PRODUCTS}/flash-sale/${id}`,
        flashSaleData,
        {
          withCredentials: true,
        }
      );
      await get().clearProductCache();
      set({ isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Failed to update flash sale",
        isLoading: false,
      });
      throw error;
    }
  },

  clearProductCache: async () => {
    try {
      await axios.post(`${API_ROUTES.PRODUCTS}/clear-cache`, null, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Failed to clear product cache:", error);
    }
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),

  fetchCategories: async () => {
    try {
      const response = await axios.get(`${API_ROUTES.CATEGORIES}`, {
        withCredentials: true,
      });
      const categories = response.data;
      set({ categories });
      return categories;
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      throw error;
    }
  },
}));

// Add these constants
export const CLOTHING_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
] as const;
export const SHOE_SIZES = [
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "43",
  "44",
  "45",
] as const;
export const COLORS = [
  "Black",
  "White",
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Purple",
  "Orange",
  "Grey",
  "Brown",
  "Pink",
  "Navy",
] as const;

// Update the product schema
const productSchema = z.object({
  // ... other fields ...
  flashSale: z
    .object({
      enabled: z.boolean().default(false),
      discountPercentage: z.string().optional(),
      startTime: z.string().optional(), // Changed from startDate
      endTime: z.string().optional(), // Changed from endDate
    })
    .default({
      enabled: false,
      discountPercentage: "",
      startTime: "",
      endTime: "",
    }),
});

export interface ProductFormValues {
  name: string;
  brand: string;
  description: string;
  price: string;
  baseStock: string;
  categoryId: string;
  images: File[];
  variations?: ProductVariation[];
  specifications?: ProductSpec[];
  flashSale: {
    enabled: boolean;
    discountPercentage: string;
    startTime: string;
    endTime: string;
  };
}
