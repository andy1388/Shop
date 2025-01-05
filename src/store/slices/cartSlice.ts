import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartItem } from '../../types/cart';
import type { Product } from '../../types/product';

interface AddToCartPayload {
  product: Product;
  quantity: number;
  specifications: {
    [key: string]: string;
  };
}

const initialState: Cart = {
  items: [],
  total: 0,
  count: 0,
};

// 生成唯一的購物車項目ID
const generateCartItemId = (productId: string, specifications: { [key: string]: string }): string => {
  const specsString = Object.entries(specifications)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
  return `${productId}_${specsString}`;
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { product, quantity, specifications } = action.payload;
      const cartItemId = generateCartItemId(product.id, specifications);
      
      const existingItem = state.items.find(item => 
        item.id === cartItemId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: cartItemId,
          productId: product.id,
          quantity,
          price: product.price,
          name: product.name,
          image: product.images[0],
          specifications,
        });
      }

      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        state.count = state.items.reduce((sum, item) => sum + item.quantity, 0);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.count = 0;
    },
    updateCartItemSpecifications: (state, action: PayloadAction<{
      itemId: string;
      specifications: { [key: string]: string };
    }>) => {
      const { itemId, specifications } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      
      if (item) {
        // 生成新的購物車項目 ID
        const newItemId = generateCartItemId(item.productId, specifications);
        
        // 檢查是否已存在相同規格的商品
        const existingItem = state.items.find(i => i.id === newItemId && i.id !== itemId);
        
        if (existingItem) {
          // 如果存在相同規格的商品，合併數量並刪除原項目
          existingItem.quantity += item.quantity;
          state.items = state.items.filter(i => i.id !== itemId);
        } else {
          // 如果不存在相同規格的商品，更新當前項目
          item.id = newItemId;
          item.specifications = specifications;
        }
      }
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  updateCartItemSpecifications 
} = cartSlice.actions;
export default cartSlice.reducer; 