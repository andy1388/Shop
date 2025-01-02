import type { Product } from '../types/product';

// 生成指定数量的模拟商品数据
const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: (index + 1).toString(),
    name: `商品${index + 1} ${['运动鞋', '休闲鞋', '双肩包', '手提包', 'T恤', '牛仔裤'][index % 6]}`,
    description: '商品描述信息',
    price: Math.floor(Math.random() * 1500 + 200), // 200-1700 HKD 之间的随机价格
    originalPrice: Math.floor(Math.random() * 2000 + 500), // 500-2500 HKD 之间的随机原价
    images: [
      `https://picsum.photos/400/400?random=${index + 1}`,
    ],
    category: ['shoes', 'bags', 'clothes'][Math.floor(index / 6) % 3],
    tags: ['新品', '热销', '推荐'][Math.floor(Math.random() * 3)].split(''),
    stock: Math.floor(Math.random() * 100 + 10), // 10-110之间的随机库存
    rating: Number((Math.random() * 2 + 3).toFixed(1)), // 确保 rating 是数字类型
    reviews: Math.floor(Math.random() * 200 + 1), // 1-200之间的随机评论数
    specifications: {
      '颜色': ['黑色', '白色', '灰色', '蓝色'][Math.floor(Math.random() * 4)],
      '尺码': ['S', 'M', 'L', 'XL'][Math.floor(Math.random() * 4)],
    },
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

// 生成27个商品数据（可以正好显示3页，每页9个商品）
export const mockProducts: Product[] = generateMockProducts(27); 