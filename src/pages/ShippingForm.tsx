import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckoutSteps } from '../components/checkout/CheckoutSteps';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

interface ShippingFormData {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
}

export const ShippingForm: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ShippingFormData>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: ''
  });

  const [errors, setErrors] = useState<Partial<ShippingFormData>>({});

  const validateForm = () => {
    const newErrors: Partial<ShippingFormData> = {};
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
      // TODO: 保存配送資料
      navigate('/checkout/payment');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <CheckoutSteps currentStep={2} />
      
      <div className="max-w-2xl mx-auto mt-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">配送資料</h2>
            <div className="space-y-4">
              <Input
                name="fullName"
                placeholder="收件人姓名"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                error={errors.fullName}
              />
              <Input
                name="phone"
                placeholder="聯絡電話"
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
                placeholder="詳細地址"
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

          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => navigate('/checkout')}
            >
              返回
            </Button>
            <Button
              type="submit"
              className="flex-1"
            >
              下一步：選擇付款方式
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}; 