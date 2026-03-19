import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiPath';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmModal';

const EditModal = ({ product, onClose, onSave }) => {
  const toast = useToast();
  const [productName, setProductName] = useState(product.productName || '');
  const [price, setPrice] = useState(product.price || '');
  const [description, setDescription] = useState(product.description || '');
  const [bestSeller, setBestSeller] = useState(product.bestSeller || false);
  const [category, setCategory] = useState(product.category || []);
  const [image, setImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!productName.trim()) e.productName = 'Product name is required';
    if (!price || isNaN(price) || Number(price) <= 0) e.price = 'Enter a valid price';
    return e;
  };

  const toggleCat = (val) => {
    setCategory(prev => prev.includes(val) ? prev.filter(c => c !== val) : [...prev, val]);
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const token = localStorage.getItem('loginToken');
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('bestSeller', bestSeller);
      category.forEach(c => formData.append('category', c));
      if (image) formData.append('image', image);

      const res = await fetch(`${API_URL}/product/${product._id}`, {
        method: 'PUT',
        headers: { token },
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('Product updated successfully!');
        onSave(data.product || { ...product, productName, price, description, bestSeller, category });
        onClose();
      } else {
        toast.error('Failed to update product');
      }
    } catch {
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20,
    animation: 'fadeIn 0.15s ease both',
  };
  const modal = {
    background: '#111114', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, padding: '28px', width: '100%', maxWidth: 480,
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
    animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
  };

  const inp = (hasErr) => ({
    width: '100%', height: 44,
    background: hasErr ? 'rgba(239,68,68,0.06)' : '#1f1f26',
    border: `1px solid ${hasErr ? '#ef4444' : 'rgba(255,255,255,0.07)'}`,
    borderRadius: 9, color: '#f0f0f2',
    fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
    padding: '0 14px', outline: 'none', boxSizing: 'border-box',
    transition: '0.2s',
  });

  const lbl = {
    display: 'block', fontSize: '0.75rem', fontWeight: 700,
    color: '#8b8b9a', textTransform: 'uppercase', letterSpacing: '0.06em',
    marginBottom: 6, marginTop: 16,
  };

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.15rem', fontWeight: 700, color: '#f0f0f2', margin: 0, letterSpacing: '-0.02em' }}>
            Edit Product
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b8b9a', fontSize: '1.2rem', cursor: 'pointer', padding: 4, lineHeight: 1 }}>✕</button>
        </div>
        <p style={{ color: '#8b8b9a', fontSize: '0.82rem', marginBottom: 4 }}>Update the details below</p>

        <label style={lbl}>Product Name</label>
        <input style={inp(errors.productName)} value={productName}
          onChange={e => { setProductName(e.target.value); setErrors(p => ({ ...p, productName: '' })); }} />
        {errors.productName && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.productName}</span>}

        <label style={lbl}>Price (₹)</label>
        <input style={inp(errors.price)} value={price} type="number"
          onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: '' })); }} />
        {errors.price && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{errors.price}</span>}

        <label style={lbl}>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          style={{ ...inp(false), height: 72, padding: '10px 14px', resize: 'vertical', lineHeight: 1.5 }} />

        <label style={lbl}>Category</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {['veg', 'non-veg'].map(v => (
            <button key={v} type="button" onClick={() => toggleCat(v)} style={{
              padding: '6px 16px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
              background: category.includes(v) ? (v === 'veg' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)') : '#1f1f26',
              border: `1px solid ${category.includes(v) ? (v === 'veg' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.07)'}`,
              color: category.includes(v) ? (v === 'veg' ? '#22c55e' : '#ef4444') : '#8b8b9a',
            }}>{v === 'veg' ? '🥦 Veg' : '🍗 Non-Veg'}</button>
          ))}
        </div>

        <label style={lbl}>Best Seller</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[true, false].map(v => (
            <button key={String(v)} type="button" onClick={() => setBestSeller(v)} style={{
              padding: '6px 16px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 600,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
              background: bestSeller === v ? 'rgba(245,158,11,0.15)' : '#1f1f26',
              border: `1px solid ${bestSeller === v ? '#f59e0b' : 'rgba(255,255,255,0.07)'}`,
              color: bestSeller === v ? '#f59e0b' : '#8b8b9a',
            }}>{v ? '⭐ Yes' : 'No'}</button>
          ))}
        </div>

        <label style={lbl}>Replace Image</label>
        <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])}
          style={{ ...inp(false), height: 'auto', padding: '10px 14px', color: '#8b8b9a', fontSize: '0.82rem', cursor: 'pointer' }} />

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '11px', borderRadius: 9,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            color: '#8b8b9a', fontSize: '0.87rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: '11px', borderRadius: 9,
            background: 'linear-gradient(135deg, #ff6b35, #ff9f1c)',
            border: 'none', color: 'white',
            fontSize: '0.88rem', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans, sans-serif',
            opacity: saving ? 0.7 : 1,
            boxShadow: '0 4px 16px rgba(255,107,53,0.3)',
          }}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
};

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('all');
  const [filterBS, setFilterBS] = useState('all');
  const [editProduct, setEditProduct] = useState(null);
  const toast = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    const firmId = localStorage.getItem('firmId');
    if (!firmId) { toast.warning('No firm selected'); setLoading(false); return; }
    fetch(`${API_URL}/product/${firmId}/products`)
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(() => { toast.error('Failed to fetch products'); setLoading(false); });
  }, []);

  const deleteProductById = async (productId) => {
    const ok = await confirm('This will permanently remove the product from your menu.');
    if (!ok) return;
    try {
      const res = await fetch(`${API_URL}/product/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== productId));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleSaveEdit = (updated) => {
    setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
  };

  const filtered = products.filter(p => {
    const matchSearch = p.productName?.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      filterCat === 'all' ? true :
      filterCat === 'veg' ? (p.category?.includes('veg') && !p.category?.includes('non-veg')) :
      filterCat === 'non-veg' ? p.category?.includes('non-veg') : true;
    const matchBS =
      filterBS === 'all' ? true :
      filterBS === 'yes' ? p.bestSeller :
      filterBS === 'no' ? !p.bestSeller : true;
    return matchSearch && matchCat && matchBS;
  });

  const pillBtn = (active) => ({
    padding: '6px 14px', borderRadius: 99, fontSize: '0.78rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: '0.2s', border: '1px solid',
    borderColor: active ? 'var(--accent)' : 'var(--border)',
    background: active ? 'var(--accent-subtle)' : 'transparent',
    color: active ? 'var(--accent)' : 'var(--text-secondary)',
  });

  return (
    <div className="productSection">
      {editProduct && (
        <EditModal product={editProduct} onClose={() => setEditProduct(null)} onSave={handleSaveEdit} />
      )}

      {/* Header */}
      <div className="products-header">
        <h2>All Products</h2>
        <span className="products-count">{filtered.length} of {products.length}</span>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem', pointerEvents: 'none' }}>🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 40, paddingLeft: 36, paddingRight: 14,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text-primary)',
              fontSize: '0.87rem', fontFamily: 'DM Sans, sans-serif', outline: 'none',
              transition: '0.2s',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[['all','All'], ['veg','🥦 Veg'], ['non-veg','🍗 Non-Veg']].map(([v, l]) => (
            <button key={v} style={pillBtn(filterCat === v)} onClick={() => setFilterCat(v)}>{l}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all','All'], ['yes','⭐ Best Seller'], ['no','Regular']].map(([v, l]) => (
            <button key={v} style={pillBtn(filterBS === v)} onClick={() => setFilterBS(v)}>{l}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="products-table-wrapper">
          <div className="empty-state">
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading products...</div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="products-table-wrapper">
          <div className="empty-state">
            <div className="empty-state-icon">{search ? '🔍' : '🍽️'}</div>
            <p>{search ? `No products matching "${search}"` : 'No products added yet.'}</p>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item._id}>
                  <td className="product-img-cell">
                    {item.image ? (
                      <img src={`${API_URL}${item.image}`} alt={item.productName} />
                    ) : (
                      <div style={{
                        width: 44, height: 44, background: 'var(--surface3)',
                        borderRadius: 10, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '1.1rem',
                      }}>🍴</div>
                    )}
                  </td>
                  <td className="product-name-cell">{item.productName}</td>
                  <td>
                    {item.category?.length ? (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {item.category.map(c => (
                          <span key={c} style={{
                            fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px',
                            borderRadius: 99,
                            background: c === 'veg' ? 'var(--green-subtle)' : 'var(--red-subtle)',
                            color: c === 'veg' ? 'var(--green)' : 'var(--red)',
                            textTransform: 'capitalize',
                          }}>{c}</span>
                        ))}
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>
                  <td><span className="price-badge">₹{item.price}</span></td>
                  <td>
                    {item.bestSeller
                      ? <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,159,28,0.12)', color: 'var(--accent2)' }}>⭐ Yes</span>
                      : <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>—</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 7 }}>
                      <button
                        onClick={() => setEditProduct(item)}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          color: 'var(--blue)', background: 'var(--blue-subtle)',
                          border: '1px solid rgba(59,130,246,0.2)',
                          padding: '6px 12px', borderRadius: 7,
                          fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                          fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--blue-subtle)'}
                      >✏️ Edit</button>
                      <button className="deleteBtn" onClick={() => deleteProductById(item._id)}>
                        🗑 Delete
                      </button>
                    </div>
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
