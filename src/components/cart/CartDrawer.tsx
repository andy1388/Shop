import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../../store';
import type { CartItem } from '../../types/cart';
import { removeFromCart, updateQuantity, clearCart } from '../../store/slices/cartSlice';
import Button from '../common/Button';
import SpecificationModal from './SpecificationModal';
import ConfirmDialog from '../common/ConfirmDialog';
import toast from 'react-hot-toast';
import { toastConfig } from '../../config/toastConfig';
import type { Product } from '../../types/product';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const cart = useSelector((state: RootState) => state.cart);
  const products = useSelector((state: RootState) => state.products.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleQuantityChange = (id: string, value: string, currentQuantity: number) => {
    const newQuantity = parseInt(value);
    
    // 檢查是否為有效數字
    if (isNaN(newQuantity)) return;
    
    const item = cart.items.find(item => item.id === id);
    const product = products.find(p => p.id === item?.productId);
    
    // 檢查庫存
    if (product && newQuantity > product.stock) {
      toast.error(`庫存僅剩 ${product.stock} 件`, toastConfig.error);
      return;
    }
    
    // 檢查範圍 (1-99)
    if (newQuantity >= 1 && newQuantity <= 99) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
    } else if (newQuantity < 1) {
      setItemToDelete(id);
    } else {
      toast.error('單個商品數量不能超過99件', toastConfig.error);
    }
  };

  const handleRemoveItem = (id: string) => {
    setItemToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete));
      toast.success('商品已從購物車中移除', toastConfig.success);
      setItemToDelete(null);
    }
  };

  const handleCheckout = () => {
    navigate('/cart');
    onClose();
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('購物車已清空', toastConfig.success);
    setIsConfirmOpen(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 h-full w-[480px] bg-white shadow-lg z-50
                      transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">購物車 ({cart.count})</h2>
            <div className="flex items-center gap-2">
              {cart.items.length > 0 && (
                <button
                  onClick={() => setIsConfirmOpen(true)}
                  className="text-gray-500 hover:text-red-500 flex items-center gap-1"
                >
                  <TrashIcon className="w-5 h-5" />
                  <span className="text-sm">清空</span>
                </button>
              )}
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {cart.items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">購物車是空的</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.items.map(item => (
                  <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-md cursor-pointer"
                      onClick={() => {
                        navigate(`/products/${item.productId}`);
                        onClose();
                      }}
                    />
                    <div className="flex-1">
                      <h3 
                        className="font-medium mb-1 cursor-pointer hover:text-blue-600"
                        onClick={() => {
                          navigate(`/products/${item.productId}`);
                          onClose();
                        }}
                      >
                        {item.name}
                      </h3>
                      <p 
                        className="text-sm text-gray-500 mb-2 cursor-pointer hover:text-blue-600"
                        onClick={() => setSelectedItem(item)}
                      >
                        {Object.entries(item.specifications)
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(', ')}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-blue-600 font-medium">
                          HK${item.price}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button 
                              className="w-6 h-6 flex items-center justify-center border rounded-full hover:border-blue-500"
                              onClick={() => handleQuantityChange(item.id, String(item.quantity - 1), item.quantity)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max="99"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value, item.quantity)}
                              className="w-12 text-center border rounded px-1 py-0.5 focus:outline-none focus:border-blue-500
                                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <button 
                              className="w-6 h-6 flex items-center justify-center border rounded-full hover:border-blue-500"
                              onClick={() => handleQuantityChange(item.id, String(item.quantity + 1), item.quantity)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">商品總計：</span>
                  <span className="text-xl font-bold">HK${cart.total}</span>
                </div>
                <Button 
                  className="w-full"
                  onClick={handleCheckout}
                >
                  前往結帳
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 清空購物車確認對話框 */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleClearCart}
        title="清空購物車"
        message="確定要清空購物車嗎？此操作無法撤銷。"
      />

      {/* 刪除單個商品確認對話框 */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="移除商品"
        message="確定要從購物車中移除此商品嗎？"
      />

      {/* 規格選擇彈窗 */}
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