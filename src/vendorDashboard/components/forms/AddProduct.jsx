import React, { useState } from 'react';
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';
import { useToast } from '../Toast';

/* ── shared option data ─────────────────────────────────────────── */
const CATEGORY_OPTIONS = [
  { v: 'veg',      l: '🥦 Veg',    color: '#22c55e' },
  { v: 'non-veg',  l: '🍗 Non-Veg',color: '#ef4444' },
  { v: 'snacks',   l: '🍟 Snacks', color: '#f59e0b' },
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

const AddProduct = () => {
  const [productName,  setProductName]  = useState("");
  const [price,        setPrice]        = useState("");
  const [category,     setCategory]     = useState([]);
  const [cuisine,      setCuisine]      = useState([]);
  const [bestSeller,   setBestSeller]   = useState(false);
  const [image,        setImage]        = useState(null);
  const [preview,      setPreview]      = useState(null);
  const [description,  setDescription]  = useState("");
  const [loading,      setLoading]      = useState(false);
  const [errors,       setErrors]       = useState({});
  const toast = useToast();

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(i => i !== val) : [...arr, val]);

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
    if (!productName.trim())               e.productName = 'Product name is required';
    if (!price || Number(price) <= 0)      e.price       = 'Enter a valid price';
    if (category.length === 0)             e.category    = 'Select at least one category';
    return e;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const loginToken = localStorage.getItem('loginToken');
      const firmId     = localStorage.getItem('firmId');
      if (!loginToken || !firmId) {
        toast.error('Not authenticated or no firm selected');
        setLoading(false); return;
      }
      const formData = new FormData();
      formData.append('productName', productName);
      formData.append('price',       price);
      formData.append('description', description);
      formData.append('bestSeller',  bestSeller);
      if (image) formData.append('image', image);
      category.forEach(c => formData.append('category', c));
      cuisine.forEach(c  => formData.append('cuisine',  c));

      const response = await fetch(`${API_URL}/product/add-product/${firmId}`, {
        method:  'POST',
        headers: { token: loginToken },
        body:    formData,
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(`"${productName}" added to your menu! 🎉`);
        setProductName(""); setPrice(""); setCategory([]); setCuisine([]);
        setBestSeller(false); setImage(null); setPreview(null);
        setDescription(""); setErrors({});
      } else {
        toast.error(data.error || 'Failed to add product');
      }
    } catch {
      toast.error('Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  /* ── styles ── */
  const inpStyle = (hasErr) => ({
    width: '100%', height: 44, boxSizing: 'border-box',
    background: hasErr ? 'rgba(239,68,68,0.06)' : 'var(--surface2)',
    border: `1px solid ${hasErr ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
    padding: '0 14px', outline: 'none', transition: '0.2s',
  });

  const pillStyle = (selected, color = 'var(--accent)') => ({
    padding: '7px 14px', borderRadius: 99,
    fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
    background: selected ? `${color}22` : 'var(--surface2)',
    border: `1px solid ${selected ? color : 'var(--border)'}`,
    color: selected ? color : 'var(--text-secondary)',
  });

  const lbl = {
    display: 'block', fontSize: '0.75rem', fontWeight: 700,
    color: 'var(--text-secondary)', textTransform: 'uppercase',
    letterSpacing: '0.06em', marginBottom: 6, marginTop: 16,
  };

  const onFocus = e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; };
  const onBlur  = e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="firmSection" style={{ animation: 'fadeUp 0.4s ease both' }}>
      {loading ? (
        <div className="loaderSection">
          <ThreeCircles visible height={80} width={80} color="#ff6b35" />
          <p>Adding your product...</p>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 540 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>
              Add Product
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Add a new item to your menu</p>
          </div>

          <form onSubmit={handleAddProduct}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 28 }}>

            {/* Product Name */}
            <label style={lbl}>Product Name *</label>
            <input style={inpStyle(errors.productName)} type="text" value={productName}
              placeholder="e.g. Samosa, Ice Cream, Butter Chicken"
              onChange={e => { setProductName(e.target.value); setErrors(p => ({ ...p, productName: '' })); }}
              onFocus={onFocus} onBlur={onBlur} />
            {errors.productName && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{errors.productName}</span>}

            {/* Price */}
            <label style={lbl}>Price (₹) *</label>
            <input style={inpStyle(errors.price)} type="number" value={price}
              placeholder="e.g. 60"
              onChange={e => { setPrice(e.target.value); setErrors(p => ({ ...p, price: '' })); }}
              onFocus={onFocus} onBlur={onBlur} />
            {errors.price && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{errors.price}</span>}

            {/* ── CATEGORY ── */}
            <label style={lbl}>Category * <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(pick one or more)</span></label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORY_OPTIONS.map(({ v, l, color }) => (
                <button key={v} type="button"
                  style={pillStyle(category.includes(v), color)}
                  onClick={() => { toggleArr(category, setCategory, v); setErrors(p => ({ ...p, category: '' })); }}>
                  {l}
                </button>
              ))}
            </div>
            {errors.category && <span style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.category}</span>}

            {/* ── CUISINE TAG ── */}
            <label style={lbl}>Cuisine Tag <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional, pick any)</span></label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CUISINE_OPTIONS.map(({ v, l }) => (
                <button key={v} type="button"
                  style={pillStyle(cuisine.includes(v), 'var(--blue)')}
                  onClick={() => toggleArr(cuisine, setCuisine, v)}>
                  {l}
                </button>
              ))}
            </div>

            {/* ── BEST SELLER ── */}
            <label style={lbl}>Best Seller?</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ v: true, l: '⭐ Yes' }, { v: false, l: 'No' }].map(({ v, l }) => (
                <button key={String(v)} type="button"
                  style={pillStyle(bestSeller === v, '#f59e0b')}
                  onClick={() => setBestSeller(v)}>{l}</button>
              ))}
            </div>

            {/* Description */}
            <label style={lbl}>Description (optional)</label>
            <textarea value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of the dish..."
              style={{ ...inpStyle(false), height: 80, padding: '10px 14px', resize: 'vertical', lineHeight: 1.5 }}
              onFocus={onFocus} onBlur={onBlur} />

            {/* Image */}
            <label style={lbl}>Product Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleFileChange}
              style={{ ...inpStyle(false), height: 'auto', padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }} />
            {preview && (
              <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={preview} alt="preview"
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Image preview</span>
              </div>
            )}

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
