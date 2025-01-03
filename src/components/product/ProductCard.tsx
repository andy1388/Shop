import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';
import { ShoppingCartIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/outline';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import ToastService from '../../services/ToastService';
import { toggleFavorite } from '../../store/slices/favoriteSlice';
import type { RootState } from '../../store';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, price, originalPrice, images, rating, reviews } = product;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [nextImageIndex, setNextImageIndex] = useState<number | null>(null);
  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorite.items);
  const isFavorite = favorites.some(item => item.id === product.id);

  // 预加载所有图片
  React.useEffect(() => {
    let mounted = true;
    const imagePromises = images.map(imageUrl => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          if (mounted) {
            setLoadedImages(prev => new Set([...prev, imageUrl]));
          }
          resolve(imageUrl);
        };
        img.onerror = reject;
      });
    });

    Promise.all(imagePromises)
      .then(() => {
        if (mounted) {
          setIsLoading(false);
        }
      })
      .catch(error => {
        console.error('Error loading images:', error);
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [images]);

  // 处理图片切换
  const handleImageChange = (newIndex: number) => {
    if (loadedImages.has(images[newIndex])) {
      setCurrentImageIndex(newIndex);
      setNextImageIndex(null);
    } else {
      // 如果下一张图片还没加载完成，先记录目标索引
      setNextImageIndex(newIndex);
    }
  };

  // 监听图片加载状态
  React.useEffect(() => {
    if (nextImageIndex !== null && loadedImages.has(images[nextImageIndex])) {
      setCurrentImageIndex(nextImageIndex);
      setNextImageIndex(null);
    }
  }, [loadedImages, nextImageIndex, images]);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    const newIndex = currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1;
    handleImageChange(newIndex);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    const newIndex = currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1;
    handleImageChange(newIndex);
  };

  // 格式化价格显示
  const formatPrice = (value: number) => {
    return `HK$${value.toFixed(2)}`;
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    ToastService.show('已添加到購物車');
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavorite(product));
    ToastService.show(
      isFavorite ? '已從收藏中移除' : '已添加到收藏',
      isFavorite ? 'error' : 'success'
    );
  };

  return (
    <Link to={`/products/${id}`} className="group relative block">
      <div className="relative">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
          <div className="relative w-full h-full">
            {isLoading ? (
              // 加载占位符
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <img
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={name}
                className={`w-full h-full object-cover object-center transition-all duration-500 ease-in-out
                            ${nextImageIndex !== null ? 'opacity-50' : ''}`}
                style={{
                  animation: nextImageIndex === null ? 'fadeIn 0.5s ease-out' : 'none'
                }}
              />
            )}

            {/* 图片切换按钮 - 只在所有图片加载完成后显示 */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full 
                             bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100
                             transition-opacity duration-200 hover:bg-white z-10"
                  onClick={handlePrevImage}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full 
                             bg-white/80 text-gray-800 opacity-0 group-hover:opacity-100
                             transition-opacity duration-200 hover:bg-white"
                  onClick={handleNextImage}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>

                {/* 图片指示器 */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200
                                ${index === currentImageIndex 
                                  ? 'bg-white scale-110' 
                                  : 'bg-white/60 hover:bg-white/80'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleImageChange(index);
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {product.tags.map((tag, index) => (
            <span 
              key={tag} 
              className="inline-flex items-center px-2 py-0.5 text-xs font-medium 
                         text-white rounded-full shadow-sm backdrop-blur-sm
                         transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: 
                  tag === '新品' ? 'rgba(59, 130, 246, 0.9)' :   // 蓝色
                  tag === '限時優惠' ? 'rgba(239, 68, 68, 0.9)' : // 红色
                  tag === '熱賣' ? 'rgba(249, 115, 22, 0.9)' :   // 橙色
                  tag === '推薦' ? 'rgba(75, 85, 99, 0.9)' :     // 灰色
                  tag === '限量' ? 'rgba(236, 72, 153, 0.9)' :   // 粉色
                  'rgba(107, 114, 128, 0.9)'                     // 默认灰色
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <button
          type="button"
          className={`absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm
                    ${isFavorite ? 'text-red-500' : 'text-gray-400'} 
                    hover:text-red-500 transition-colors duration-200 z-20`}
          onClick={handleToggleFavorite}
        >
          <HeartIcon className="w-5 h-5" />
        </button>
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 p-2 rounded-full bg-blue-600 text-white
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     hover:bg-blue-700 z-10"
        >
          <ShoppingCartIcon className="w-5 h-5" />
        </button>
        <div className="absolute bottom-2 left-2">
          {product.stock <= 0 ? (
            <span className="px-2 py-1 text-xs font-medium text-white bg-red-500/90 rounded backdrop-blur-sm">
              已售罄
            </span>
          ) : product.stock < 10 ? (
            <span className="px-2 py-1 text-xs font-medium text-white bg-yellow-500/90 rounded backdrop-blur-sm">
              庫存緊張
            </span>
          ) : null}
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-sm text-gray-700">{name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-medium text-gray-900">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-yellow-500">★</span>
            <span className="text-sm text-gray-500">
              {Number(rating).toFixed(1)} ({reviews})
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard; 