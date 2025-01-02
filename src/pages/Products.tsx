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
  const [productsLoading, setProductsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 获取当前布局的每页商品数
  const pageSize = PAGE_SIZES[layout];

  console.log('Filters:', filters); // 添加调试日志

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 应用筛选条件
        let filteredProducts = [...mockProducts];

        // 价格筛选
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
          filteredProducts = filteredProducts.filter(product => {
            const price = product.price;
            if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
              return price >= filters.minPrice && price <= filters.maxPrice;
            }
            if (filters.minPrice !== undefined) {
              return price >= filters.minPrice;
            }
            if (filters.maxPrice !== undefined) {
              return price <= filters.maxPrice;
            }
            return true;
          });
        }

        // 分类筛选
        if (filters.category) {
          filteredProducts = filteredProducts.filter(
            product => product.category === filters.category
          );
        }

        // 排序
        if (filters.sort) {
          filteredProducts.sort((a, b) => {
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
        }

        // 分页
        const total = Math.ceil(filteredProducts.length / pageSize);
        setTotalPages(total);
        
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        setProducts(filteredProducts.slice(start, end));
        
        setError(null);
      } catch (err) {
        setError('加载商品失败，请稍后重试');
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, [filters, currentPage, pageSize]);

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