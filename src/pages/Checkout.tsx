import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import Button from '../components/common/Button';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);
  const [couponCode, setCouponCode] = useState('');

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 mb-4">購物車是空的，無法結帳</p>
        <Button onClick={() => navigate('/products')}>
          去購物
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps currentStep={1} />
      
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* 訂單商品列表 */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">訂單商品</h2>
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {Object.entries(item.specifications)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ')}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-gray-600">
                        數量: {item.quantity}
                      </span>
                      <span className="font-medium">
                        HK${item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 訂單摘要 */}
        <div className="lg:w-80">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium mb-4">訂單摘要</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">商品總額</span>
                <span>HK${cart.total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">運費</span>
                <span>HK$60.00</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>優惠折扣</span>
                <span>-HK$0.00</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between font-medium">
                  <span>應付總額</span>
                  <span>HK${cart.total + 60}</span>
                </div>
              </div>

              {/* 優惠碼 */}
              <div className="flex gap-2 mt-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="請輸入優惠碼"
                  className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
                <Button 
                  variant="secondary"
                  onClick={() => {
                    // TODO: 處理優惠碼
                    console.log('Apply coupon:', couponCode);
                  }}
                >
                  套用
                </Button>
              </div>

              <Button 
                className="w-full mt-6"
                onClick={() => navigate('/checkout/shipping')}
              >
                下一步：填寫配送資料
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 