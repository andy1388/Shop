import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { toggleFavorite } from '../store/slices/favoriteSlice';
import { HeartIcon } from '@heroicons/react/24/outline';
import ToastService from '../services/ToastService';

type TabType = '商品詳情' | '規格參數' | '商品評價';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux 狀態
  const product = useSelector((state: RootState) => 
    state.products?.items.find(item => item.id === id)
  );
  const favorites = useSelector((state: RootState) => state.favorite.items);
  const isFavorite = favorites.some(item => item.id === id);

  // 本地狀態
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const [currentTab, setCurrentTab] = useState<TabType>('商品詳情');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化加載
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    // 模擬加載延遲
    const timer = setTimeout(() => {
      if (!product) {
        setError('商品不存在或已下架');
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [id, product]);

  // 檢查規格是否已全部選擇
  const isSpecsComplete = () => {
    if (!product) return false;
    const requiredSpecs = Object.keys(product.specifications);
    const selectedSpecsKeys = Object.keys(selectedSpecs);
    return requiredSpecs.every(spec => selectedSpecsKeys.includes(spec));
  };

  // 處理數量調整
  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock ?? 0)) {
      setQuantity(newQuantity);
    }
  };

  // 處理加入購物車
  const handleAddToCart = () => {
    if (!isSpecsComplete()) {
      ToastService.show('請選擇完整規格', 'error');
      return;
    }
    
    if (!product) return;
    
    dispatch(addToCart({ 
      product,
      quantity,
      specifications: selectedSpecs
    }));
    ToastService.show('已添加到購物車', 'success');
  };

  // 處理立即購買
  const handleBuyNow = () => {
    if (!isSpecsComplete()) {
      ToastService.show('請選擇完整規格', 'error');
      return;
    }
    
    if (!product) return;
    
    dispatch(addToCart({ 
      product,
      quantity,
      specifications: selectedSpecs
    }));
    navigate('/checkout');
  };

  // 處理收藏
  const handleToggleFavorite = () => {
    if (!product) return;
    
    dispatch(toggleFavorite(product));
    ToastService.show(
      isFavorite ? '已從收藏中移除' : '已添加到收藏',
      isFavorite ? 'error' : 'success'
    );
  };

  // 處理規格選擇
  const handleSpecSelect = (type: string, value: string) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // 加載中狀態
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          加載中...
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-gray-500">
          {error || '商品不存在或已下架'}
        </div>
      </div>
    );
  }

  // 渲染選項卡內容
  const renderTabContent = () => {
    switch (currentTab) {
      case '商品詳情':
        return (
          <div className="py-6">
            <p className="text-gray-600">{product.description}</p>
          </div>
        );
      case '規格參數':
        return (
          <div className="py-6">
            <table className="w-full">
              <tbody>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <td className="py-2 text-gray-500 w-1/4">{key}</td>
                    <td className="py-2 text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case '商品評價':
        return (
          <div className="py-6">
            <div className="text-center text-gray-500">
              暫無評價
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 左側圖片區域 */}
        <div className="space-y-4">
          {/* 主圖區域 */}
          <div className="aspect-w-1 aspect-h-1 w-full relative">
            <img
              src={product.images[currentImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
            {/* 收藏按鈕 */}
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-4 right-4 p-2 rounded-full 
                ${isFavorite ? 'bg-red-500 text-white' : 'bg-white text-gray-400'}
                hover:scale-110 transition-all duration-200`}
            >
              <HeartIcon className="w-6 h-6" />
            </button>
          </div>
          
          {/* 縮略圖列表 */}
          <div className="grid grid-cols-5 gap-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                className={`aspect-w-1 aspect-h-1 w-full ${
                  index === currentImageIndex ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
              </button>
            ))}
          </div>
        </div>

        {/* 右側信息區域 */}
        <div className="space-y-6">
          {/* 基本信息 */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-semibold text-gray-900">
                  HK${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    HK${product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} 評價)
                </span>
              </div>
            </div>
          </div>

          {/* 商品標籤 */}
          <div className="flex flex-wrap gap-2">
            {product.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 規格選擇 */}
          <div className="space-y-4">
            {Object.entries(product.specifications).map(([type, values]) => (
              <div key={type}>
                <h3 className="text-sm font-medium text-gray-900">{type}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(values) ? (
                    values.map((value) => (
                      <button
                        key={value}
                        className={`px-3 py-1 border rounded-md 
                          ${selectedSpecs[type] === value
                            ? 'border-blue-500 text-blue-500' 
                            : 'hover:border-blue-500'}`}
                        onClick={() => handleSpecSelect(type, value)}
                      >
                        {value}
                      </button>
                    ))
                  ) : (
                    <button
                      className={`px-3 py-1 border rounded-md 
                        ${selectedSpecs[type] === values
                          ? 'border-blue-500 text-blue-500' 
                          : 'hover:border-blue-500'}`}
                      onClick={() => handleSpecSelect(type, values)}
                    >
                      {values}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* 數量選擇 */}
            <div>
              <h3 className="text-sm font-medium text-gray-900">數量</h3>
              <div className="mt-2 flex items-center space-x-2">
                <button
                  className="px-3 py-1 border rounded-md hover:border-blue-500 disabled:opacity-50"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="w-12 text-center">{quantity}</span>
                <button
                  className="px-3 py-1 border rounded-md hover:border-blue-500 disabled:opacity-50"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
                <span className="text-sm text-gray-500">
                  庫存: {product.stock}
                </span>
              </div>
            </div>
          </div>

          {/* 購買按鈕 */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 transition-colors duration-200"
            >
              加入購物車
            </button>
            <button
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg 
                hover:bg-red-700 transition-colors duration-200"
            >
              立即購買
            </button>
          </div>
        </div>
      </div>

      {/* 商品詳情選項卡 */}
      <div className="mt-12">
        <div className="border-b">
          <nav className="flex gap-8">
            {(['商品詳情', '規格參數', '商品評價'] as TabType[]).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 text-sm font-medium ${
                  currentTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setCurrentTab(tab)}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProductDetail; 