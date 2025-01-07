const expressApp = require('express');
const cors = require('cors');
const productRoutes = require('./routes/products');

const app = expressApp();
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(cors());
app.use(expressApp.json());

// 路由
app.use('/api/products', productRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app; 