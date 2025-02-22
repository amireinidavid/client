export interface FlashSale {
  id: string;
  productId: string;
  discount: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
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

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  categoryId: string;
  baseStock: number;
  soldCount: number;
  rating: number | null;
  status: string;
  metadata: any | null;
  slug: string;
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  specifications: Array<{
    id: string;
    productId: string;
    key: string;
    value: string;
    group: string;
    order: number;
  }>;
  variations: Array<{
    id: string;
    productId: string;
    type: string;
    size: string;
    color: string | null;
    stock: number;
    createdAt: string;
    updatedAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    type: string;
    description: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
  };
  productImages: ProductImage[];
  // productImages: Array<{
  //   id: string;
  //   url: string;
  //   publicId: string;
  //   width: number;
  //   height: number;
  //   format: string;
  //   size: number;
  //   thumbnailUrl: string;
  //   mediumUrl: string;
  //   order: number;
  // }>;
  flashSale?: {
    isActive: boolean;
    discount: number;
    discountPrice: number;
    originalPrice: number;
    stock: number;
    soldCount: number;
  };
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
