import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Cart, CartItem } from '../../types/cart';
import type { Product } from '../../types/product';

const initialState: Cart = {
  items: [],
  total: 0,
  count: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ product: Product; quantity: number }>) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.productId === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: Date.now().toString(),
          productId: product.id,
          quantity,
          price: product.price,
          name: product.name,
          image: product.images[0],
          specifications: product.specifications,
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
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 