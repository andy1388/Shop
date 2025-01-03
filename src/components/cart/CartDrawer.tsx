import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../../store';
import { removeFromCart, updateQuantity } from '../../store/slices/cartSlice';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  return (
    <div 
      className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
                  ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="h-full flex flex-col">
        {/* 購物車頭部 */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">購物車 ({cart.count})</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 購物車商品列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.items.map(item => (
            <div key={item.id} className="flex gap-4 mb-4 p-2 border rounded-lg">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600">HK${item.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button 
                    className="px-2 py-1 border rounded"
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: Math.max(0, item.quantity - 1) }))}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    className="px-2 py-1 border rounded"
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                  >
                    +
                  </button>
                </div>
              </div>
              <button 
                onClick={() => dispatch(removeFromCart(item.id))}
                className="text-red-500 hover:text-red-600"
              >
                刪除
              </button>
            </div>
          ))}
        </div>

        {/* 購物車底部 */}
        <div className="p-4 border-t">
          <div className="flex justify-between mb-4">
            <span>總計：</span>
            <span className="font-semibold">HK${cart.total}</span>
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            結帳
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer; 