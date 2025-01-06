import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { Product } from '../../types/product';

// 收藏商品的類型
interface FavoriteItem extends Product {
  addedAt: string;  // 添加收藏的時間
}

interface FavoriteState {
  items: FavoriteItem[];
}

const initialState: FavoriteState = {
  items: []
};

export const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    // 切換收藏狀態（添加/移除）
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      
      if (index >= 0) {
        // 如果已經收藏，則移除
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        // 如果未收藏，則添加
        state.items.push({
          ...action.payload,
          addedAt: new Date().toISOString()
        });
      }
    },

    // 移除收藏
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // 清空所有收藏
    clearFavorites: (state) => {
      state.items = [];
    },

    // 批量添加收藏
    addFavorites: (state, action: PayloadAction<Product[]>) => {
      const newItems = action.payload.map(product => ({
        ...product,
        addedAt: new Date().toISOString()
      }));
      
      // 過濾掉已存在的商品
      const uniqueItems = newItems.filter(
        newItem => !state.items.some(item => item.id === newItem.id)
      );
      
      state.items.push(...uniqueItems);
    }
  }
});

// 配置持久化
const persistConfig = {
  key: 'favorite',
  storage,
  whitelist: ['items']
};

export const { 
  toggleFavorite, 
  removeFavorite, 
  clearFavorites, 
  addFavorites 
} = favoriteSlice.actions;

// 導出持久化的 reducer
export default persistReducer(persistConfig, favoriteSlice.reducer); 