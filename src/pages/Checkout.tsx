import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import Button from '../components/common/Button';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState<string>('');

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      setCouponError('請輸入優惠碼');
      return;
    }

    const validCoupons = {
      'SHOP20': { discount: 20, message: '20元 優惠券' },
      'Shop50': { discount: 50, message: '50元 優惠券' },
      'NewUser': { discount: 30, message: '新用戶優惠券' },
      'Summer100': { discount: 100, message: '夏季優惠券' },
    };

    const coupon = validCoupons[couponCode];
    
    if (coupon) {
      setDiscount(coupon.discount);
      setCouponError('');
      toast('已套用優惠碼', {
        duration: 2000,
        position: 'top-right',
        className: 'bg-green-500 text-white px-4 py-2 rounded-md shadow-md',
        icon: '✓',
      });
    } else {
      setDiscount(null);
      setCouponError('無效的優惠碼');
      toast('優惠碼無效', {
        duration: 2000,
        position: 'top-right',
        className: 'bg-red-500 text-white px-4 py-2 rounded-md shadow-md',
        icon: '×',
      });
    }
  };

  const subtotal = cart.total;
  const shipping = 60;
  const finalTotal = subtotal + shipping - (discount || 0);

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
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">商品總額</span>
                <span>HK${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">運費</span>
                <span>HK${shipping}</span>
              </div>
              {discount !== null && (
                <div className="flex justify-between text-green-600">
                  <span>優惠折扣</span>
                  <span>-HK${discount}</span>
                </div>
              )}
              <div className="pt-3 border-t">
                <div className="flex justify-between font-medium text-lg">
                  <span>應付總額</span>
                  <span>HK${finalTotal}</span>
                </div>
              </div>
            </div>

            {/* 優惠碼 */}
            <div className="mt-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value);
                      setCouponError('');
                    }}
                    placeholder="請輸入優惠碼"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200
                      ${couponError ? 'border-red-500' : 'border-gray-300'}`}
                  />
                </div>
                <Button 
                  variant="secondary"
                  className="px-6 py-2 whitespace-nowrap bg-gray-100 hover:bg-gray-200"
                  onClick={handleApplyCoupon}
                >
                  套用
                </Button>
              </div>
              {couponError && (
                <p className="text-red-500 text-sm mt-1">{couponError}</p>
              )}
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
  );
}; 