const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(bodyParser.json());
app.use(cors());

const products = [
  { product_id: "1", name: "FOGG", price: 150.00 },
  { product_id: "2", name: "Sanitizer", price: 75.00 }
];

// Route to fetch product details based on product_id from the request body
app.post('/getProductDetails', (req, res) => {
  const { product_id } = req.body;
  console.log("Product id details: ", product_id);

  const product = products.find(p => p.product_id === product_id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

app.post('/getProductHash', (req, res) => {
  const { cart, totalAmount } = req.body;
  console.log("Received cart: ", cart);
  console.log("Total Amount: ", totalAmount);

  const productHashes = cart.map(item => {
    const product = products.find(p => p.product_id === item.product_id);
    return product ? { ...product, hash: product.product_id } : null;
  }).filter(Boolean);

  if (productHashes.length > 0) {
    res.json({ hash: productHashes.map(p => p.hash).join(', '), products: productHashes });
  } else {
    res.status(404).json({ error: "No valid products found in cart" });
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
