const express = require('express');
const multer = require('multer');
// 使用不同的變量名避免衝突
const pathUtil = require('path');
const fs = require('fs');
const dbInstance = require('../db/database');
const router = express.Router();

// 配置 multer
const storage = multer.diskStorage({
  destination: (_req: any, _file: any, cb: any) => {
    const uploadDir = pathUtil.join(__dirname, '../../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req: any, file: any, cb: any) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + pathUtil.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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
  images?: string;
}

interface ProductWithImages extends Omit<Product, 'images'> {
  images: string[];
}

interface DatabaseCallback {
  lastID: number;
}

// 獲取所有商品
router.get('/', (_req: ExpressRequest, res: ExpressResponse) => {
  dbInstance.all(
    `SELECT p.*, GROUP_CONCAT(pi.image_url) as images
     FROM products p
     LEFT JOIN product_images pi ON p.id = pi.product_id
     GROUP BY p.id`,
    [],
    (err: Error | null, rows: Product[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      // 處理圖片 URL
      const productsWithImages = rows.map(product => ({
        ...product,
        images: product.images ? 
          product.images.split(',').filter(Boolean) : // 過濾空值
          []
      }));
      
      res.json(productsWithImages);
    }
  );
});

// 創建新商品（添加圖片上傳）
router.post('/', upload.array('images', 5), async (req: any, res: ExpressResponse) => {
  try {
    const {
      name,
      original_price,
      special_price,
      special_price_end_date,
      stock,
      description,
      category
    } = req.body;

    console.log('Received files:', req.files); // 添加日誌

    // 處理上傳的文件
    const files = req.files as Express.Multer.File[];
    const imageUrls = files ? files.map(file => file.filename) : [];

    console.log('Uploaded image URLs:', imageUrls); // 添加日誌

    // 插入商品數據
    const result: any = await new Promise((resolve, reject) => {
      dbInstance.run(
        `INSERT INTO products (
          name, original_price, special_price, special_price_end_date,
          stock, description, category, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, original_price, special_price, special_price_end_date, stock, description, category, 'active'],
        function(this: DatabaseCallback, err: Error | null) {
          if (err) reject(err);
          else resolve({ id: this.lastID });
        }
      );
    });

    // 如果有圖片，保存圖片記錄
    if (imageUrls.length > 0) {
      const placeholders = imageUrls.map(() => '(?, ?, ?)').join(',');
      const values = imageUrls.flatMap((url, index) => [result.id, url, index]);
      
      console.log('Saving image records:', { placeholders, values }); // 添加日誌

      await new Promise((resolve, reject) => {
        dbInstance.run(
          `INSERT INTO product_images (product_id, image_url, sort_order) VALUES ${placeholders}`,
          values,
          (err: Error | null) => {
            if (err) {
              console.error('Error saving image records:', err);
              reject(err);
            } else {
              console.log('Image records saved successfully');
              resolve(true);
            }
          }
        );
      });
    }

    res.json({
      id: result.id,
      message: "Product created successfully",
      images: imageUrls
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
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

// 獲取商品圖片
router.get('/:id/images', (req: ExpressRequest, res: ExpressResponse) => {
  const { id } = req.params;
  
  dbInstance.all(
    'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order',
    [id],
    (err: Error | null, rows: any[]) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    }
  );
});

module.exports = router;