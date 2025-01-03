import type { Product } from '../types/product';

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Nike 跑步鞋',
    price: 899,
    originalPrice: 1299,
    images: [
      'https://picsum.photos/800/800?random=1',
      'https://picsum.photos/800/800?random=2',
      'https://picsum.photos/800/800?random=3',
      'https://picsum.photos/800/800?random=4',
    ],
    description: '專業級跑步鞋，採用最新科技，提供極致舒適的跑步體驗。',
    rating: 4.5,
    reviews: 128,
    stock: 50,
    tags: ['新品', '熱賣', '推薦'],
    specifications: {
      顏色: ['黑色', '白色', '藍色'],
      尺碼: ['40', '41', '42', '43', '44'],
      材質: ['網布', '真皮'],
      產地: '越南'
    },
  },
  {
    id: '2',
    name: 'Adidas 運動鞋',
    price: 799,
    originalPrice: 999,
    images: [
      'https://picsum.photos/800/800?random=5',
      'https://picsum.photos/800/800?random=6',
      'https://picsum.photos/800/800?random=7',
    ],
    description: '經典運動鞋款，適合日常運動和休閒穿著。',
    rating: 4.3,
    reviews: 89,
    stock: 30,
    tags: ['限時優惠', '推薦'],
    specifications: {
      顏色: ['白色', '黑色', '紅色'],
      尺碼: ['39', '40', '41', '42', '43'],
      材質: ['真皮', '人造皮革'],
      產地: '印尼'
    },
  },
  {
    id: '3',
    name: 'New Balance 休閒鞋',
    price: 699,
    originalPrice: null,
    images: [
      'https://picsum.photos/800/800?random=8',
      'https://picsum.photos/800/800?random=9',
    ],
    description: '舒適的休閒鞋，適合長時間穿著。',
    rating: 4.7,
    reviews: 56,
    stock: 15,
    tags: ['新品'],
    specifications: {
      顏色: ['灰色', '米色', '黑色'],
      尺碼: ['40', '41', '42', '43'],
      材質: ['麂皮', '網布'],
      產地: '中國'
    },
  },
  // 可以添加更多商品...
]; 