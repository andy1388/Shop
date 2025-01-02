import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import type { ProductFilters } from '../../types/product';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFilterChange: (newFilters: ProductFilters) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
  const [customMin, setCustomMin] = useState<string>('');
  const [customMax, setCustomMax] = useState<string>('');
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(filters.maxPrice || 5000);

  // 使用防抖处理价格滑块变化
  const debouncedPriceChange = useCallback(
    debounce((value: number) => {
      onFilterChange({
        ...filters,
        maxPrice: value === 5000 ? undefined : value,
      });
    }, 500),  // 500ms 延迟
    [filters]
  );

  // 处理滑块变化
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setLocalMaxPrice(value);  // 立即更新本地状态
    debouncedPriceChange(value);  // 延迟更新筛选
  };

  // 处理价格范围变化
  const handlePriceChange = (min?: number, max?: number) => {
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  // 处理分类变化
  const handleCategoryChange = (category: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? undefined : category,
    });
  };

  // 处理排序变化
  const handleSortChange = (sort: ProductFilters['sort']) => {
    onFilterChange({
      ...filters,
      sort,
    });
  };

  // 处理自定义价格范围
  const handleCustomPriceChange = () => {
    const min = customMin ? Number(customMin) : undefined;
    const max = customMax ? Number(customMax) : undefined;
    
    if ((min !== undefined && min < 0) || (max !== undefined && max < 0)) {
      return; // 不允许负数
    }
    
    if (min !== undefined && max !== undefined && min > max) {
      return; // 最小值不能大于最大值
    }

    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  return (
    <div className="bg-white sticky top-4">
      {/* 价格区间 */}
      <div className="border-b border-gray-200 py-6">
        <h3 className="text-sm font-medium text-gray-900">价格区间</h3>
        <div className="mt-4 space-y-4">
          <button
            className={`w-full text-left px-4 py-2 rounded ${
              !filters.minPrice && !filters.maxPrice
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handlePriceChange(undefined, undefined)}
          >
            全部
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded ${
              filters.maxPrice === 500 ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => handlePriceChange(0, 500)}
          >
            HK$500以下
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded ${
              filters.minPrice === 500 && filters.maxPrice === 1000
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50'
            }`}
            onClick={() => handlePriceChange(500, 1000)}
          >
            HK$500 - HK$1000
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded ${
              filters.minPrice === 1000 ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
            }`}
            onClick={() => handlePriceChange(1000, undefined)}
          >
            HK$1000以上
          </button>

          {/* 添加自定义价格范围 */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                placeholder="最低价"
                className="w-24 px-2 py-1 border rounded text-sm"
                min="0"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                placeholder="最高价"
                className="w-24 px-2 py-1 border rounded text-sm"
                min="0"
              />
            </div>
            <button
              onClick={handleCustomPriceChange}
              className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              应用价格范围
            </button>
          </div>

          {/* 价格滑块 */}
          <div className="mt-6">
            <input
              type="range"
              min="0"
              max="5000"
              step="100"
              value={localMaxPrice}
              onChange={handleSliderChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>HK$0</span>
              <span>
                {localMaxPrice === 5000 ? 'HK$5000+' : `HK$${localMaxPrice}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 分类 */}
      <div className="border-b border-gray-200 py-6">
        <h3 className="text-sm font-medium text-gray-900">分类</h3>
        <div className="mt-4 space-y-4">
          {['shoes', 'bags', 'clothes'].map((category) => (
            <button
              key={category}
              className={`w-full text-left px-4 py-2 rounded ${
                filters.category === category
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category === 'shoes' && '鞋类'}
              {category === 'bags' && '箱包'}
              {category === 'clothes' && '服装'}
            </button>
          ))}
        </div>
      </div>

      {/* 排序 */}
      <div className="py-6">
        <h3 className="text-sm font-medium text-gray-900">排序</h3>
        <div className="mt-4 space-y-4">
          {[
            { value: 'newest', label: '最新' },
            { value: 'price-asc', label: '价格从低到高' },
            { value: 'price-desc', label: '价格从高到低' },
            { value: 'rating-desc', label: '评分最高' },
          ].map((option) => (
            <button
              key={option.value}
              className={`w-full text-left px-4 py-2 rounded ${
                filters.sort === option.value
                  ? 'bg-blue-50 text-blue-600'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleSortChange(option.value as ProductFilters['sort'])}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductFilters; 