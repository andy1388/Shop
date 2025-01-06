import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../store';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  paymentMethod: 'credit-card' | 'apple-pay' | 'google-pay';
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart);
  const [form, setForm] = useState<CheckoutForm>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    paymentMethod: 'credit-card'
  });

  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});

  // 表單驗證
  const validateForm = () => {
    const newErrors: Partial<CheckoutForm> = {};
    
    if (!form.fullName) newErrors.fullName = '請輸入姓名';
    if (!form.phone) newErrors.phone = '請輸入電話';
    if (!form.email) newErrors.email = '請輸入電子郵件';
    if (!form.address) newErrors.address = '請輸入地址';
    if (!form.city) newErrors.city = '請輸入城市';
    if (!form.district) newErrors.district = '請輸入地區';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: 處理訂單提交
      console.log('提交訂單:', form);
    }
  };

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
      <h1 className="text-2xl font-bold mb-8">結帳</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 結帳表單 */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">收貨資料</h2>
              <div className="space-y-4">
                <Input
                  name="fullName"
                  placeholder="姓名"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  error={errors.fullName}
                />
                <Input
                  name="phone"
                  placeholder="電話"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={errors.phone}
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="電子郵件"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                />
                <Input
                  name="address"
                  placeholder="地址"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  error={errors.address}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="city"
                    placeholder="城市"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    error={errors.city}
                  />
                  <Input
                    name="district"
                    placeholder="地區"
                    value={form.district}
                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                    error={errors.district}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium mb-4">付款方式</h2>
              <div className="space-y-2">
                {[
                  { id: 'credit-card', label: '信用卡' },
                  { id: 'apple-pay', label: 'Apple Pay' },
                  { id: 'google-pay', label: 'Google Pay' }
                ].map((method) => (
                  <label
                    key={method.id}
                    className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={form.paymentMethod === method.id}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as CheckoutForm['paymentMethod'] })}
                      className="mr-3"
                    />
                    {method.label}
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* 訂單摘要 */}
        <div className="lg:w-80">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">訂單摘要</h2>
            <div className="space-y-4">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-3">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      數量: {item.quantity}
                    </p>
                    <p className="text-sm font-medium">
                      HK${item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">商品總計</span>
                  <span>HK${cart.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">運費</span>
                  <span>免費</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>總計</span>
                    <span>HK${cart.total}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              type="submit"
              className="w-full mt-4"
              onClick={handleSubmit}
            >
              提交訂單
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 