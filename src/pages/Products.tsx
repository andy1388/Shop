import React, { useState, useEffect, useMemo } from 'react';
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
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 获取当前布局的每页商品数
  const pageSize = PAGE_SIZES[layout];

  console.log('Filters:', filters); // 添加调试日志

  // 统一的筛选逻辑
  const getFilteredProducts = (products: Product[], filters: Filters) => {
    return products.filter((product) => {
      // 价格筛选
      if (filters.minPrice && product.price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && product.price > filters.maxPrice) {
        return false;
      }

      // 分类筛选
      if (filters.category) {
        if (filters.subCategory) {
          return product.category === filters.category && 
                 product.subCategory === filters.subCategory;
        }
        return product.category === filters.category;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sort) {
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
      }
      return 0;
    });
  };

  // 使用统一的筛选逻辑
  const filteredProducts = useMemo(() => {
    return getFilteredProducts(mockProducts, filters);
  }, [filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 使用统一的筛选逻辑
        const filtered = getFilteredProducts(mockProducts, filters);
        
        // 分页
        const total = Math.ceil(filtered.length / pageSize);
        setTotalPages(total);
        
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setProducts(filtered.slice(start, end));
        
        setError(null);
      } catch (err) {
        setError('加载商品失败，请稍后重试');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage, pageSize]);

  // 在组件中添加调试日志
  useEffect(() => {
    console.log('Filters changed:', filters);
  }, [filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="flex gap-x-8">
        <aside className="w-64 shrink-0 bg-white">
          <ProductFilters
            filters={filters}
            onFilterChange={setFilters}
          />
        </aside>

        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">全部商品</h2>
            <ProductLayoutSwitch
              currentLayout={layout}
              onLayoutChange={setLayout}
            />
          </div>

          <div className="relative min-h-[400px]">
            <div className={`grid gap-x-6 gap-y-10 ${
              layout === '2' ? 'grid-cols-1 sm:grid-cols-2' :
              layout === '3' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
            }`}>
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {productsLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10">
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  <span className="mt-2 text-gray-500">加载中...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-red-500">{error}</div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Products; 