import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Favorite } from '../../types/favorite';
import type { Product } from '../../types/product';

const initialState: Favorite = {
  items: [],
  count: 0,
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(item => item.id === product.id);
      
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(product);
      }
      
      state.count = state.items.length;
    },
    clearFavorites: (state) => {
      state.items = [];
      state.count = 0;
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer; 