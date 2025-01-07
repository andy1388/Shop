const expressApp = require('express');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/products');

const app = expressApp();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());
app.use(expressApp.json());

// 添加靜態文件服務
app.use('/uploads', expressApp.static(path.join(__dirname, '../../uploads')));
app.use(expressApp.static(path.join(__dirname, '../../public')));

// 路由
app.use('/api/products', productRoutes);

// 錯誤處理中間件
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; 