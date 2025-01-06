import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { ProductFilters as ProductFiltersType } from '../types/product';
import { ProductFilters } from '../components/product/ProductFilters';
import ProductCard from '../components/product/ProductCard';

const Products: React.FC = () => {
  const [filters, setFilters] = useState<ProductFiltersType>({});
  const products = useSelector((state: RootState) => state.products.items);

  // 處理篩選變更
  const handleFilterChange = (newFilters: ProductFiltersType) => {
    setFilters(newFilters);
  };

  // 篩選和排序商品
  const filteredProducts = products
    .filter(product => {
      if (filters.minPrice && product.price < filters.minPrice) return false;
      if (filters.maxPrice && product.price > filters.maxPrice) return false;
      if (filters.category && product.category !== filters.category) return false;
      if (filters.subCategory && product.subCategory !== filters.subCategory) return false;
      return true;
    })
    .sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating-desc':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">所有商品</h1>
      
      <div className="flex gap-8">
        {/* 側邊欄篩選器 */}
        <aside className="w-64 flex-shrink-0">
          <div className="sticky top-4">
            <ProductFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* 商品列表 */}
        <main className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products; 