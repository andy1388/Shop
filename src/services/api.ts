// API 接口定义
export const API_ENDPOINTS = {
  // 认证相关
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    profile: '/api/auth/profile',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    changePassword: '/api/auth/change-password',
  },
  // 商品相关
  products: {
    list: '/api/products',
    detail: (id: string) => `/api/products/${id}`,
    create: '/api/products',
    update: (id: string) => `/api/products/${id}`,
    delete: (id: string) => `/api/products/${id}`,
    search: '/api/products/search',
  },
  // 购物车相关
  cart: {
    get: '/api/cart',
    add: '/api/cart/items',
    update: '/api/cart/items',
    remove: (itemId: string) => `/api/cart/items/${itemId}`,
    clear: '/api/cart/clear',
  },
  // 订单相关
  orders: {
    create: '/api/orders',
    list: '/api/orders',
    detail: (id: string) => `/api/orders/${id}`,
    update: (id: string) => `/api/orders/${id}`,
    cancel: (id: string) => `/api/orders/${id}/cancel`,
  },
}

// 添加密码重置相关类型
export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
} 