import React, { useState, useCallback, useEffect } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useDropzone } from 'react-dropzone';
import { productApi, API_URL } from '../../services/api';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  description: string;
  category: string;
  original_price: number;
  special_price?: number;
  special_price_end_date?: string;
  images?: string[];
}

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

// 商品分類
const CATEGORIES = [
  { id: 'handmade', name: '手工藝品' },
  { id: 'accessories', name: '飾品配件' },
  { id: 'stationery', name: '文具用品' },
  { id: 'lifestyle', name: '生活雜貨' },
] as const;

export const ProductManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    originalPrice: '',
    specialPrice: '',
    specialPriceEndDate: '',
    stock: '',
    description: '',
    category: '',
    images: []
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<ProductFormData>>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // 獲取商品列表
  const fetchProducts = async () => {
    try {
      const data = await productApi.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('獲取商品列表失敗');
    } finally {
      setIsLoading(false);
    }
  };

  // 組件掛載時獲取商品列表
  useEffect(() => {
    fetchProducts();
  }, []);

  // 驗證特價和日期
  const validateSpecialPrice = () => {
    const newErrors: Partial<ProductFormData> = {};
    
    if (formData.specialPrice) {
      const specialPrice = Number(formData.specialPrice);
      const originalPrice = Number(formData.originalPrice);

      if (specialPrice >= originalPrice) {
        newErrors.specialPrice = '特價必須低於原價';
      } else if (specialPrice <= 0) {
        newErrors.specialPrice = '特價不能小於或等於0';
      }

      if (!formData.specialPriceEndDate) {
        newErrors.specialPriceEndDate = '有特價時必須設定結束日期';
      } else {
        const endDate = new Date(formData.specialPriceEndDate);
        const today = new Date();
        if (endDate <= today) {
          newErrors.specialPriceEndDate = '結束日期必須大於今天';
        }
      }
    }

    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));
    return Object.keys(newErrors).length === 0;
  };

  // 驗證價格
  const validatePrice = (value: string, field: 'originalPrice' | 'specialPrice') => {
    const price = Number(value);
    if (price < 0) {
      setErrors(prev => ({
        ...prev,
        [field]: '價格不能小於0'
      }));
      return false;
    }
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
    return true;
  };

  // 驗證庫存量
  const validateStock = (value: string) => {
    const stock = Number(value);
    if (stock < 0) {
      setErrors(prev => ({
        ...prev,
        stock: '庫存量不能小於0'
      }));
      return false;
    }
    setErrors(prev => ({
      ...prev,
      stock: undefined
    }));
    return true;
  };

  // 驗證特價結束日期
  const validateEndDate = (date: string) => {
    if (!date) return true; // 如果沒有設定日期，不進行驗證
    
    const endDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 設置時間為當天 00:00:00

    if (endDate <= today) {
      setErrors(prev => ({
        ...prev,
        specialPriceEndDate: '結束日期必須大於今天'
      }));
      return false;
    }
    
    setErrors(prev => ({
      ...prev,
      specialPriceEndDate: undefined
    }));
    return true;
  };

  // 處理圖片預覽
  const handleImagePreview = (files: File[]) => {
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => {
      // 清理舊的預覽 URL
      prev.forEach(url => URL.revokeObjectURL(url));
      return urls;
    });
  };

  // 圖片拖放上傳
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.slice(0, 5); // 最多5張
    setFormData(prev => ({ ...prev, images: validFiles }));
    handleImagePreview(validFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 5,
  });

  // 移除圖片
  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // 處理編輯按鈕點擊
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      originalPrice: product.original_price.toString(),
      specialPrice: product.special_price?.toString() || '',
      specialPriceEndDate: product.special_price_end_date || '',
      stock: product.stock.toString(),
      description: product.description,
      category: product.category,
      images: []
    });
    setIsModalOpen(true);
  };

  // 修改提交處理函數
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // 驗證所有必填字段
      if (!formData.name || !formData.originalPrice || !formData.stock || !formData.category) {
        toast.error('請填寫所有必填欄位');
        return;
      }

      // 驗證特價
      if (formData.specialPrice && !validateSpecialPrice()) {
        toast.error('特價設置有誤，請檢查');
        return;
      }

      let result;
      if (editingProduct) {
        // 更新商品
        result = await productApi.updateProduct(editingProduct.id.toString(), formData);
      } else {
        // 創建新商品
        result = await productApi.createProduct(formData);
      }
      
      if (result) {
        toast.success(editingProduct ? '商品更新成功！' : '商品上架成功！');
        setIsModalOpen(false);
        setEditingProduct(null);
        // 重置表單
        setFormData({
          name: '',
          originalPrice: '',
          specialPrice: '',
          specialPriceEndDate: '',
          stock: '',
          description: '',
          category: '',
          images: []
        });
        // 清理預覽圖片
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setPreviewUrls([]);
        // 重新獲取商品列表
        fetchProducts();
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(editingProduct ? '商品更新失敗' : '商品上架失敗，請稍後再試');
    }
  };

  // 修改刪除商品功能
  const handleDelete = async (id: string) => {
    if (window.confirm('確定要刪除此商品嗎？')) {
      try {
        await productApi.deleteProduct(id);
        toast.success('商品已刪除');
        // 重新獲取商品列表
        fetchProducts();
      } catch (error) {
        console.error('Error:', error);
        toast.error('刪除失敗，請稍後再試');
      }
    }
  };

  // 添加更改商品狀態功能
  const handleStatusChange = (id: string) => {
    setProducts(products.map(product => 
      product.id === id 
        ? { ...product, status: product.status === 'active' ? 'inactive' : 'active' }
        : product
    ));
  };

  return (
    <div>
      {/* 頂部操作欄 */}
      <div className="mb-6 flex justify-end">
        <Button 
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => setIsModalOpen(true)}
        >
          新增商品
        </Button>
      </div>

      {/* 商品列表 */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="p-4 text-center">載入中...</div>
        ) : products.length === 0 ? (
          <div className="p-4 text-center">暫無商品</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品圖片
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  商品名稱
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  價格
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  庫存
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.images && product.images[0] ? (
                      <img 
                        src={`http://localhost:3000/uploads/${product.images[0]}`}
                        alt={product.name} 
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/no-image.png';
                          target.onerror = null;
                        }}
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-gray-400">無圖片</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    HK$ {product.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStatusChange(product.id)}
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${product.status === 'active' 
                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                          : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    >
                      {product.status === 'active' ? '上架中' : '已下架'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => handleEdit(product)}
                    >
                      編輯
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDelete(product.id)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 新增商品彈窗 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{editingProduct ? '編輯商品' : '新增商品'}</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品名稱
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  原價
                </label>
                <Input
                  name="originalPrice"
                  type="number"
                  min="0"
                  step="1"
                  preventNegative
                  value={formData.originalPrice}
                  onChange={(e) => {
                    setFormData({ ...formData, originalPrice: e.target.value });
                    validatePrice(e.target.value, 'originalPrice');
                  }}
                  error={errors.originalPrice}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  特價
                </label>
                <Input
                  name="specialPrice"
                  type="number"
                  min="0"
                  step="1"
                  preventNegative
                  value={formData.specialPrice}
                  onChange={(e) => {
                    setFormData({ ...formData, specialPrice: e.target.value });
                    validatePrice(e.target.value, 'specialPrice');
                  }}
                  onBlur={() => {
                    validateSpecialPrice();
                  }}
                  placeholder="若不設特價請留空"
                  error={errors.specialPrice}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  特價結束日期
                </label>
                <Input
                  name="specialPriceEndDate"
                  type="date"
                  value={formData.specialPriceEndDate}
                  onChange={(e) => {
                    const newDate = e.target.value;
                    setFormData({ ...formData, specialPriceEndDate: newDate });
                    validateEndDate(newDate);
                  }}
                  onBlur={(e) => {
                    validateEndDate(e.target.value);
                  }}
                  min={new Date().toISOString().split('T')[0]} // 設置最小日期為今天
                  disabled={!formData.specialPrice}
                  error={errors.specialPriceEndDate}
                />
                {formData.specialPrice && !formData.specialPriceEndDate && (
                  <p className="mt-1 text-sm text-gray-500">
                    若有特價必須設定結束日期
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  庫存數量
                </label>
                <Input
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e') {
                      e.preventDefault();
                    }
                  }}
                  value={formData.stock}
                  onChange={(e) => {
                    const value = Math.max(0, Number(e.target.value));
                    setFormData({ ...formData, stock: value.toString() });
                    validateStock(value.toString());
                  }}
                  error={errors.stock}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品分類
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">請選擇分類</option>
                  {CATEGORIES.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  商品圖片
                </label>
                <div
                  {...getRootProps()}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer
                    ${isDragActive ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-400'}`}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        選擇檔案或拖放至此
                      </span>
                      <input {...getInputProps()} />
                    </div>
                    <p className="text-xs text-gray-500">
                      支援 PNG, JPG, GIF，最多5張圖片
                    </p>
                  </div>
                </div>

                {/* 圖片預覽 */}
                {previewUrls.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">預覽圖片：</p>
                    <div className="grid grid-cols-5 gap-4">
                      {previewUrls.map((url, index) => (
                        <div key={url} className="relative group">
                          <img
                            src={url}
                            alt={`preview ${index + 1}`}
                            className="h-20 w-20 object-cover rounded border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 
                                     flex items-center justify-center text-xs hover:bg-red-600
                                     opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  取消
                </Button>
                <Button type="submit">
                  儲存
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}; 