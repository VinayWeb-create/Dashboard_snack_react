import React, { useState } from 'react'
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';
import { useToast } from '../Toast';
import { getProductImageUrl } from '../../data/imageUrl';

const AddFirm = ({ onFirmAdded }) => {
  const [firmName, setFirmName] = useState("");
  const [area, setArea] = useState("");
  const [category, setCategory] = useState([]);
  const [region, setRegion] = useState([]);
  const [offer, setOffer] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const handleCategoryChange = (value) => {
    setCategory(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  };
  const handleRegionChange = (value) => {
    setRegion(prev => prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    // Show local preview immediately
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const validate = () => {
    const e = {};
    if (!firmName.trim()) e.firmName = 'Firm name is required';
    if (!area.trim()) e.area = 'Area is required';
    if (category.length === 0) e.category = 'Select at least one category';
    if (region.length === 0) e.region = 'Select at least one region';
    return e;
  };

  const handleFirmSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const loginToken = localStorage.getItem('loginToken');
      if (!loginToken) { toast.error('Not authenticated. Please login.'); setLoading(false); return; }

      const formData = new FormData();
      formData.append('firmName', firmName);
      formData.append('area', area);
      formData.append('offer', offer);
      if (file) formData.append('image', file);
      category.forEach(v => formData.append('category', v));
      region.forEach(v => formData.append('region', v));

      const response = await fetch(`${API_URL}/firm/add-firm`, {
        method: 'POST',
        headers: { 'token': loginToken },
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('firmId', data.firmId);
        localStorage.setItem('firmName', data.vendorFirmName);
        toast.success('Firm added successfully! 🏪');
        setFirmName(""); setArea(""); setCategory([]); setRegion([]);
        setOffer(""); setFile(null); setPreview(null);
        // Notify parent so sidebar updates without full reload
        if (onFirmAdded) onFirmAdded(data);
        else setTimeout(() => window.location.reload(), 1200);
      } else if (data.message === 'Vendor can have only one firm') {
        toast.warning('You already have a firm. Only 1 firm per vendor allowed.');
      } else {
        toast.error(data.message || 'Failed to add firm');
      }
    } catch (err) {
      toast.error('Failed to add firm: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const catOptions    = [{ v: 'veg', l: '🥦 Veg' }, { v: 'non-veg', l: '🍗 Non-Veg' }];
  const regionOptions = [
    { v: 'south-indian', l: '🍛 South Indian' },
    { v: 'north-indian', l: '🫓 North Indian' },
    { v: 'chinese',      l: '🥢 Chinese' },
    { v: 'bakery',       l: '🥐 Bakery' },
  ];

  const pillStyle = (selected, color = 'var(--accent)') => ({
    padding: '7px 14px', borderRadius: 99, fontSize: '0.82rem', fontWeight: 600,
    cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', transition: '0.2s',
    background: selected ? `${color}1a` : 'var(--surface2)',
    border: `1px solid ${selected ? color : 'var(--border)'}`,
    color: selected ? color : 'var(--text-secondary)',
  });

  const inpStyle = (hasErr) => ({
    width: '100%', height: 44,
    background: hasErr ? 'rgba(239,68,68,0.06)' : 'var(--surface2)',
    border: `1px solid ${hasErr ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
    padding: '0 14px', outline: 'none', transition: '0.2s', boxSizing: 'border-box',
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
          <p>Adding your firm...</p>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 520 }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 4 }}>
              Add Your Firm
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Set up your restaurant profile</p>
          </div>

          <form onSubmit={handleFirmSubmit}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '28px' }}>

            <label style={lbl}>Firm Name *</label>
            <input style={inpStyle(errors.firmName)} type="text" value={firmName}
              placeholder="e.g. Spice Garden"
              onChange={e => { setFirmName(e.target.value); setErrors(p => ({ ...p, firmName: '' })); }}
              onFocus={onFocus} onBlur={onBlur} />
            {errors.firmName && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{errors.firmName}</span>}

            <label style={lbl}>Area *</label>
            <input style={inpStyle(errors.area)} type="text" value={area}
              placeholder="e.g. Koramangala, Bangalore"
              onChange={e => { setArea(e.target.value); setErrors(p => ({ ...p, area: '' })); }}
              onFocus={onFocus} onBlur={onBlur} />
            {errors.area && <span style={{ color: 'var(--red)', fontSize: '0.75rem' }}>{errors.area}</span>}

            <label style={lbl}>Category *</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {catOptions.map(({ v, l }) => (
                <button key={v} type="button"
                  style={pillStyle(category.includes(v))}
                  onClick={() => { handleCategoryChange(v); setErrors(p => ({ ...p, category: '' })); }}>
                  {l}
                </button>
              ))}
            </div>
            {errors.category && <span style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.category}</span>}

            <label style={lbl}>Region *</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {regionOptions.map(({ v, l }) => (
                <button key={v} type="button"
                  style={pillStyle(region.includes(v), 'var(--blue)')}
                  onClick={() => { handleRegionChange(v); setErrors(p => ({ ...p, region: '' })); }}>
                  {l}
                </button>
              ))}
            </div>
            {errors.region && <span style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.region}</span>}

            <label style={lbl}>Offer (optional)</label>
            <input style={inpStyle(false)} type="text" value={offer}
              placeholder="e.g. 20% off on orders above ₹500"
              onChange={e => setOffer(e.target.value)}
              onFocus={onFocus} onBlur={onBlur} />

            <label style={lbl}>Firm Image (optional)</label>
            <input type="file" accept="image/*"
              onChange={handleFileChange}
              style={{ ...inpStyle(false), height: 'auto', padding: '10px 14px', color: 'var(--text-secondary)', fontSize: '0.82rem', cursor: 'pointer' }} />

            {/* Image preview */}
            {preview && (
              <div style={{ marginTop: 10 }}>
                <img src={preview} alt="preview"
                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--border)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 10 }}>Preview</span>
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
            >Add Firm →</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddFirm;
