const sqlite3 = require('sqlite3');

// 創建一個 IIFE (立即調用函數表達式) 來避免變量衝突
const sqliteDb = (() => {
  const db = new sqlite3.Database('shop.db', (err: Error | null) => {
    if (err) {
      console.error('Error opening database:', err);
    } else {
      console.log('Connected to SQLite database');
      createTables();
    }
  });

  const createTables = () => {
    db.serialize(() => {
      // 商品表
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          original_price DECIMAL(10,2) NOT NULL,
          special_price DECIMAL(10,2),
          special_price_end_date TEXT,
          stock INTEGER NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // 商品圖片表
      db.run(`
        CREATE TABLE IF NOT EXISTS product_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER,
          image_url TEXT NOT NULL,
          sort_order INTEGER,
          FOREIGN KEY (product_id) REFERENCES products (id)
        )
      `);
    });
  };

  return db;
})();

module.exports = sqliteDb; 