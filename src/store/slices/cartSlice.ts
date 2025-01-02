import { createSlice } from '@reduxjs/toolkit';
import type { Cart } from '../../types/cart';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // 购物车功能将在后续实现
  },
});

export default cartSlice.reducer; 