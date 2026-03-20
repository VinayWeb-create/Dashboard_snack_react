import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiPath';
import { getProductImageUrl } from '../data/imageUrl';
import { useToast } from './Toast';
import { useConfirm } from './ConfirmModal';

/* ── shared option data ─────────────────────────────────────────── */
const CATEGORY_OPTIONS = [
  { v: 'veg',     l: '🥦 Veg',     color: '#22c55e' },
  { v: 'non-veg', l: '🍗 Non-Veg', color: '#ef4444' },
  { v: 'snacks',  l: '🍟 Snacks',  color: '#f59e0b' },
];

const CUISINE_OPTIONS = [
  { v: 'south-indian', l: '🍛 South Indian' },
  { v: 'north-indian', l: '🫓 North Indian' },
  { v: 'chinese',      l: '🥢 Chinese'      },
  { v: 'bakery',       l: '🥐 Bakery'       },
  { v: 'fast-food',    l: '🍔 Fast Food'    },
  { v: 'desserts',     l: '🍨 Desserts'     },
  { v: 'beverages',    l: '🧃 Beverages'    },
];

const CAT_COLOR = { veg: '#22c55e', 'non-veg': '#ef4444', snacks: '#f59e0b' };
const CAT_BG    = { veg: 'var(--green-subtle)', 'non-veg': 'var(--red-subtle)', snacks: 'rgba(245,158,11,0.12)' };

/* ══════════════════════════════════════════════
   EDIT MODAL
══════════════════════════════════════════════ */
const EditModal = ({ product, onClose, onSave }) => {
  const toast = useToast();
  const [productName, setProductName] = useState(product.productName || '');
  const [price,       setPrice]       = useState(product.price       || '');
  const [description, setDescription] = useState(product.description || '');
  const [bestSeller,  setBestSeller]  = useState(product.bestSeller  || false);
  const [category,    setCategory]    = useState(product.category    || []);
  const [cuisine,     setCuisine]     = useState(product.cuisine     || []);
  const [image,       setImage]       = useState(null);
  const [preview,     setPreview]     = useState(null);
  const [saving,      setSaving]      = useState(false);
  const [errors,      setErrors]      = useState({});

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(c => c !== val) : [...arr, val]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImage(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const validate = () => {
    const e = {};
    if (!productName.trim())          e.productName = 'Product name is required';
    if (!price || Number(price) <= 0) e.price       = 'Enter a valid price';
    if (!category.length)             e.category    = 'Select at least one category';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const token    = localStorage.getItem('loginToken');
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('price',       price);
      formData.append('description', description);
      formData.append('bestSeller',  bestSeller);
      category.forEach(c => formData.append('category', c));
      cuisine.forEach(c  => formData.append('cuisine',  c));
      if (image) formData.append('image', image);

      const res  = await fetch(`${API_URL}/product/${product._id}`, {
        method: 'PUT', headers: { token }, body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        toast.success('Product updated!');
        onSave(data.product || { ...product, productName, price, description, bestSeller, category, cuisine });
        onClose();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to update product');
      }
    } catch { toast.error('Failed to update product'); }
    finally  { setSaving(false); }
  };

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 20, animation: 'fadeIn 0.15s ease both',
  };
  const modal = {
    background: '#111114', border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 20, padding: 28, width: '100%', maxWidth: 500,
    maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 32px 80px rgba(0,0,0,0.85)',
    animation: 'popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both',
  };
  const inp = (err) => ({
    width: '100%', height: 44, boxSizing: 'border-box',
    background: err ? 'rgba(239,68,68,0.06)' : '#1f1f26',
    border: `1px solid ${err ? '#ef4444' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 9, color: '#f0f0f2',
    fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
    padding: '0 14px', outline: 'none', transition: '0.2s',
  });
  const lbl = {
    display: 'block', fontSize: '0.73rem', fontWeight: 700,
    color: '#8b8b9a', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: 6, marginTop: 16,
  };
  const pill = (active, color = '#ff6b35') => ({
    padding: '6px 13px', borderRadius: 99,
    fontSize: '0.8rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
    background: active ? `${color}22` : '#1f1f26',
    border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
    color: active ? color : '#8b8b9a',
  });

  const currentImg = getProductImageUrl(product.image);

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h3 style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.1rem', fontWeight: 700, color: '#f0f0f2', margin: 0 }}>Edit Product</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b8b9a', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
        </div>
        <p style={{ color: '#8b8b9a', fontSize: '0.82rem', marginBottom: 4 }}>Update the details below</p>

        {/* Current image */}
        {(preview || currentImg) && (
          <div style={{ marginTop: 10, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={preview || currentImg} alt="product"
              onError={e => { e.target.style.display = 'none'; }}
              style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: '0.75rem', color: preview ? '#22c55e' : '#8b8b9a', fontWeight: 600 }}>
              {preview ? '✓ New image selected' : 'Current image'}
            </span>
          </div>
        )}

        {/* Product Name */}
        <label style={lbl}>Product Name</label>
        <input style={inp(errors.productName)} value={productName}
          onChange={e => { setProductName(e.target.value); setErrors(p => ({ ...p, productName: '' })); }} />
        {errors.productName && <span style={{ color: '#ef4444', fontSize: '0.74rem' }}>{errors.productName}</span>}

        {/* Price */}
        <label style={lbl}>Price (₹)</label>
        <input style={inp(errors.price)} value={price} type="number"
          onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: '' })); }} />
        {errors.price && <span style={{ color: '#ef4444', fontSize: '0.74rem' }}>{errors.price}</span>}

        {/* Description */}
        <label style={lbl}>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          style={{ ...inp(false), height: 70, padding: '10px 14px', resize: 'vertical', lineHeight: 1.5 }} />

        {/* Category */}
        <label style={lbl}>Category *</label>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {CATEGORY_OPTIONS.map(({ v, l, color }) => (
            <button key={v} type="button"
              onClick={() => { toggleArr(category, setCategory, v); setErrors(p => ({ ...p, category: '' })); }}
              style={pill(category.includes(v), color)}>{l}</button>
          ))}
        </div>
        {errors.category && <span style={{ color: '#ef4444', fontSize: '0.74rem', marginTop: 4, display: 'block' }}>{errors.category}</span>}

        {/* Cuisine */}
        <label style={lbl}>Cuisine Tag <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
          {CUISINE_OPTIONS.map(({ v, l }) => (
            <button key={v} type="button"
              onClick={() => toggleArr(cuisine, setCuisine, v)}
              style={pill(cuisine.includes(v), '#3b82f6')}>{l}</button>
          ))}
        </div>

        {/* Best Seller */}
        <label style={lbl}>Best Seller</label>
        <div style={{ display: 'flex', gap: 8 }}>
          {[true, false].map(v => (
            <button key={String(v)} type="button" onClick={() => setBestSeller(v)}
              style={pill(bestSeller === v, '#f59e0b')}>{v ? '⭐ Yes' : 'No'}</button>
          ))}
        </div>

        {/* Replace Image */}
        <label style={lbl}>Replace Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange}
          style={{ ...inp(false), height: 'auto', padding: '10px 14px', color: '#8b8b9a', fontSize: '0.82rem', cursor: 'pointer' }} />

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: 11, borderRadius: 9,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
            color: '#8b8b9a', fontSize: '0.87rem', fontWeight: 600,
            cursor: 'pointer', fontFamily: 'DM Sans,sans-serif',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: 11, borderRadius: 9,
            background: saving ? '#555' : 'linear-gradient(135deg,#ff6b35,#ff9f1c)',
            border: 'none', color: 'white',
            fontSize: '0.88rem', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'DM Sans,sans-serif',
            opacity: saving ? 0.7 : 1,
            boxShadow: saving ? 'none' : '0 4px 16px rgba(255,107,53,0.3)',
          }}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes popIn  { from{opacity:0;transform:scale(0.85) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)} }
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════════
   IMAGE CELL
══════════════════════════════════════════════ */
const ImageCell = ({ image, name }) => {
  const url = getProductImageUrl(image);
  const [failed, setFailed] = useState(false);
  if (!url || failed) return (
    <div style={{ width: 44, height: 44, background: 'var(--surface3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>🍴</div>
  );
  return (
    <img src={url} alt={name} onError={() => setFailed(true)}
      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
  );
};

/* ══════════════════════════════════════════════
   ALL PRODUCTS PAGE
══════════════════════════════════════════════ */
const AllProducts = () => {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [filterCat,   setFilterCat]   = useState('all');
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [filterBS,    setFilterBS]    = useState('all');
  const [editProduct, setEditProduct] = useState(null);
  const toast   = useToast();
  const confirm = useConfirm();

  useEffect(() => {
    const firmId = localStorage.getItem('firmId');
    if (!firmId) { toast.warning('No firm selected'); setLoading(false); return; }
    fetch(`${API_URL}/product/${firmId}/products`)
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(() => { toast.error('Failed to fetch products'); setLoading(false); });
  }, []);

  const handleDelete = async (productId) => {
    const ok = await confirm('This will permanently remove the product from your menu.');
    if (!ok) return;
    try {
      const res = await fetch(`${API_URL}/product/${productId}`, { method: 'DELETE' });
      if (res.ok) { setProducts(prev => prev.filter(p => p._id !== productId)); toast.success('Product deleted'); }
      else toast.error('Failed to delete product');
    } catch { toast.error('Failed to delete product'); }
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch  = p.productName?.toLowerCase().includes(q);
    const matchCat     = filterCat     === 'all' ? true : p.category?.includes(filterCat);
    const matchCuisine = filterCuisine === 'all' ? true : p.cuisine?.includes(filterCuisine);
    const matchBS      = filterBS === 'all' ? true : filterBS === 'yes' ? p.bestSeller : !p.bestSeller;
    return matchSearch && matchCat && matchCuisine && matchBS;
  });

  const pill = (active) => ({
    padding: '5px 12px', borderRadius: 99, fontSize: '0.76rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: '0.2s', border: '1px solid',
    borderColor: active ? 'var(--accent)' : 'var(--border)',
    background:  active ? 'var(--accent-subtle)' : 'transparent',
    color:       active ? 'var(--accent)' : 'var(--text-secondary)',
  });

  return (
    <div className="productSection">
      {editProduct && (
        <EditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={updated => setProducts(prev => prev.map(p => p._id === updated._id ? updated : p))}
        />
      )}

      {/* Header */}
      <div className="products-header">
        <h2>All Products</h2>
        <span className="products-count">{filtered.length} of {products.length}</span>
      </div>

      {/* Search + Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>

        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: 180 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
          <input type="text" placeholder="Search products..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', height: 38, paddingLeft: 34, paddingRight: 12,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 9, color: 'var(--text-primary)',
              fontSize: '0.86rem', fontFamily: 'DM Sans, sans-serif', outline: 'none',
            }}
            onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; }}
            onBlur={e  => { e.target.style.borderColor = 'var(--border)';  e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Category filter */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {[['all','All'], ['veg','🥦'], ['non-veg','🍗'], ['snacks','🍟']].map(([v, l]) => (
            <button key={v} style={pill(filterCat === v)} onClick={() => setFilterCat(v)}>{l}</button>
          ))}
        </div>

        {/* Cuisine filter */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          <button style={pill(filterCuisine === 'all')} onClick={() => setFilterCuisine('all')}>All Cuisines</button>
          {CUISINE_OPTIONS.map(({ v, l }) => (
            <button key={v} style={pill(filterCuisine === v)} onClick={() => setFilterCuisine(v)}>{l}</button>
          ))}
        </div>

        {/* Best Seller filter */}
        <div style={{ display: 'flex', gap: 5 }}>
          {[['all','All'], ['yes','⭐'], ['no','Regular']].map(([v, l]) => (
            <button key={v} style={pill(filterBS === v)} onClick={() => setFilterBS(v)}>{l}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="products-table-wrapper">
          <div className="empty-state"><p>Loading products...</p></div>
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
                <th>Product</th>
                <th>Category</th>
                <th>Cuisine</th>
                <th>Price</th>
                <th>Best Seller</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr key={item._id}>
                  <td><ImageCell image={item.image} name={item.productName} /></td>

                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>{item.productName}</div>
                    {item.description && (
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 2, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.description}
                      </div>
                    )}
                  </td>

                  {/* Category badges */}
                  <td>
                    {item.category?.length ? (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {item.category.map(c => (
                          <span key={c} style={{
                            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                            background: CAT_BG[c]    || 'var(--surface3)',
                            color:      CAT_COLOR[c] || 'var(--text-secondary)',
                            textTransform: 'capitalize',
                          }}>{c}</span>
                        ))}
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>

                  {/* Cuisine tag badges */}
                  <td>
                    {item.cuisine?.length ? (
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {item.cuisine.map(c => (
                          <span key={c} style={{
                            fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99,
                            background: 'var(--blue-subtle)', color: 'var(--blue)',
                            textTransform: 'capitalize',
                          }}>{c}</span>
                        ))}
                      </div>
                    ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>

                  <td><span className="price-badge">₹{item.price}</span></td>

                  <td>
                    {item.bestSeller
                      ? <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,159,28,0.12)', color: 'var(--accent2)' }}>⭐ Yes</span>
                      : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                  </td>

                  <td>
                    <div style={{ display: 'flex', gap: 7 }}>
                      <button onClick={() => setEditProduct(item)} style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        color: 'var(--blue)', background: 'var(--blue-subtle)',
                        border: '1px solid rgba(59,130,246,0.2)',
                        padding: '6px 11px', borderRadius: 7,
                        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                        fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
                      }}>✏️ Edit</button>
                      <button className="deleteBtn" onClick={() => handleDelete(item._id)}>🗑 Delete</button>
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
