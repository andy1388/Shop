import type { Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  specifications: {
    顏色?: string;
    尺碼?: string;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
} 