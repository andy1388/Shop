import type { Product } from '../types/product';
import { productCategories } from '../constants/categories';

// 示例商品数据
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Nike Air Zoom 跑步鞋',
    category: 'shoes',
    subCategory: 'running',
    price: 899,
    originalPrice: 1099,
    // ... 其他属性
  },
  {
    id: '2',
    name: 'Adidas 休閒運動鞋',
    category: 'shoes',
    subCategory: 'casual',
    price: 699,
    originalPrice: 899,
    // ... 其他属性
  },
  {
    id: '3',
    name: '防水雙肩包',
    category: 'bags',
    subCategory: 'backpack',
    price: 459,
    originalPrice: 599,
    // ... 其他属性
  },
  // ... 更多示例商品
];

// 生成商品数据时使用分类结构
const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const categories = Object.values(productCategories);
  
  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const subcategory = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];
    
    products.push({
      id: (i + 1).toString(),
      name: `${subcategory.name} ${i + 1}號`,
      category: category.id,
      subCategory: subcategory.id,
      description: '商品描述信息',
      price: Math.floor(Math.random() * 1500 + 200),
      originalPrice: Math.floor(Math.random() * 2000 + 500),
      images: [`https://picsum.photos/400/400?random=${i + 1}`],
      tags: ['新品', '熱銷', '推薦'][Math.floor(Math.random() * 3)].split(''),
      stock: Math.floor(Math.random() * 100 + 10),
      rating: Number((Math.random() * 2 + 3).toFixed(1)),
      reviews: Math.floor(Math.random() * 200 + 1),
      specifications: {
        '顏色': ['黑色', '白色', '灰色', '藍色'][Math.floor(Math.random() * 4)],
        '尺碼': ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
      },
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  return products;
};

// 生成27个商品数据（可以正好显示3页，每页9个商品）
export const mockProducts: Product[] = generateMockProducts(27); 