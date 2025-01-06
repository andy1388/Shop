import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/products', label: '商品管理', icon: '📦' },
    { path: '/admin/orders', label: '訂單管理', icon: '📝' },
    { path: '/admin/settings', label: '網站設定', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* 左側導航欄 */}
      <div className="w-64 bg-[#2D3748] text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">手作生活後台</h1>
        </div>
        <nav className="mt-4">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm
                ${location.pathname === item.path 
                  ? 'bg-blue-600' 
                  : 'hover:bg-gray-700'}`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1">
        <header className="bg-white shadow">
          <div className="flex justify-between items-center px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.label || '儀表板'}
            </h2>
          </div>
        </header>
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}; 