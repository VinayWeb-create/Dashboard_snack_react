import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';
import { useToast } from '../Toast';

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState([]);
  const [bestSeller, setBestSeller] = useState(false);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validate = () => {
    const e = {};
    if (!productName.trim()) e.productName = 'Product name is required';
    if (!price || isNaN(price) || Number(price) <= 0) e.price = 'Enter a valid price';
    if (category.length === 0) e.category = 'Select at least one category';
    return e;
  };

  const toggleCat = (value) => {
    setCategory(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
    setErrors(p => ({ ...p, category: '' }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const loginToken = localStorage.getItem('loginToken');
      const firmId = localStorage.getItem('firmId');
      if (!loginToken || !firmId) {
        toast.error('Not authenticated or no firm selected');
        setLoading(false); return;
      }
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('bestSeller', bestSeller);
      if (image) formData.append('image', image);
      category.forEach(c => formData.append('category', c));

      const response = await fetch(`${API_URL}/product/add-product/${firmId}`, {
        method: 'POST',
        headers: { token: loginToken },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`"${productName}" added to your menu! 🎉`);
        setProductName(""); setPrice(""); setCategory([]);
        setBestSeller(false); setImage(null); setDescription(""); setErrors({});
      } else {
        toast.error(data.error || 'Failed to add product');
      }
    } catch {
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  const inpStyle = (hasErr) => ({
    width: '100%', height: 44,
    background: hasErr ? 'rgba(239,68,68,0.06)' : 'var(--surface2)',
    border: `1px solid ${hasErr ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
    padding: '0 14px', outline: 'none', transition: '0.2s', boxSizing: 'border-box',
  });

  const pillStyle = (selected, color = 'var(--accent)') => ({
    padding: '7px 14px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
    background: selected ? `${color}1a` : 'var(--surface2)',
    border: `1px solid ${selected ? color : 'var(--border)'}`,
    color: selected ? color : 'var(--text-secondary)',
  });

  const lbl = {
    display: 'block', fontSize: '0.75rem', fontWeight: 700,
    color: 'var(--text-secondary)', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: 6, marginTop: 16,
  };

  const onFocus = e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; };
  const onBlur = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="firmSection" style={{ animation: 'fadeUp 0.4s ease both' }}>
      {loading ? (
        <div className="loaderSection">
          <ThreeCircles visible height={80} width={80} color="#ff6b35" />
          <p>Adding your product...</p>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>
              Add Product
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Add a new item to your menu</p>
          </div>
          <form onSubmit={handleAddProduct}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '28px',
            }}>

            <label style={lbl}>Product Name *</label>
            <input style={inpStyle(errors.productName)} type="text" value={productName}
              placeholder="e.g. Butter Chicken"
              onChange={e => { setProductName(e.target.value); setErrors(p => ({ ...p, productName: '' })); }}
              onFocus={onFocus} onBlur={onBlur} />
            {errors.productName && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{errors.productName}</span>}

            <label style={lbl}>Price (₹) *</label>
            <input style={inpStyle(errors.price)} type="number" value={price}
              placeholder="e.g. 250"
              onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: '' })); }}
              onFocus={onFocus} onBlur={onBlur} />
            {errors.price && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{errors.price}</span>}

            <label style={lbl}>Category *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ v: 'veg', l: '🥦 Veg' }, { v: 'non-veg', l: '🍗 Non-Veg' }].map(({ v, l }) => (
                <button key={v} type="button"
                  style={pillStyle(category.includes(v), v === 'veg' ? 'var(--green)' : 'var(--red)')}
                  onClick={() => toggleCat(v)}>{l}</button>
              ))}
            </div>
            {errors.category && <span style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.category}</span>}

            <label style={lbl}>Best Seller?</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ v: true, l: '⭐ Yes' }, { v: false, l: 'No' }].map(({ v, l }) => (
                <button key={String(v)} type="button"
                  style={pillStyle(bestSeller === v, '#f59e0b')}
                  onClick={() => setBestSeller(v)}>{l}</button>
              ))}
            </div>

            <label style={lbl}>Description (optional)</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of the dish..."
              style={{
                ...inpStyle(false), height: 80, padding: '10px 14px',
                resize: 'vertical', lineHeight: 1.5,
              }}
              onFocus={onFocus} onBlur={onBlur} />

            <label style={lbl}>Product Image (optional)</label>
            <input type="file" accept="image/*"
              onChange={e => setImage(e.target.files[0])}
              style={{ ...inpStyle(false), height: 'auto', padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }} />

            <button type="submit" style={{
              marginTop: 24, width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              border: 'none', borderRadius: 'var(--radius-sm)',
              color: 'white', fontSize: '0.9rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              boxShadow: 'var(--shadow-accent)', transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >Add to Menu →</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
