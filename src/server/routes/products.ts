const express = require('express');
const dbInstance = require('../db/database');
const router = express.Router();

// 使用 type 導入來避免命名衝突
type ExpressRequest = import('express').Request;
type ExpressResponse = import('express').Response;

interface CustomRequest extends ExpressRequest {
  body: {
    name: string;
    original_price: number;
    special_price?: number;
    special_price_end_date?: string;
    stock: number;
    description: string;
    category: string;
  }
}

interface Product {
  id: number;
  name: string;
  original_price: number;
  special_price?: number;
  special_price_end_date?: string;
  stock: number;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

interface DatabaseCallback {
  lastID: number;
}

// 獲取所有商品
router.get('/', (_req: ExpressRequest, res: ExpressResponse) => {
  dbInstance.all('SELECT * FROM products', [], (err: Error | null, rows: Product[]) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// 創建新商品
router.post('/', (req: CustomRequest, res: ExpressResponse) => {
  const {
    name,
    original_price,
    special_price,
    special_price_end_date,
    stock,
    description,
    category
  } = req.body;

  dbInstance.run(
    `INSERT INTO products (
      name, original_price, special_price, special_price_end_date,
      stock, description, category
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, original_price, special_price, special_price_end_date, stock, description, category],
    function(this: DatabaseCallback, err: Error | null) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        id: this.lastID,
        message: "Product created successfully"
      });
    }
  );
});

// 刪除商品
router.delete('/:id', (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;

  dbInstance.run('DELETE FROM products WHERE id = ?', id, (err: Error | null) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // 同時刪除相關的圖片記錄
    dbInstance.run('DELETE FROM product_images WHERE product_id = ?', id, (err: Error | null) => {
      if (err) {
        console.error('Error deleting product images:', err);
      }
    });

    res.json({ message: 'Product deleted successfully' });
  });
});

// 更新商品
router.put('/:id', (req: CustomRequest, res: ExpressResponse) => {
  const { id } = req.params;
  const {
    name,
    original_price,
    special_price,
    special_price_end_date,
    stock,
    description,
    category
  } = req.body;

  dbInstance.run(
    `UPDATE products SET 
      name = ?, 
      original_price = ?, 
      special_price = ?, 
      special_price_end_date = ?,
      stock = ?, 
      description = ?, 
      category = ?
    WHERE id = ?`,
    [name, original_price, special_price, special_price_end_date, stock, description, category, id],
    (err: Error | null) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "Product updated successfully"
      });
    }
  );
});

module.exports = router;