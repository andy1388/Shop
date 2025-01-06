import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 臨時驗證邏輯：使用固定的帳號密碼
    if (form.username === 'admin' && form.password === 'admin123') {
      // 模擬成功登入
      localStorage.setItem('adminToken', 'dummy-token');
      navigate('/admin/dashboard');
    } else {
      // 可以添加錯誤提示
      alert('帳號或密碼錯誤');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">管理員登入</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="username"
            type="text"
            placeholder="管理員帳號"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <Input
            name="password"
            type="password"
            placeholder="密碼"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" className="w-full">
            登入
          </Button>
        </form>
      </div>
    </div>
  );
}; 