import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-50 h-screen">
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
          </li>
          <li>
            <Link to="/products" className="text-gray-700 hover:text-blue-600">Products</Link>
          </li>
          <li>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">About</Link>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar 