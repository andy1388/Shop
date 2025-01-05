import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import Button from '../common/Button';
import type { Product } from '../../types/product';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const AddToCartModal: React.FC<AddToCartModalProps> = ({
  isOpen,
  onClose,
  product
}) => {
  const dispatch = useDispatch();
  const [selectedSpecs, setSelectedSpecs] = useState<{[key: string]: string}>({});
  const [quantity, setQuantity] = useState(1);

  const handleSpecChange = (key: string, value: string) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    if (Object.keys(product.specifications).every(key => selectedSpecs[key])) {
      dispatch(addToCart({
        product,
        quantity,
        specifications: selectedSpecs
      }));
      onClose();
    }
  };

  const isSpecComplete = Object.keys(product.specifications).every(key => selectedSpecs[key]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-white rounded-lg p-6 w-[480px] max-h-[90vh] overflow-y-auto z-50">
        <div className="flex gap-4 mb-6 items-start">
          <div className="w-32 h-32 flex-shrink-0">
            <img 
              src={product.images[0]} 
              alt={product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <div className="text-xl font-medium text-blue-600">
              HK${product.price}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {Object.entries(product.specifications).map(([key, values]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {key}
              </label>
              <div className="flex flex-wrap gap-2">
                {values.map(value => (
                  <button
                    key={value}
                    className={`px-3 py-1 rounded-full border ${
                      selectedSpecs[key] === value
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSpecChange(key, value)}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              數量
            </label>
            <div className="flex items-center gap-3 w-fit">
              <button 
                className="w-8 h-8 flex items-center justify-center border rounded-full hover:border-blue-500"
                onClick={() => quantity > 1 && setQuantity(q => q - 1)}
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button 
                className="w-8 h-8 flex items-center justify-center border rounded-full hover:border-blue-500"
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button 
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            取消
          </Button>
          <Button 
            className="flex-1"
            onClick={handleSubmit}
            disabled={!isSpecComplete}
          >
            加入購物車
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddToCartModal; 