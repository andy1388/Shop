import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import Button from '../components/common/Button';

type PaymentMethod = 'credit-card' | 'fps' | 'payme' | 'alipay' | 'wechat' | 'bank';

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('credit-card');

  const paymentMethods = [
    { id: 'credit-card', label: '信用卡付款', icon: '💳' },
    { id: 'fps', label: 'FPS轉數快', icon: '⚡' },
    { id: 'payme', label: 'Payme', icon: '📱' },
    { id: 'alipay', label: '支付寶 HK', icon: '💰' },
    { id: 'wechat', label: 'WeChat Pay', icon: '💬' },
    { id: 'bank', label: '銀行轉賬', icon: '🏦' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 處理付款
    navigate('/checkout/complete');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps currentStep={2} />
      
      <div className="max-w-2xl mx-auto mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">選擇付款方式</h2>
            <div className="space-y-2">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 border rounded cursor-pointer transition-colors
                    ${selectedMethod === method.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                    }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod)}
                    className="mr-3"
                  />
                  <span className="mr-3 text-xl">{method.icon}</span>
                  {method.label}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate('/checkout/shipping')}
            >
              返回
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              確認付款
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 