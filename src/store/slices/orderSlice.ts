import { createSlice } from '@reduxjs/toolkit';
import type { Order } from '../../types/order';

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // 订单功能将在后续实现
  },
});

export default orderSlice.reducer; 