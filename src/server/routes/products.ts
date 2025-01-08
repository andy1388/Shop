const express = require('express');
const multer = require('multer');
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

// 定義類型
type ExpressReq = import('express').Request;
type ExpressRes = import('express').Response;

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

interface DatabaseCallback {
  lastID: number;
}

// 獲取所有商品
router.get('/', (_req: ExpressReq, res: ExpressRes) => {
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
router.post('/', upload.array('images', 5), async (req: any, res: ExpressRes) => {
  try {
    const {
      sku,
      name,
      original_price,
      special_price,
      special_price_end_date,
      stock,
      description,
      category
    } = req.body;

    console.log('Creating product with data:', {
      sku,
      name,
      original_price,
      special_price,
      special_price_end_date,
      stock,
      description,
      category
    });

    // 如果沒有提供 SKU，生成一個隨機的 SKU
    const productSku = sku || `SKU${Date.now()}${Math.floor(Math.random() * 1000)}`;

    console.log('Received files:', req.files); // 添加日誌

    // 處理上傳的文件
    const files = req.files as Express.Multer.File[];
    const imageUrls = files ? files.map(file => file.filename) : [];

    console.log('Uploaded image URLs:', imageUrls); // 添加日誌

    // 插入商品數據
    const result: any = await new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO products (
          sku, name, original_price, special_price, special_price_end_date,
          stock, description, category, status, sales
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        productSku,
        name,
        original_price,
        special_price || null,
        special_price_end_date || null,
        stock,
        description,
        category,
        'active',
        0  // 初始銷量為 0
      ];

      console.log('SQL:', sql);
      console.log('Parameters:', params);

      dbInstance.run(sql, params, function(this: DatabaseCallback, err: Error | null) {
        if (err) {
          console.error('Database error:', err);
          reject(err);
        } else {
          resolve({ id: this.lastID });
        }
      });
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
      sku: productSku,
      message: "Product created successfully",
      images: imageUrls
    });
  } catch (error) {
    console.error('Detailed error:', error);
    res.status(500).json({ 
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
  }
});

// 刪除商品
router.delete('/:id', async (req: ExpressReq, res: ExpressRes) => {
  const { id } = req.params;

  try {
    // 1. 首先獲取商品的圖片記錄
    const images: { image_url: string }[] = await new Promise((resolve, reject) => {
      dbInstance.all(
        'SELECT image_url FROM product_images WHERE product_id = ?',
        [id],
        (err: Error | null, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    // 2. 刪除實際的圖片文件
    for (const image of images) {
      const imagePath = pathUtil.join(__dirname, '../../../uploads',image.image_url);
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log(`Deleted image file: ${imagePath}`);
        }
      } catch (err) {
        console.error(`Error deleting image file ${imagePath}:`, err);
      }
    }

    // 3. 刪除數據庫中的圖片記錄
    await new Promise((resolve, reject) => {
      dbInstance.run(
        'DELETE FROM product_images WHERE product_id = ?',
        [id],
        (err: Error | null) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });

    // 4. 最後刪除商品記錄
    await new Promise((resolve, reject) => {
      dbInstance.run(
        'DELETE FROM products WHERE id = ?',
        [id],
        (err: Error | null) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });

    res.json({ 
      message: 'Product and associated images deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ 
      error: 'Failed to delete product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 更新商品
router.put('/:id', upload.array('images', 5), async (req: any, res: ExpressRes) => {
  const { id } = req.params;
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

    // 更新商品基本信息
    await new Promise((resolve, reject) => {
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
          if (err) reject(err);
          else resolve(true);
        }
      );
    });

    // 處理新上傳的圖片
    const files = req.files as Express.Multer.File[];
    if (files && files.length > 0) {
      // 獲取當前圖片數量
      const currentImages = await new Promise<number>((resolve, reject) => {
        dbInstance.get(
          'SELECT COUNT(*) as count FROM product_images WHERE product_id = ?',
          [id],
          (err: Error | null, row: any) => {
            if (err) reject(err);
            else resolve(row.count);
          }
        );
      });

      // 檢查總圖片數是否超過限制
      if (currentImages + files.length > 5) {
        res.status(400).json({ error: '圖片總數不能超過5張' });
        return;
      }

      // 保存新圖片
      const imageUrls = files.map(file => file.filename);
      const placeholders = imageUrls.map(() => '(?, ?, ?)').join(',');
      const values = imageUrls.flatMap((url, index) => [id, url, currentImages + index]);

      await new Promise((resolve, reject) => {
        dbInstance.run(
          `INSERT INTO product_images (product_id, image_url, sort_order) VALUES ${placeholders}`,
          values,
          (err: Error | null) => {
            if (err) reject(err);
            else resolve(true);
          }
        );
      });
    }

    res.json({
      message: "Product updated successfully"
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      error: 'Failed to update product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// 獲取商品圖片
router.get('/:id/images', (req: ExpressReq, res: ExpressRes) => {
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

// 刪除單個商品圖片
router.delete('/:productId/images/:imageUrl', async (req: ExpressReq, res: ExpressRes) => {
  const { productId, imageUrl } = req.params;

  try {
    // 1. 刪除實際文件
    const imagePath = pathUtil.join(__dirname, '../../../uploads',imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // 2. 從數據庫中刪除記錄
    await new Promise((resolve, reject) => {
      dbInstance.run(
        'DELETE FROM product_images WHERE product_id = ? AND image_url = ?',
        [productId, imageUrl],
        (err: Error | null) => {
          if (err) reject(err);
          else resolve(true);
        }
      );
    });

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ 
      error: 'Failed to delete image',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

module.exports = router;