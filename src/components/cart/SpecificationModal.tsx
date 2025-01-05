import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItemSpecifications, addToCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import { toastConfig } from '../../config/toastConfig';

interface SpecificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    specifications: {
      [key: string]: string;
    };
  };
  availableSpecifications: {
    [key: string]: string[];
  };
  isNewItem?: boolean;
}

const SpecificationModal: React.FC<SpecificationModalProps> = ({
  isOpen,
  onClose,
  item,
  availableSpecifications,
  isNewItem = false
}) => {
  const dispatch = useDispatch();
  const [selectedSpecs, setSelectedSpecs] = useState(item.specifications);
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleSpecChange = (e: React.MouseEvent, key: string, value: string) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedSpecs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation();
    e.preventDefault();
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (Object.keys(availableSpecifications).every(key => selectedSpecs[key])) {
      if (isNewItem) {
        dispatch(addToCart({
          product: {
            id: item.productId,
            name: item.name,
            price: item.price,
            images: [item.image],
            specifications: availableSpecifications
          },
          quantity,
          specifications: selectedSpecs
        }));
        toast.success('成功加入購物車！', toastConfig.success);
      } else {
        dispatch(updateCartItemSpecifications({
          itemId: item.id,
          specifications: selectedSpecs,
          quantity
        }));
        toast.success('成功更新商品！', toastConfig.success);
      }
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div onClick={handleModalClick}>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClose();
        }}
      />
      <div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-white rounded-lg p-6 w-[480px] max-h-[90vh] overflow-y-auto z-50"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
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
                    onClick={(e) => handleSpecChange(e, key, value)}
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
                onClick={(e) => handleQuantityChange(e, -1)}
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button 
                className="w-8 h-8 flex items-center justify-center border rounded-full hover:border-blue-500"
                onClick={(e) => handleQuantityChange(e, 1)}
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
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClose();
            }}
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
    </div>
  );
};

export default SpecificationModal; 