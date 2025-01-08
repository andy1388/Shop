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

export const API_URL = 'http://localhost:3000/api';

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
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('original_price', productData.originalPrice);
      formData.append('special_price', productData.specialPrice);
      formData.append('special_price_end_date', productData.specialPriceEndDate);
      formData.append('stock', productData.stock);
      formData.append('description', productData.description);
      formData.append('category', productData.category);

      // 添加圖片文件
      productData.images.forEach((image, index) => {
        formData.append('images', image);
        console.log(`Appending image ${index}:`, image); // 添加日誌
      });

      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
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
  },

  // 更新商品
  updateProduct: async (id: string, productData: ProductFormData) => {
    try {
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('original_price', productData.originalPrice);
      formData.append('special_price', productData.specialPrice);
      formData.append('special_price_end_date', productData.specialPriceEndDate);
      formData.append('stock', productData.stock);
      formData.append('description', productData.description);
      formData.append('category', productData.category);

      // 添加新上傳的圖片
      productData.images.forEach((image) => {
        formData.append('images', image);
      });

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // 刪除商品圖片
  deleteProductImage: async (productId: string, imageUrl: string) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}/images/${imageUrl}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  }
}; 