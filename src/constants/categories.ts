// 定义商品分类结构
export type ProductCategory = {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
};

export type ProductCategories = {
  [key: string]: ProductCategory;
};

// 使用命名导出而不是默认导出
export const productCategories: ProductCategories = {
  shoes: {
    id: 'shoes',
    name: '鞋類',
    subcategories: [
      { id: 'running', name: '跑步鞋' },
      { id: 'casual', name: '休閒鞋' },
      { id: 'sports', name: '運動鞋' }
    ]
  },
  bags: {
    id: 'bags',
    name: '箱包',
    subcategories: [
      { id: 'backpack', name: '雙肩包' },
      { id: 'handbag', name: '手提包' },
      { id: 'travel', name: '旅行包' }
    ]
  },
  clothing: {
    id: 'clothing',
    name: '服裝',
    subcategories: [
      { id: 'tshirt', name: 'T恤' },
      { id: 'jeans', name: '牛仔褲' },
      { id: 'jacket', name: '外套' }
    ]
  }
}; 