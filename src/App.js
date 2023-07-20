import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [originalProducts, setOriginalProducts] = useState([]); // New state for original products

 // State variables for editing inputs
 const [editedName, setEditedName] = useState('');
 const [editedUnitPrice, setEditedUnitPrice] = useState('');
 const [editedQuantity, setEditedQuantity] = useState('');

 useEffect(() => {
  fetchProducts();
}, []);

const fetchProducts = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/products');
    setProducts(response.data);
    setOriginalProducts(response.data); // Store original products data
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

  const addProduct = async () => {
    try {
      const newProduct = { name: productName, unitPrice, quantity };
      const response = await axios.post('http://localhost:5000/api/products', newProduct);
      setProducts([...products, response.data]);
      setProductName('');
      setUnitPrice('');
      setQuantity('');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const updateProduct = async (productId) => {
    try {
      const updatedProduct = {
        name: editedName,
        unitPrice: editedUnitPrice,
        quantity: editedQuantity,
      };
      await axios.put(`http://localhost:5000/api/products/${productId}`, updatedProduct);
      setProducts(
        products.map((p) => (p.id === productId ? { ...p, ...updatedProduct } : p))
      );
      setEditingProductId(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

 
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      // If the search term is empty, reset products to the original data
      setProducts(originalProducts);
    } else {
      // Otherwise, filter products based on the search term
      const filteredProducts = originalProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  const handleShowAll = () => {
    fetchProducts(); // Re-fetch all products
    setSearchTerm(''); // Clear the search term
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search Product"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress} // Trigger search on Enter key press
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>
      <div className="form-container">
        <h2>Add a New Product</h2>
        <input
          type="text"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="number" // Use type="number" for numeric input
          placeholder="Unit Price in Euro"
          value={unitPrice}
          onChange={(e) => setUnitPrice(e.target.value)}
        />
        <input
          type="number" // Use type="number" for numeric input
          placeholder="Quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        <button onClick={addProduct}>Add Product</button>
      </div>
      <div className="search-container">
        <button onClick={handleShowAll}>Show All</button>
      </div>
      <div className="product-list">
      {products.length === 0 && <p>No products added yet</p>}
        {products.map((product) => (
          <div key={product.id} className="product-item">
            {editingProductId === product.id ? (
              <>
                {/* Use type="number" for edited inputs */}
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                />
                <input
                  type="number" // Use type="number" for numeric input
                  value={editedUnitPrice}
                  onChange={(e) => setEditedUnitPrice(e.target.value)}
                />
                <input
                  type="number" // Use type="number" for numeric input
                  value={editedQuantity}
                  onChange={(e) => setEditedQuantity(e.target.value)}
                />
                <button onClick={() => updateProduct(product.id)}>Save</button>
              </>
            ) : (
              <>
                <p>Name: {product.name}</p>
                <p>Unit Price: {product.unitPrice} Euro</p>
                <p>Quantity: {product.quantity}</p>
                <button onClick={() => {
                  // Initialize editing inputs with the current product data
                  setEditedName(product.name);
                  setEditedUnitPrice(product.unitPrice);
                  setEditedQuantity(product.quantity);
                  setEditingProductId(product.id);
                }}>Edit</button>
              </>
            )}
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
