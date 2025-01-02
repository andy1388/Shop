import React, { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import type { ProductFilters } from '../../types/product';
import { productCategories } from '../../constants/categories';

interface ProductFiltersProps {
  filters: ProductFilters;
  onFilterChange: (newFilters: ProductFilters) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
  const [customMin, setCustomMin] = useState<string>('');
  const [customMax, setCustomMax] = useState<string>('');
  const [localMinPrice, setLocalMinPrice] = useState<number>(filters.minPrice || 0);
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(filters.maxPrice || 3000);
  const [priceError, setPriceError] = useState<string>('');

  // 使用防抖处理价格滑块变化
  const debouncedPriceChange = useCallback(
    debounce((min: number, max: number) => {
      onFilterChange({
        ...filters,
        minPrice: min === 0 ? undefined : min,
        maxPrice: max === 3000 ? undefined : max,
      });
    }, 500),
    [filters]
  );

  // 处理最小价格滑块变化
  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= localMaxPrice) {
      setLocalMinPrice(value);
      debouncedPriceChange(value, localMaxPrice);
    }
  };

  // 处理最大价格滑块变化
  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= localMinPrice) {
      setLocalMaxPrice(value);
      debouncedPriceChange(localMinPrice, value);
    }
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
    // 如果点击当前选中的分类，则清除所有分类筛选
    if (filters.category === category) {
      onFilterChange({
        ...filters,
        category: undefined,
        subCategory: undefined, // 清除子分类
      });
    } else {
      // 选择新分类时，清除子分类
      onFilterChange({
        ...filters,
        category,
        subCategory: undefined,
      });
    }
  };

  // 处理子分类变化
  const handleSubCategoryChange = (subCategory: string) => {
    onFilterChange({
      ...filters,
      subCategory: filters.subCategory === subCategory ? undefined : subCategory,
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
      setPriceError('價格不能為負數');
      return;
    }
    
    if (min !== undefined && max !== undefined && min > max) {
      setPriceError('最低價不能大於最高價');
      return;
    }

    setPriceError('');
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
    
    // 清空输入框
    setCustomMin('');
    setCustomMax('');
  };

  return (
    <div className="bg-white sticky top-4">
      {/* 价格区间 */}
      <div className="border-b border-gray-200 py-6">
        <h3 className="text-sm font-medium text-gray-900">價格區間</h3>
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

          {/* 自定义价格范围 */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                placeholder="最低價"
                className="w-24 px-2 py-1 border rounded text-sm"
                min="0"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                placeholder="最高價"
                className="w-24 px-2 py-1 border rounded text-sm"
                min="0"
              />
            </div>
            <button
              onClick={handleCustomPriceChange}
              className="w-full px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              應用價格範圍
            </button>
          </div>

          {/* 价格滑块 */}
          <div className="mt-6 px-2">
            <div className="relative h-2">
              {/* 滑块轨道背景 */}
              <div className="absolute w-full h-full bg-gray-200 rounded pointer-events-none"></div>
              
              {/* 活动范围显示 */}
              <div
                className="absolute h-full bg-blue-500 rounded pointer-events-none"
                style={{
                  left: `${(localMinPrice / 3000) * 100}%`,
                  right: `${100 - (localMaxPrice / 3000) * 100}%`,
                }}
              ></div>

              {/* 最小价格滑块 */}
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={localMinPrice}
                onChange={handleMinSliderChange}
                className="absolute w-full h-full appearance-none bg-transparent pointer-events-none
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-white 
                  [&::-webkit-slider-thumb]:border-2 
                  [&::-webkit-slider-thumb]:border-blue-500 
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-moz-range-thumb]:appearance-none 
                  [&::-moz-range-thumb]:h-4 
                  [&::-moz-range-thumb]:w-4 
                  [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-white 
                  [&::-moz-range-thumb]:border-2 
                  [&::-moz-range-thumb]:border-blue-500 
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:shadow-md
                  [&::-moz-range-thumb]:pointer-events-auto"
              />

              {/* 最大价格滑块 */}
              <input
                type="range"
                min="0"
                max="3000"
                step="50"
                value={localMaxPrice}
                onChange={handleMaxSliderChange}
                className="absolute w-full h-full appearance-none bg-transparent pointer-events-none
                  [&::-webkit-slider-thumb]:appearance-none 
                  [&::-webkit-slider-thumb]:h-4 
                  [&::-webkit-slider-thumb]:w-4 
                  [&::-webkit-slider-thumb]:rounded-full 
                  [&::-webkit-slider-thumb]:bg-white 
                  [&::-webkit-slider-thumb]:border-2 
                  [&::-webkit-slider-thumb]:border-blue-500 
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-webkit-slider-thumb]:shadow-md
                  [&::-webkit-slider-thumb]:pointer-events-auto
                  [&::-moz-range-thumb]:appearance-none 
                  [&::-moz-range-thumb]:h-4 
                  [&::-moz-range-thumb]:w-4 
                  [&::-moz-range-thumb]:rounded-full 
                  [&::-moz-range-thumb]:bg-white 
                  [&::-moz-range-thumb]:border-2 
                  [&::-moz-range-thumb]:border-blue-500 
                  [&::-moz-range-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:shadow-md
                  [&::-moz-range-thumb]:pointer-events-auto"
              />
            </div>

            {/* 价格范围显示 */}
            <div className="flex justify-between text-xs text-gray-500 mt-4">
              <span>HK${localMinPrice}</span>
              <span>HK${localMaxPrice === 3000 ? '3000+' : localMaxPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 分类 */}
      <div className="border-b border-gray-200 py-6">
        <h3 className="text-sm font-medium text-gray-900">分類</h3>
        <div className="mt-4 space-y-4">
          {Object.values(productCategories).map((category) => (
            <div key={category.id} className="space-y-2">
              <button
                className={`w-full text-left px-4 py-2 rounded font-medium ${
                  filters.category === category.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </button>
              
              {/* 子分类列表 - 仅在主分类被选中时显示 */}
              {filters.category === category.id && (
                <div className="ml-4 space-y-2">
                  {category.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      className={`w-full text-left px-4 py-1 rounded text-sm ${
                        filters.subCategory === sub.id
                          ? 'bg-blue-50 text-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleSubCategoryChange(sub.id)}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 排序 */}
      <div className="py-6">
        <h3 className="text-sm font-medium text-gray-900">排序</h3>
        <div className="mt-4 space-y-4">
          {[
            { value: 'newest', label: '最新' },
            { value: 'price-asc', label: '價格從低到高' },
            { value: 'price-desc', label: '價格從高到低' },
            { value: 'rating-desc', label: '評分最高' },
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

      {/* 错误信息 */}
      {priceError && (
        <p className="text-red-500 text-xs mt-1">{priceError}</p>
      )}
    </div>
  );
};

export default ProductFilters; 