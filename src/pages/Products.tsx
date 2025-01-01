import React from 'react'
import Card from '../components/common/Card'
import Button from '../components/common/Button'

const Products = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <Card key={item} className="flex flex-col">
            <h2 className="text-xl font-semibold mb-2">Product {item}</h2>
            <p className="text-gray-600 mb-4">This is a sample product description.</p>
            <Button className="mt-auto">Add to Cart</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Products 