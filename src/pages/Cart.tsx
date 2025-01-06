import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { RootState } from '../store';
import type { CartItem } from '../types/cart';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import Button from '../components/common/Button';
import SpecificationModal from '../components/cart/SpecificationModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { toastConfig } from '../config/toastConfig';

const Cart: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const handleQuantityChange = (id: string, value: string, currentQuantity: number) => {
    const newQuantity = parseInt(value);
    
    // 檢查是否為有效數字
    if (isNaN(newQuantity)) return;
    
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

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success('購物車已清空', toastConfig.success);
  };

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">購物車</h1>
          <p className="text-gray-500 mb-4">購物車是空的</p>
          <Button onClick={() => navigate('/products')}>
            繼續購物
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">購物車 ({cart.count})</h1>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="text-gray-500 hover:text-red-500 flex items-center gap-2"
          >
            <TrashIcon className="w-5 h-5" />
            清空購物車
          </button>
        </div>

        {/* 購物車商品列表 */}
        <div className="space-y-4 mb-8">
          {cart.items.map(item => (
            <div key={item.id} className="flex gap-6 p-4 bg-white rounded-lg shadow">
              <div 
                className="w-24 h-24 cursor-pointer"
                onClick={() => navigate(`/products/${item.productId}`)}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="flex-1">
                <h3 
                  className="font-medium text-lg mb-2 cursor-pointer hover:text-blue-600"
                  onClick={() => navigate(`/products/${item.productId}`)}
                >
                  {item.name}
                </h3>
                <p 
                  className="text-sm text-gray-500 mb-4 cursor-pointer hover:text-blue-600"
                  onClick={() => setSelectedItem(item)}
                >
                  {Object.entries(item.specifications)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(', ')}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-medium text-blue-600">
                    HK${item.price}
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <button 
                        className="w-8 h-8 flex items-center justify-center border rounded-full hover:border-blue-500"
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
                        className="w-16 text-center border rounded px-2 py-1 focus:outline-none focus:border-blue-500
                                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button 
                        className="w-8 h-8 flex items-center justify-center border rounded-full hover:border-blue-500"
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

        {/* 結算區域 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">商品總計：</span>
            <span className="text-2xl font-bold">HK${cart.total}</span>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="secondary"
              className="flex-1"
              onClick={() => navigate('/products')}
            >
              繼續購物
            </Button>
            <Button 
              className="flex-1"
              onClick={() => {
                // TODO: 實現結帳功能
                console.log('Checkout clicked');
              }}
            >
              前往結帳
            </Button>
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
      </div>
    </div>
  );
};

export default Cart; 