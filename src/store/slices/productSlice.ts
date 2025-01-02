import { createSlice } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // 商品功能将在后续实现
  },
});

export default productSlice.reducer; 