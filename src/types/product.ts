// 商品相关类型定义
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  tags: string[];
  stock: number;
  rating: number;
  reviews: number;
  specifications: {
    [key: string]: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ProductFilters {
  minPrice?: number;
  maxPrice?: number;
  category?: string;
  subCategory?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating-desc';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
} 