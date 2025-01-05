import type { Product } from './product';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
  specifications: {
    [key: string]: string;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
} 