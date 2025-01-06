import React from 'react'
import { NavLink } from 'react-router-dom'
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ShoppingCartIcon, 
  HeartIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline'

const Sidebar: React.FC = () => {
  const navItems = [
    { path: '/', name: '首頁', icon: HomeIcon },
    { path: '/products', name: '商品', icon: ShoppingBagIcon },
    { path: '/cart', name: '購物車', icon: ShoppingCartIcon },
    { path: '/favorites', name: '收藏', icon: HeartIcon },
    { path: '/about', name: '關於', icon: InformationCircleIcon }
  ]

  return (
    <nav className="w-48 bg-white shadow-sm">
      <ul className="py-4">
        {navItems.map(item => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-2
                ${isActive 
                  ? 'text-blue-600 bg-blue-50' 
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar 