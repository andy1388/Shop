import React from 'react';

export type GridLayout = '2' | '3' | '4';

interface ProductLayoutSwitchProps {
  currentLayout: GridLayout;
  onLayoutChange: (layout: GridLayout) => void;
}

const ProductLayoutSwitch: React.FC<ProductLayoutSwitchProps> = ({
  currentLayout,
  onLayoutChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-700">布局:</span>
      <div className="flex border rounded-lg overflow-hidden">
        <button
          className={`px-3 py-1 text-sm ${
            currentLayout === '2'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onLayoutChange('2')}
        >
          2列
        </button>
        <button
          className={`px-3 py-1 text-sm border-l ${
            currentLayout === '3'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onLayoutChange('3')}
        >
          3列
        </button>
        <button
          className={`px-3 py-1 text-sm border-l ${
            currentLayout === '4'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => onLayoutChange('4')}
        >
          4列
        </button>
      </div>
    </div>
  );
};

export default ProductLayoutSwitch; 