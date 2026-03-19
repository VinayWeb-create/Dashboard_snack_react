import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiPath';

const AllProducts = () => {
  const [products, setProducts] = useState([]);

  const productsHandler = async () => {
    const firmId = localStorage.getItem('firmId');
    if (!firmId) {
      alert("Firm not selected");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/product/${firmId}/products`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch products", error);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    productsHandler();
  }, []);

  const deleteProductById = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${API_URL}/product/${productId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setProducts(products.filter(product => product._id !== productId));
        alert("Product deleted successfully");
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      console.error("Failed to delete product", error);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="productSection">
      <div className="products-header">
        <h2>All Products</h2>
        <span className="products-count">{products.length} items</span>
      </div>

      {products.length === 0 ? (
        <div className="products-table-wrapper">
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <p>No products added yet. Start by adding your first item!</p>
          </div>
        </div>
      ) : (
        <div className="products-table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Best Seller</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(item => (
                <tr key={item._id}>
                  <td className="product-img-cell">
                    {item.image ? (
                      <img
                        src={`${API_URL}${item.image}`}
                        alt={item.productName}
                      />
                    ) : (
                      <div style={{
                        width: 44, height: 44,
                        background: 'var(--surface3)',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem'
                      }}>🍴</div>
                    )}
                  </td>
                  <td className="product-name-cell">{item.productName}</td>
                  <td>
                    {item.category?.length ? (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {item.category.map(c => (
                          <span key={c} style={{
                            fontSize: '0.72rem', fontWeight: 700,
                            padding: '2px 8px', borderRadius: 99,
                            background: c === 'veg' ? 'var(--green-subtle)' : 'var(--red-subtle)',
                            color: c === 'veg' ? 'var(--green)' : 'var(--red)',
                            textTransform: 'capitalize'
                          }}>{c}</span>
                        ))}
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td>
                    <span className="price-badge">₹{item.price}</span>
                  </td>
                  <td>
                    {item.bestSeller ? (
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700,
                        padding: '2px 8px', borderRadius: 99,
                        background: 'rgba(255,159,28,0.12)', color: 'var(--accent2)'
                      }}>⭐ Yes</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="deleteBtn"
                      onClick={() => deleteProductById(item._id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
