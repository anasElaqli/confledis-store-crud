// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const app = express();
// const port = 5000;

// const products = []; // In-memory storage for products (Replace this with a database in a real application)

// app.use(cors());
// app.use(bodyParser.json());

// // Get all products
// app.get('/products', (req, res) => {
//   res.json(products);
// });

// // Add a new product
// app.post('/products', (req, res) => {
//   const newProduct = req.body;
//   products.push(newProduct);
//   res.json(newProduct);
// });

// // Update a product by ID
// app.put('/products/:id', (req, res) => {
//   const productId = req.params.id;
//   const updatedProduct = req.body;

//   const index = products.findIndex((product) => product._id === productId);
//   if (index !== -1) {
//     products[index] = { ...products[index], ...updatedProduct };
//     res.json(products[index]);
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// });

// // Delete a product by ID
// app.delete('/products/:id', (req, res) => {
//   const productId = req.params.id;

//   const index = products.findIndex((product) => product._id === productId);
//   if (index !== -1) {
//     products.splice(index, 1);
//     res.json({ message: 'Product deleted successfully' });
//   } else {
//     res.status(404).json({ message: 'Product not found' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

let products = [];

// CRUD operations for products
app.post('/api/products', (req, res) => {
  const product = req.body;
  product.id = new Date().getTime().toString();
  products.push(product);
  res.status(201).json(product);
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const product = products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

app.put('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;
  products = products.map((p) => (p.id === productId ? { ...p, ...updatedProduct } : p));
  res.json(updatedProduct);
});

app.delete('/api/products/:id', (req, res) => {
  const productId = req.params.id;
  products = products.filter((p) => p.id !== productId);
  res.sendStatus(204);
});

const port = 5000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
