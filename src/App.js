import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import deliveryIcon from './shopping-delivery.svg';
import cartIcon from './shopping-cart.svg';


const App = () => {
  const [productName, setProductName] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProductId, setEditingProductId] = useState(null);
  const [originalProducts, setOriginalProducts] = useState([]);

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
      setOriginalProducts(response.data); // Stocker les données originales des produits
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
      // Si la recherche est vide, réinitialiser les produits aux données d'origine
      setProducts(originalProducts);
    } else {
      // Sinon, filtrer les produits en fonction du terme de recherche
      const filteredProducts = originalProducts.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  const handleShowAll = () => {
    fetchProducts(); // Re-fetch Tous les produits
    setSearchTerm(''); // Effacer le terme de recherche
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="app">
      <header className="header">
        <img src={require('./shop.svg').default} alt="Logo" width="40" height="40" />
        <div className="search-container">
          <input
            className="search-bar"
            type="text"
            placeholder="Rechercher un produit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleSearchKeyPress} // Rechercher en cliquant sur "Enter"
          />
          <button onClick={handleSearch} className='search-btn'>Rechercher</button>
        </div>
      </header>
      <h1 className='app-title'>Bienvenue sur Confledis Store!</h1>
      <div className="page-body">
        <div className="left-container">
            {/* Les images sur le côté */}
            <img src={deliveryIcon} alt="Delivery Icon" width="390" height="auto" />
            <img src={cartIcon} alt="Cart Icon" width="390" height="auto" />
        </div>
        <div className="right-container">
          <div className="form-container">
            <h2 className='add-title'>Ajouter un nouveau produit</h2>
            <input
              type="text"
              placeholder="Nom du produit"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <input
              type="number" // Type = "number" pour une entrée numérique
              placeholder="Prix unitaire (en euros)"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
            <input
              type="number" 
              placeholder="Quantité"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            <button onClick={addProduct}>Ajouter un produit</button>
          </div>
          <h2 className='show-title'>Liste de produits</h2>
          <div className="search-container">
            <button className="show-all-btn" onClick={handleShowAll} >Afficher tout</button>
          </div>
          <div className="product-list">
            {products.length === 0 && <p>Il n'y a pas de produits jusqu'à présent ..</p>}
            {products.map((product) => (
              <div key={product.id} className="product-item">
                {editingProductId === product.id ? (
                  <>  
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                    />
                    <input
                      type="number" 
                      value={editedUnitPrice}
                      onChange={(e) => setEditedUnitPrice(e.target.value)}
                    />
                    <input
                      type="number" 
                      value={editedQuantity}
                      onChange={(e) => setEditedQuantity(e.target.value)}
                    />
                    <button onClick={() => updateProduct(product.id)}>Enregistrer</button>
                  </>
                ) : (
                  <>
                    <p>Nom : {product.name}</p>
                    <p>Prix unitaire : {product.unitPrice} €</p>
                    <p>Quantité : {product.quantity}</p>
                    <button className="edit-btn"
                      onClick={() => {
                        // Initialise les entrées de modification avec les données actuel du produit 
                        setEditedName(product.name);
                        setEditedUnitPrice(product.unitPrice);
                        setEditedQuantity(product.quantity);
                        setEditingProductId(product.id);
                      }}>Modifier</button>
                  </>
                )}
                <button className="delete-btn" onClick={() => deleteProduct(product.id)}>Supprimer</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
