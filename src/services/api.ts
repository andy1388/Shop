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

const API_URL = 'http://localhost:3000/api';

interface ProductFormData {
  name: string;
  originalPrice: string;
  specialPrice: string;
  specialPriceEndDate: string;
  stock: string;
  description: string;
  category: string;
  images: File[];
}

export const productApi = {
  // 獲取商品列表
  getProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // 創建新商品
  createProduct: async (productData: ProductFormData) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: productData.name,
          original_price: productData.originalPrice,
          special_price: productData.specialPrice,
          special_price_end_date: productData.specialPriceEndDate,
          stock: productData.stock,
          description: productData.description,
          category: productData.category
        })
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // 刪除商品
  deleteProduct: async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
}; 