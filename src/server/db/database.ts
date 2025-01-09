const sqlite3 = require('sqlite3');
const pathUtils = require('path');

const dbPath = pathUtils.join(__dirname, '../../../shop.db');

type SQLiteError = Error & { code?: string };

class Database {
  private db: any;

  constructor() {
    this.db = new sqlite3.Database(dbPath, (err: SQLiteError | null) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.createTables();
      }
    });

    process.on('SIGINT', () => {
      this.close();
    });
  }

  private createTables() {
    this.db.serialize(() => {
      // 先刪除舊表（如果存在）
      this.db.run('DROP TABLE IF EXISTS product_images');
      this.db.run('DROP TABLE IF EXISTS products');

      // 重新創建表
      this.db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          display_number INTEGER,
          sku TEXT,
          name TEXT NOT NULL,
          original_price DECIMAL(10,2) NOT NULL,
          special_price DECIMAL(10,2),
          special_price_end_date TEXT,
          stock INTEGER NOT NULL,
          description TEXT,
          category TEXT NOT NULL,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          sales INTEGER DEFAULT 0
        )
      `, (err: SQLiteError | null) => {
        if (err) {
          console.error('Error creating products table:', err);
        } else {
          console.log('Products table created successfully');
        }
      });

      this.db.run(`
        CREATE TABLE IF NOT EXISTS product_images (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          product_id INTEGER,
          image_url TEXT NOT NULL,
          sort_order INTEGER,
          FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
        )
      `, (err: SQLiteError | null) => {
        if (err) {
          console.error('Error creating product_images table:', err);
        } else {
          console.log('Product_images table created successfully');
        }
      });

      this.db.run('PRAGMA foreign_keys = ON');

      // 添加一些測試數據
      this.db.run(`
        INSERT INTO products (
          display_number, sku, name, original_price, stock, description, category
        ) VALUES 
        (1, 'SKU001', '測試商品1', 100, 10, '測試描述1', 'handmade'),
        (2, 'SKU002', '測試商品2', 200, 20, '測試描述2', 'accessories')
      `, (err: SQLiteError | null) => {
        if (err) {
          console.error('Error inserting test data:', err);
        } else {
          console.log('Test data inserted successfully');
        }
      });
    });
  }

  public get database() {
    return this.db;
  }

  private close() {
    this.db.close((err: SQLiteError | null) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed');
      }
      process.exit(0);
    });
  }
}

module.exports = new Database().database;