import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import { useDispatch } from 'react-redux'
import { checkSession } from './store/slices/authSlice'
import CartDrawer from './components/cart/CartDrawer'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import Favorites from './pages/Favorites'

function App() {
  const dispatch = useDispatch()
  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    dispatch(checkSession())
  }, [dispatch])

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-blue-600 text-white
                   shadow-lg hover:bg-blue-700 transition-colors"
      >
        <ShoppingCartIcon className="w-6 h-6" />
      </button>
    </Router>
  )
}

export default App 