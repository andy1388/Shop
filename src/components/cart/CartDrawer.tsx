import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../../store';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import Button from '../common/Button';
import SpecificationModal from './SpecificationModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);

  const handleQuantityChange = (id: string, delta: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    onClose();
  };

  const handleItemClick = (productId: string) => {
    navigate(`/products/${productId}`);
    onClose();
  };

  const handleRemoveItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeFromCart(id));
  };

  const handleViewCart = () => {
    navigate('/cart');
    onClose();
  };

  return (
    <>
      {/* 背景遮罩 */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={onClose}
        />
      )}

      {/* 購物車抽屜 */}
      <div 
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full flex flex-col">
          {/* 購物車頭部 */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">購物車 ({cart.count})</h2>
            <div className="flex items-center gap-4">
              {cart.items.length > 0 && (
                <button 
                  onClick={handleClearCart}
                  className="text-gray-500 hover:text-red-500"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* 購物車商品列表 */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.items.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                購物車是空的
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map(item => (
                  <div key={item.id} className="group relative flex gap-4 p-3 border rounded-lg">
                    <div 
                      className="flex flex-1 gap-4 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                      onClick={() => handleItemClick(item.productId)}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p 
                          className="text-sm text-gray-500 mt-1 cursor-pointer hover:text-blue-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedItem(item);
                          }}
                        >
                          {Object.entries(item.specifications)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-blue-600">HK${item.price}</div>
                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <button 
                              className="w-8 h-8 flex items-center justify-center border rounded-full hover:border-blue-500"
                              onClick={() => handleQuantityChange(item.id, -1, item.quantity)}
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button 
                              className="w-8 h-8 flex items-center justify-center border rounded-full hover:border-blue-500"
                              onClick={() => handleQuantityChange(item.id, 1, item.quantity)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => handleRemoveItem(item.id, e)}
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 購物車底部 */}
          {cart.items.length > 0 && (
            <div className="p-4 border-t bg-white space-y-4">
              <button
                onClick={handleViewCart}
                className="w-full flex items-center justify-center gap-2 py-2 
                         text-gray-600 hover:text-blue-600 border rounded-lg 
                         hover:border-blue-600 transition-colors"
              >
                <ShoppingBagIcon className="w-5 h-5" />
                查看購物車
              </button>

              <div className="flex justify-between mb-4">
                <span className="text-gray-600">總計：</span>
                <span className="text-xl font-semibold">HK${cart.total}</span>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => {
                  // TODO: 實現結帳功能
                  console.log('Checkout clicked');
                }}
              >
                前往結帳
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 添加規格選擇彈窗 */}
      {selectedItem && (
        <SpecificationModal
          isOpen={true}
          onClose={() => setSelectedItem(null)}
          item={selectedItem}
          availableSpecifications={{
            '顏色': ['黑色', '白色', '藍色', '灰色'],
            '尺碼': ['39', '40', '41', '42', '43', '44'],
            '材質': ['網布', '真皮', '人造皮革']
          }}
        />
      )}
    </>
  );
};

export default CartDrawer; 