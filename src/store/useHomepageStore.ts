import { API_ROUTES } from "@/utils/api";
import axios, { AxiosError } from "axios";
import { create } from "zustand";
import { Product } from "@/types/index";

// Define base API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Define API instance
const axiosInstance = axios.create({
  baseURL: `${API_URL}/homepage`,
  withCredentials: true,
});

// Define response type
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

// Define base types
interface BaseItem {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Define specific types
interface HeroSlide extends BaseItem {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  ctaText: string;
  ctaLink: string;
  order: number;
}

interface CreateHeroSlideData {
  title: string;
  subtitle: string;
  description: string;
  image: File;
  ctaText: string;
  ctaLink: string;
  order: number;
}

interface UpdateHeroSlideData extends Partial<CreateHeroSlideData> {
  isActive?: boolean;
}

// Additional Types for other sections
interface TrustSignal extends BaseItem {
  icon: string;
  title: string;
  description: string;
  order: number;
}

interface FeaturedCategory extends BaseItem {
  name: string;
  tagline: string;
  image: string;
  href: string;
  actionText: string;
  order: number;
}

interface PromotionalBanner extends BaseItem {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  href: string;
  image: string;
  position: string;
  order: number;
}

interface FlashSaleProduct {
  id: string;
  productId: string;
  discountPrice: number;
  discountPercentage: number;
  originalPrice: number;
  order: number;
  stock: number;
  soldCount: number;
  product: Product;
  productImages: {
    mediumUrl: string;
  }[];
  baseStock: number;
}

interface FlashSaleConfig {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  products: FlashSaleProduct[];
}

interface BlogPost extends BaseItem {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  slug: string;
  isFeatured: boolean;
  isPublished: boolean;
  publishedAt: string;
}

interface HomePageConfig extends BaseItem {
  heroSectionEnabled: boolean;
  trustSignalsEnabled: boolean;
  featuredCategoriesEnabled: boolean;
  trendingProductsEnabled: boolean;
  promotionalBannersEnabled: boolean;
  personalizedRecsEnabled: boolean;
  flashSalesEnabled: boolean;
  blogSectionEnabled: boolean;
  trendingProductsTitle: string;
  trendingProductsSubtitle: string;
  featuredCategoriesTitle: string;
  featuredCategoriesSubtitle: string;
  personalizedRecsTitle: string;
  personalizedRecsSubtitle: string;
  blogSectionTitle: string;
  blogSectionSubtitle: string;
  trendingProductsLimit: number;
  featuredCategoriesLimit: number;
  flashSaleProductsLimit: number;
  blogPostsLimit: number;
}

// Add these enums to match your Prisma schema
enum ProductType {
  FASHION = "FASHION",
  ELECTRONICS = "ELECTRONICS",
  BEAUTY = "BEAUTY",
  SHOES = "SHOES",
  HOME_DECOR = "HOME_DECOR",
  ACCESSORIES = "ACCESSORIES",
  BOOKS = "BOOKS",
}

enum ProductStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
  OUT_OF_STOCK = "OUT_OF_STOCK",
}

// Define store state and actions
interface HomepageState {
  heroSlides: HeroSlide[];
  trustSignals: TrustSignal[];
  featuredCategories: FeaturedCategory[];
  promotionalBanners: PromotionalBanner[];
  flashSales: FlashSaleConfig[];
  blogPosts: BlogPost[];
  homePageConfig: HomePageConfig | null;
  isLoading: boolean;
  error: string | null;
  featuredProducts: Product[];
  allProducts: Product[];
  products: Product[];
  trendingProducts: Product[];
}

interface HomepageActions {
  fetchHeroSlides: () => Promise<void>;
  createHeroSlide: (data: FormData) => Promise<void>;
  updateHeroSlide: (id: string, data: FormData) => Promise<void>;
  deleteHeroSlide: (id: string) => Promise<void>;
  fetchTrustSignals: () => Promise<void>;
  createTrustSignal: (
    data: Omit<TrustSignal, "id" | "isActive" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateTrustSignal: (id: string, data: Partial<TrustSignal>) => Promise<void>;
  deleteTrustSignal: (id: string) => Promise<void>;
  fetchFeaturedCategories: () => Promise<void>;
  createFeaturedCategory: (data: FormData) => Promise<void>;
  updateFeaturedCategory: (id: string, data: FormData) => Promise<void>;
  deleteFeaturedCategory: (id: string) => Promise<void>;
  fetchPromotionalBanners: () => Promise<void>;
  createPromotionalBanner: (data: FormData) => Promise<void>;
  updatePromotionalBanner: (id: string, data: FormData) => Promise<void>;
  deletePromotionalBanner: (id: string) => Promise<void>;
  fetchFlashSaleConfigs: () => Promise<ApiResponse<FlashSaleConfig[]>>;
  createFlashSaleConfig: (data: any) => Promise<void>;
  deleteFlashSaleConfig: (id: string) => Promise<void>;
  fetchBlogPosts: () => Promise<void>;
  createBlogPost: (data: FormData) => Promise<void>;
  updateBlogPost: (id: string, data: FormData) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
  fetchHomePageConfig: () => Promise<void>;
  updateHomePageConfig: (data: Partial<HomePageConfig>) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  updateFeaturedProducts: (productIds: string[]) => Promise<void>;
  fetchAdminHeroSlides: () => Promise<void>;
  updateHeroSlideOrder: (
    updates: { id: string; order: number }[]
  ) => Promise<void>;
  toggleHeroSlideStatus: (id: string, isActive: boolean) => Promise<void>;
  fetchAllProducts: () => Promise<void>;
  fetchProducts: () => Promise<Product[]>;
  fetchTrendingProducts: () => Promise<void>;
  updateTrendingProducts: (productIds: string[]) => Promise<void>;
}

type HomepageStore = HomepageState & HomepageActions;

// Create the store
export const useHomepageStore = create<HomepageStore>((set, get) => ({
  // Initial state
  heroSlides: [],
  trustSignals: [],
  featuredCategories: [],
  promotionalBanners: [],
  flashSales: [],
  blogPosts: [],
  homePageConfig: null,
  isLoading: false,
  error: null,
  featuredProducts: [],
  allProducts: [],
  products: [],
  trendingProducts: [],

  // Actions
  fetchHeroSlides: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<HeroSlide[]>>(
        "/hero-slides"
      );
      set({ heroSlides: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch hero slides";
      set({ isLoading: false, error: errorMessage });
    }
  },

  createHeroSlide: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<ApiResponse<HeroSlide>>(
        "/hero-slides",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        heroSlides: [...state.heroSlides, response.data.data],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to create hero slide";
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateHeroSlide: async (id: string, data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<ApiResponse<HeroSlide>>(
        `/hero-slides/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        heroSlides: state.heroSlides.map((slide) =>
          slide.id === id ? response.data.data : slide
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to update hero slide";
      set({ isLoading: false, error: errorMessage });
    }
  },

  deleteHeroSlide: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/hero-slides/${id}`);
      set((state) => ({
        heroSlides: state.heroSlides.filter((slide) => slide.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to delete hero slide";
      set({ isLoading: false, error: errorMessage });
    }
  },

  // Trust Signal actions
  fetchTrustSignals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<TrustSignal[]>>(
        "/trust-signals"
      );
      set({ trustSignals: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch trust signals";
      set({ isLoading: false, error: errorMessage });
    }
  },

  createTrustSignal: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<ApiResponse<TrustSignal>>(
        "/trust-signals",
        data
      );
      set((state) => ({
        trustSignals: [...state.trustSignals, response.data.data],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to create trust signal";
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateTrustSignal: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<ApiResponse<TrustSignal>>(
        `/trust-signals/${id}`,
        data
      );
      set((state) => ({
        trustSignals: state.trustSignals.map((signal) =>
          signal.id === id ? response.data.data : signal
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to update trust signal";
      set({ isLoading: false, error: errorMessage });
    }
  },

  deleteTrustSignal: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/trust-signals/${id}`);
      set((state) => ({
        trustSignals: state.trustSignals.filter((signal) => signal.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to delete trust signal";
      set({ isLoading: false, error: errorMessage });
    }
  },

  // Featured Categories actions
  fetchFeaturedCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<FeaturedCategory[]>>(
        "/featured-categories"
      );
      set({ featuredCategories: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch featured categories";
      set({ isLoading: false, error: errorMessage });
    }
  },

  createFeaturedCategory: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<ApiResponse<FeaturedCategory>>(
        "/featured-categories",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        featuredCategories: [...state.featuredCategories, response.data.data],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to create featured category";
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateFeaturedCategory: async (id: string, data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<ApiResponse<FeaturedCategory>>(
        `/featured-categories/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        featuredCategories: state.featuredCategories.map((category) =>
          category.id === id ? response.data.data : category
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to update featured category";
      set({ isLoading: false, error: errorMessage });
    }
  },

  deleteFeaturedCategory: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/featured-categories/${id}`);
      set((state) => ({
        featuredCategories: state.featuredCategories.filter(
          (category) => category.id !== id
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to delete featured category";
      set({ isLoading: false, error: errorMessage });
    }
  },

  // Promotional Banners actions
  fetchPromotionalBanners: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<
        ApiResponse<PromotionalBanner[]>
      >("/promotional-banners");
      set({ promotionalBanners: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch promotional banners";
      set({ isLoading: false, error: errorMessage });
    }
  },

  createPromotionalBanner: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<ApiResponse<PromotionalBanner>>(
        "/promotional-banners",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        promotionalBanners: [...state.promotionalBanners, response.data.data],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to create promotional banner";
      set({ isLoading: false, error: errorMessage });
    }
  },

  updatePromotionalBanner: async (id: string, data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<ApiResponse<PromotionalBanner>>(
        `/promotional-banners/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        promotionalBanners: state.promotionalBanners.map((banner) =>
          banner.id === id ? response.data.data : banner
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to update promotional banner";
      set({ isLoading: false, error: errorMessage });
    }
  },

  deletePromotionalBanner: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/promotional-banners/${id}`);
      set((state) => ({
        promotionalBanners: state.promotionalBanners.filter(
          (banner) => banner.id !== id
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to delete promotional banner";
      set({ isLoading: false, error: errorMessage });
    }
  },

  // Flash Sale Config actions
  fetchFlashSaleConfigs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<FlashSaleConfig[]>>(
        "/flash-sales"
      );
      set({ flashSales: response.data.data, isLoading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch flash sales";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  createFlashSaleConfig: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<ApiResponse<FlashSaleConfig>>(
        "/flash-sales",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      set({ flashSales: [response.data.data], isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to create flash sale config";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  deleteFlashSaleConfig: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/flash-sales/${id}`);
      set((state) => ({
        flashSales: state.flashSales.filter((sale) => sale.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to delete flash sale";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  // Blog Posts actions
  fetchBlogPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<BlogPost[]>>(
        "/blog-posts"
      );
      set({ blogPosts: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch blog posts";
      set({ isLoading: false, error: errorMessage });
    }
  },

  createBlogPost: async (data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<ApiResponse<BlogPost>>(
        "/blog-posts",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        blogPosts: [...state.blogPosts, response.data.data],
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to create blog post";
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateBlogPost: async (id: string, data: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<ApiResponse<BlogPost>>(
        `/blog-posts/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      set((state) => ({
        blogPosts: state.blogPosts.map((post) =>
          post.id === id ? response.data.data : post
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to update blog post";
      set({ isLoading: false, error: errorMessage });
    }
  },

  deleteBlogPost: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await axiosInstance.delete(`/blog-posts/${id}`);
      set((state) => ({
        blogPosts: state.blogPosts.filter((post) => post.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to delete blog post";
      set({ isLoading: false, error: errorMessage });
    }
  },

  // Homepage Config actions
  fetchHomePageConfig: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<HomePageConfig>>(
        "/config"
      );
      set({ homePageConfig: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch homepage config";
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateHomePageConfig: async (data: Partial<HomePageConfig>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<ApiResponse<HomePageConfig>>(
        "/config",
        data
      );
      set({ homePageConfig: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to update homepage config";
      set({ isLoading: false, error: errorMessage });
    }
  },

  // Featured Products actions
  fetchFeaturedProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<Product[]>>(
        "/get-featured-categories"
      );
      set({
        featuredProducts: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch featured products";
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateFeaturedProducts: async (productIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/featured-categories", {
        productIds,
      });

      // Update the local state to reflect the changes
      set((state) => ({
        allProducts: state.allProducts.map((product) => ({
          ...product,
          isFeatured: productIds.includes(product.id),
        })),
        isLoading: false,
      }));

      return response.data;
    } catch (error) {
      console.error("Failed to update featured products:", error);
      throw error;
    }
  },

  // Add new actions
  fetchAdminHeroSlides: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<HeroSlide[]>>(
        "/hero-slides"
      );
      set({ heroSlides: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch hero slides";
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateHeroSlideOrder: async (updates: { id: string; order: number }[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put<ApiResponse<HeroSlide[]>>(
        "/admin/hero-slides/order",
        { updates }
      );
      set({ heroSlides: response.data.data, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to update hero slides order";
      set({ isLoading: false, error: errorMessage });
    }
  },

  toggleHeroSlideStatus: async (id: string, isActive: boolean) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.patch<ApiResponse<HeroSlide>>(
        `/admin/hero-slides/${id}/status`,
        { isActive }
      );
      set((state) => ({
        heroSlides: state.heroSlides.map((slide) =>
          slide.id === id ? response.data.data : slide
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to update hero slide status";
      set({ isLoading: false, error: errorMessage });
    }
  },

  fetchAllProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<Product[]>>(
        "/products"
      );
      set({
        allProducts: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch products";
      set({ isLoading: false, error: errorMessage });
    }
  },

  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<Product[]>>(
        "/products"
      );
      const products = response.data.data;
      set({ products, isLoading: false });
      return products;
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch products";
      set({ isLoading: false, error: errorMessage });
      return [];
    }
  },

  fetchTrendingProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get<ApiResponse<Product[]>>(
        "/get-trending-products"
      );
      set({
        trendingProducts: response.data.data,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to fetch trending products";
      set({ isLoading: false, error: errorMessage });
    }
  },

  updateTrendingProducts: async (productIds: string[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post<ApiResponse<Product[]>>(
        "/trending-products",
        { productIds }
      );

      // Update both allProducts and trendingProducts
      const updatedProducts = response.data.data;
      set((state) => ({
        allProducts: state.allProducts.map((product) => {
          const updatedProduct = updatedProducts.find(
            (p) => p.id === product.id
          );
          return updatedProduct || product;
        }),
        trendingProducts: updatedProducts.filter(
          (product) => product.isTrending
        ),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.error || error.message
          : "Failed to update trending products";
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },
}));
