import React from 'react'
import Card from '../components/common/Card'

const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Shop</h1>
      <Card>
        <p className="text-gray-600">Discover our amazing products</p>
      </Card>
    </div>
  )
}

export default Home 