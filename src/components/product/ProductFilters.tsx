import React, { useState, useCallback } from 'react';
import { debounce } from 'lodash';
import type { ProductFilters as ProductFiltersType } from '../../types/product';
import { productCategories } from '../../constants/categories';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFilterChange: (filters: ProductFiltersType) => void;
}

// 修改這裡：改為命名導出
export const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange }) => {
  const [customMin, setCustomMin] = useState<string>('');
  const [customMax, setCustomMax] = useState<string>('');
  const [localMinPrice, setLocalMinPrice] = useState<number>(filters.minPrice || 0);
  const [localMaxPrice, setLocalMaxPrice] = useState<number>(filters.maxPrice || 3000);
  const [priceError, setPriceError] = useState<string>('');

  // 使用防抖處理價格變化
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

  // 處理價格範圍變化
  const handlePriceChange = (min?: number, max?: number) => {
    onFilterChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  // 處理自定義價格範圍
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
    
    setCustomMin('');
    setCustomMax('');
  };

  // 處理最小價格滑塊變化
  const handleMinSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= localMaxPrice) {
      setLocalMinPrice(value);
      debouncedPriceChange(value, localMaxPrice);
    }
  };

  // 處理最大價格滑塊變化
  const handleMaxSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= localMinPrice) {
      setLocalMaxPrice(value);
      debouncedPriceChange(localMinPrice, value);
    }
  };

  // 處理排序變更
  const handleSortChange = (sort: ProductFiltersType['sort']) => {
    onFilterChange({
      ...filters,
      sort: filters.sort === sort ? undefined : sort
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="space-y-6">
        {/* 價格範圍 */}
        <div>
          <h3 className="text-lg font-medium mb-4">價格範圍</h3>
          <div className="space-y-2">
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                !filters.minPrice && !filters.maxPrice ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => handlePriceChange(undefined, undefined)}
            >
              全部
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                filters.maxPrice === 500 ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => handlePriceChange(0, 500)}
            >
              HK$500以下
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                filters.minPrice === 500 && filters.maxPrice === 1000 ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => handlePriceChange(500, 1000)}
            >
              HK$500 - HK$1000
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                filters.minPrice === 1000 ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
              }`}
              onClick={() => handlePriceChange(1000, undefined)}
            >
              HK$1000以上
            </button>
          </div>

          {/* 自定義價格範圍 */}
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value)}
                placeholder="最低價"
                className="w-full px-3 py-2 border rounded"
                min="0"
              />
              <span>-</span>
              <input
                type="number"
                value={customMax}
                onChange={(e) => setCustomMax(e.target.value)}
                placeholder="最高價"
                className="w-full px-3 py-2 border rounded"
                min="0"
              />
            </div>
            {priceError && (
              <p className="text-red-500 text-sm">{priceError}</p>
            )}
            <button
              onClick={handleCustomPriceChange}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              確定
            </button>
          </div>
        </div>

        {/* 價格滑塊 */}
        <div className="mt-6 px-2">
          <div className="relative h-2">
            {/* 滑塊軌道背景 */}
            <div className="absolute w-full h-full bg-gray-200 rounded pointer-events-none"></div>
            
            {/* 活動範圍顯示 */}
            <div
              className="absolute h-full bg-blue-500 rounded pointer-events-none"
              style={{
                left: `${(localMinPrice / 3000) * 100}%`,
                right: `${100 - (localMaxPrice / 3000) * 100}%`,
              }}
            ></div>

            {/* 最小價格滑塊 */}
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

            {/* 最大價格滑塊 */}
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

          {/* 價格範圍顯示 */}
          <div className="flex justify-between text-xs text-gray-500 mt-4">
            <span>HK${localMinPrice}</span>
            <span>HK${localMaxPrice === 3000 ? '3000+' : localMaxPrice}</span>
          </div>
        </div>

        {/* 分類篩選 */}
        <div>
          <h3 className="text-lg font-medium mb-4">分類</h3>
          <div className="space-y-2">
            {Object.values(productCategories).map((category) => (
              <div key={category.id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded ${
                    filters.category === category.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onFilterChange({
                    ...filters,
                    category: filters.category === category.id ? undefined : category.id,
                    subCategory: undefined
                  })}
                >
                  {category.name}
                </button>
                {filters.category === category.id && (
                  <div className="ml-4 mt-2 space-y-2">
                    {category.subcategories.map((sub) => (
                      <button
                        key={sub.id}
                        className={`w-full text-left px-3 py-1 rounded text-sm ${
                          filters.subCategory === sub.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => onFilterChange({
                          ...filters,
                          subCategory: filters.subCategory === sub.id ? undefined : sub.id
                        })}
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

        {/* 排序選項 - 移到這裡 */}
        <div>
          <h3 className="text-lg font-medium mb-4">排序方式</h3>
          <div className="space-y-2">
            {[
              { value: 'newest', label: '最新' },
              { value: 'price-asc', label: '價格從低到高' },
              { value: 'price-desc', label: '價格從高到低' },
              { value: 'rating-desc', label: '評分最高' }
            ].map((option) => (
              <button
                key={option.value}
                className={`w-full text-left px-3 py-2 rounded ${
                  filters.sort === option.value
                    ? 'bg-blue-50 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSortChange(option.value as ProductFiltersType['sort'])}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* 清除所有篩選 */}
        {(filters.minPrice !== undefined || 
          filters.maxPrice !== undefined || 
          filters.category !== undefined || 
          filters.sort !== undefined) && (
          <button
            onClick={() => {
              onFilterChange({});
              setCustomMin('');
              setCustomMax('');
              setLocalMinPrice(0);
              setLocalMaxPrice(3000);
            }}
            className="w-full mt-4 px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
          >
            清除所有篩選
          </button>
        )}
      </div>
    </div>
  );
}; 