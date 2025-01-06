import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import Button from '../components/common/Button';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export const OrderComplete: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps currentStep={3} />
      
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-2xl font-medium mb-4">訂單已完成</h2>
          <p className="text-gray-600 mb-8">
            感謝您的購買！我們已收到您的訂單，並將盡快為您安排發貨。
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              variant="secondary"
              onClick={() => navigate('/orders')}
            >
              查看訂單
            </Button>
            <Button
              onClick={() => navigate('/products')}
            >
              繼續購物
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}; 