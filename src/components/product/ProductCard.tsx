import React from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../../types/product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, price, originalPrice, images, rating, reviews } = product;

  // 格式化价格显示
  const formatPrice = (value: number) => {
    return `HK$${value.toFixed(2)}`;
  };

  return (
    <Link to={`/products/${id}`} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
        <img
          src={images[0]}
          alt={name}
          className="h-full w-full object-cover object-center group-hover:opacity-75"
          loading="lazy"
        />
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