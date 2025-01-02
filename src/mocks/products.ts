import type { Product } from '../types/product';
import { productCategories } from '../constants/categories';

// 示例商品数据
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Nike Air Zoom 跑步鞋',
    category: 'shoes',
    subCategory: 'running',
    price: 1411,
    originalPrice: 2486,
    images: ['path/to/image1.jpg'],
    description: '專業跑步鞋，提供優異的緩震和支撐',
    // ... 其他属性
  },
  {
    id: '2',
    name: 'Adidas 運動鞋',
    category: 'shoes',
    subCategory: 'sports',
    price: 415,
    originalPrice: 793,
    images: ['path/to/image2.jpg'],
    description: '多功能運動鞋，適合各種運動場景',
    // ... 其他属性
  },
  {
    id: '3',
    name: '休閒運動鞋',
    category: 'shoes',
    subCategory: 'casual',
    price: 1507,
    originalPrice: 2332,
    images: ['path/to/image3.jpg'],
    description: '舒適時尚的休閒鞋，日常穿搭首選',
    // ... 其他属性
  },
  // ... 更多示例商品
];

// 品牌和子分类的映射关系
const brandSubcategoryMap = {
  shoes: {
    running: ['Nike', 'Adidas', 'Puma', 'New Balance'],
    casual: ['Vans', 'Converse', 'Timberland', 'Clarks'],
    sports: ['Nike', 'Adidas', 'Under Armour', 'Reebok']
  }
} as const;

// 生成商品数据时使用分类结构
const generateMockProducts = (count: number): Product[] => {
  const products: Product[] = [];
  const categories = Object.values(productCategories);
  
  // 计算每个分类和子分类应该有多少商品
  const itemsPerCategory = Math.floor(count / categories.length);
  
  categories.forEach((category) => {
    const itemsPerSubcategory = Math.floor(itemsPerCategory / category.subcategories.length);
    
    category.subcategories.forEach((subcategory) => {
      // 为每个子分类生成指定数量的商品
      for (let i = 0; i < itemsPerSubcategory; i++) {
        let price = Math.floor(Math.random() * 1500 + 200);
        let name = '';
        
        switch (category.id) {
          case 'shoes': {
            price = Math.floor(Math.random() * 2000 + 400);
            const brands = brandSubcategoryMap.shoes[subcategory.id as keyof typeof brandSubcategoryMap.shoes];
            const brand = brands[Math.floor(Math.random() * brands.length)];
            name = `${brand} ${subcategory.name}`;
            break;
          }
          case 'bags': {
            price = Math.floor(Math.random() * 1500 + 300);
            const prefix = subcategory.id === 'backpack' 
              ? ['戶外', '學院風', '商務', '運動'] 
              : subcategory.id === 'handbag'
              ? ['時尚', '優雅', '經典', '休閒']
              : ['大容量', '防水', '輕便', '多功能'];
            name = `${prefix[Math.floor(Math.random() * prefix.length)]} ${subcategory.name}`;
            break;
          }
          case 'clothing': {
            price = Math.floor(Math.random() * 1000 + 200);
            const prefix = subcategory.id === 'tshirt'
              ? ['純棉', '印花', '條紋', '素色']
              : subcategory.id === 'jeans'
              ? ['修身', '直筒', '寬鬆', '復古']
              : ['保暖', '防風', '輕薄', '時尚'];
            name = `${prefix[Math.floor(Math.random() * prefix.length)]} ${subcategory.name}`;
            break;
          }
        }
        
        const possibleTags = [
          ['新品', '限時優惠'],
          ['熱賣', '折扣'],
          ['推薦', '限量'],
          ['免運費', '特價'],
        ];

        products.push({
          id: products.length.toString(),
          name,
          category: category.id,
          subCategory: subcategory.id,
          description: '商品描述信息',
          price,
          originalPrice: Math.floor(price * (1 + Math.random() * 0.5)),
          images: [`https://picsum.photos/400/400?random=${products.length + 1}`],
          tags: possibleTags[Math.floor(Math.random() * possibleTags.length)],
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
    });
  });

  // 如果生成的商品数量不够，随机添加一些商品来凑够数量
  while (products.length < count) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const subcategory = category.subcategories[Math.floor(Math.random() * category.subcategories.length)];
    const lastProduct = products[products.length - 1];
    products.push({
      ...lastProduct,
      id: products.length.toString(),
      images: [`https://picsum.photos/400/400?random=${products.length + 1}`],
    });
  }
  
  return products;
};

// 生成27个商品数据（可以正好显示3页，每页9个商品）
export const mockProducts: Product[] = generateMockProducts(27); 