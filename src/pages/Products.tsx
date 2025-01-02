import React, { useState, useEffect } from 'react';
import ProductCard from '../components/product/ProductCard';
import ProductFilters from '../components/product/ProductFilters';
import ProductLayoutSwitch, { GridLayout } from '../components/product/ProductLayoutSwitch';
import Pagination from '../components/common/Pagination';
import type { Product, ProductFilters as Filters } from '../types/product';
import { mockProducts } from '../mocks/products';

// 根据布局定义每页商品数
const PAGE_SIZES: Record<GridLayout, number> = {
  '2': 8,  // 2列 x 4行
  '3': 9,  // 3列 x 3行
  '4': 12, // 4列 x 3行
};

const Products = () => {
  const [layout, setLayout] = useState<GridLayout>('3');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 获取当前布局的每页商品数
  const pageSize = PAGE_SIZES[layout];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const total = Math.ceil(mockProducts.length / pageSize);
        setTotalPages(total);
        
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setProducts(mockProducts.slice(start, end));
        
        setError(null);
      } catch (err) {
        setError('加载商品失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage, pageSize]);

  if (loading) {
    return <div>加载中...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-x-8">
        <div className="w-64 shrink-0">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">全部商品</h2>
            <ProductLayoutSwitch
              currentLayout={layout}
              onLayoutChange={setLayout}
            />
          </div>

          <div className={`grid gap-x-6 gap-y-10 ${
            layout === '2' ? 'grid-cols-1 sm:grid-cols-2' :
            layout === '3' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
            'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}>
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};

export default Products; 