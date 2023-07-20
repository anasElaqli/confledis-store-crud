import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const BASE_API_URL = 'http://localhost:5000';

function App() {
  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductQuantity, setNewProductQuantity] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProductId, setEditingProductId] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        name: newProductName,
        unitPrice: newProductPrice,
        quantity: newProductQuantity,
      };
      await axios.post(`${BASE_API_URL}/products`, newProduct);
      setNewProductName('');
      setNewProductPrice('');
      setNewProductQuantity('');
      fetchProducts();
      alert('Product is added successfully.');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (productId, updatedProduct) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product._id === productId) {
          return updatedProduct;
        }
        return product;
      });
      return updatedProducts;
    });
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${BASE_API_URL}/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSearch = async () => {
    try {
      if (!searchTerm) {
        fetchProducts(); // If search term is empty, show all products
      } else {
        const response = await axios.get(`${BASE_API_URL}/products/search?name=${searchTerm}`);
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleListAll = () => {
    setSearchTerm(''); // Reset the search term
    fetchProducts(); // Fetch all products
  };

  return (
    <div className="App">
      <h1>Product CRUD App</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Product Name"
          value={newProductName}
          onChange={(e) => setNewProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Unit Price (EUR)"
          value={newProductPrice}
          onChange={(e) => setNewProductPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newProductQuantity}
          onChange={(e) => setNewProductQuantity(e.target.value)}
        />
        <button onClick={handleAddProduct}>Add Product</button>
        <input
          type="text"
          placeholder="Search by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress} // Call handleKeyPress on key press
        />
        
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleListAll}>List All</button> {/* Fixed the List All button */}
      </div>

      <div className="product-list">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div className="product" key={product._id}>
              {editingProductId === product._id ? (
                <>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => {
                      const updatedProduct = { ...product, name: e.target.value };
                      handleEditProduct(product._id, updatedProduct);
                    }}
                  />
                  <input
                    type="text"
                    value={product.unitPrice}
                    onChange={(e) => {
                      const updatedProduct = { ...product, unitPrice: e.target.value };
                      handleEditProduct(product._id, updatedProduct);
                    }}
                  />
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => {
                      const updatedProduct = { ...product, quantity: e.target.value };
                      handleEditProduct(product._id, updatedProduct);
                    }}
                  />
                  <button onClick={() => setEditingProductId('')}>Save</button>
                </>
              ) : (
                <>
                  <p>Name: {product.name}</p>
                  <p>Unit Price: {product.unitPrice} EUR</p>
                  <p>Quantity: {product.quantity}</p>
                  <button onClick={() => setEditingProductId(product._id)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
