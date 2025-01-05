import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/outline';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Product } from '../../types/product';
import type { CartItem } from '../../types/cart';
import { toggleFavorite } from '../../store/slices/favoriteSlice';
import SpecificationModal from '../cart/SpecificationModal';
import toast from 'react-hot-toast';
import { toastConfig } from '../../config/toastConfig';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 檢查商品是否已收藏
  const favorites = useSelector((state: RootState) => state.favorite.items);
  const isFavorite = favorites.some(item => item.id === product.id);

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsModalOpen(true);
  };

  // 處理收藏點擊
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleFavorite(product));
    
    if (isFavorite) {
      toast.error('已從收藏中移除', toastConfig.error);
    } else {
      toast.success('已添加到收藏', toastConfig.success);
    }
  };

  // 將商品轉換為購物車項目格式
  const cartItem: CartItem = {
    id: product.id,
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    quantity: 1,
    specifications: {}
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden group">
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <Link 
            to={`/products/${product.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          </Link>
          <button
            className={`absolute top-2 right-2 p-2 rounded-full 
                       transition-all duration-200 
                       ${isFavorite 
                         ? 'bg-red-500 text-white hover:bg-red-600' 
                         : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
                       }`}
            onClick={handleFavoriteClick}
          >
            <HeartIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleCartClick}
            className="absolute bottom-2 right-2 p-2 rounded-full 
                       bg-blue-600 text-white hover:bg-blue-700 
                       transition-colors shadow-lg z-10"
          >
            <ShoppingCartIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <Link 
            to={`/products/${product.id}`}
            className="text-lg font-medium hover:text-blue-600 block"
            onClick={(e) => e.stopPropagation()}
          >
            {product.name}
          </Link>
          
          <div className="mt-2">
            <div className="text-blue-600 font-medium">HK${product.price}</div>
          </div>
        </div>
      </div>

      <SpecificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={cartItem}
        availableSpecifications={{
          '顏色': ['黑色', '白色', '藍色', '灰色'],
          '尺碼': ['39', '40', '41', '42', '43', '44'],
          '材質': ['網布', '真皮', '人造皮革']
        }}
        isNewItem={true}
      />
    </>
  );
};

export default ProductCard; 