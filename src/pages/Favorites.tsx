import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import ProductCard from '../components/product/ProductCard';

const Favorites: React.FC = () => {
  const favorites = useSelector((state: RootState) => state.favorite.items);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">我的收藏</h1>
      {favorites.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          還沒有收藏任何商品
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites; 