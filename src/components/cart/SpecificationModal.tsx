import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItemSpecifications } from '../../store/slices/cartSlice';
import Button from '../common/Button';

interface SpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    specifications: {
      [key: string]: string;
    };
  };
  availableSpecifications: {
    [key: string]: string[];
  };
}

const SpecificationModal: React.FC<SpecificationModalProps> = ({
  isOpen,
  onClose,
  item,
  availableSpecifications,
}) => {
  const dispatch = useDispatch();
  const [selectedSpecs, setSelectedSpecs] = useState(item.specifications);

  const handleSpecChange = (key: string, value: string) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    dispatch(updateCartItemSpecifications({
      itemId: item.id,
      specifications: selectedSpecs
    }));
    onClose();
  };

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
              src={item.image} 
              alt={item.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
            <p className="text-sm text-gray-500 mb-2">
              當前規格：
              {Object.entries(item.specifications)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ')}
            </p>
            <div className="text-xl font-medium text-blue-600">
              HK${item.price}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {Object.entries(availableSpecifications).map(([key, values]) => (
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
          >
            確認
          </Button>
        </div>
      </div>
    </>
  );
};

export default SpecificationModal; 