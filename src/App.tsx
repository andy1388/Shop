import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './store'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Sidebar from './components/layout/Sidebar'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import { checkSession } from './store/slices/authSlice'
import CartDrawer from './components/cart/CartDrawer'
import { ShoppingCartIcon } from '@heroicons/react/24/outline'
import Favorites from './pages/Favorites'
import Cart from './pages/Cart'
import { Toaster } from 'react-hot-toast'
import { ShippingForm } from './pages/ShippingForm'
import { Payment } from './pages/Payment'
import { OrderComplete } from './pages/OrderComplete'
import { Checkout } from './pages/Checkout'

function App() {
  const dispatch = useDispatch()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const cartCount = useSelector((state: RootState) => state.cart.count)

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
              <Route path="/cart" element={<Cart />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkout/shipping" element={<ShippingForm />} />
              <Route path="/checkout/payment" element={<Payment />} />
              <Route path="/checkout/complete" element={<OrderComplete />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsCartOpen(true)}
          className="p-3 rounded-full bg-blue-600 text-white
                     shadow-lg hover:bg-blue-700 transition-colors"
        >
          <ShoppingCartIcon className="w-6 h-6" />
        </button>
        {cartCount > 0 && (
          <div className="absolute -top-2 -right-2 w-6 h-6 
                         bg-red-500 text-white text-xs rounded-full 
                         flex items-center justify-center font-medium">
            {cartCount}
          </div>
        )}
      </div>
      
      <Toaster />
    </Router>
  )
}

export default App 