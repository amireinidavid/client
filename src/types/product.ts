export interface Product {
  id: string;
  name: string;
  price: number;
  rating?: number;
  productImages?: {
    url: string;
  }[];
  brand: string;
  description: string;
  baseStock: number;
  soldCount: number;
  status: string;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FlashSaleProduct extends Product {
  discountPercentage: number;
  discountPrice: number;
  order: number;
}
interface FlashSale {
  id: string;
  productId: string;
  discount: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  size: number;
  thumbnailUrl: string;
  mediumUrl: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}
