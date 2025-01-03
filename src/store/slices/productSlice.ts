import { createSlice } from '@reduxjs/toolkit';
import type { Product } from '../../types/product';
import { sampleProducts } from '../../mocks/products';

interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  items: sampleProducts,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    // 可以添加更多 reducers...
  },
});

export const { setProducts } = productSlice.actions;
export default productSlice.reducer; 