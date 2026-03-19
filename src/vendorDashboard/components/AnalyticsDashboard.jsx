import React, { useState, useEffect } from 'react';
import { API_URL } from '../data/apiPath';

const AnalyticsDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const firmId = localStorage.getItem('firmId');
    if (!firmId) { setLoading(false); return; }
    fetch(`${API_URL}/product/${firmId}/products`)
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 80 }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading analytics...</div>
    </div>
  );

  const total = products.length;
  const veg = products.filter(p => p.category?.includes('veg') && !p.category?.includes('non-veg')).length;
  const nonVeg = products.filter(p => p.category?.includes('non-veg')).length;
  const bestSellers = products.filter(p => p.bestSeller).length;
  const withImage = products.filter(p => p.image).length;
  const noImage = total - withImage;

  const vegPct = total ? Math.round((veg / total) * 100) : 0;
  const nonVegPct = total ? Math.round((nonVeg / total) * 100) : 0;
  const bsPct = total ? Math.round((bestSellers / total) * 100) : 0;

  const pricesSorted = [...products].sort((a, b) => b.price - a.price);
  const topProducts = pricesSorted.slice(0, 5);
  const maxPrice = topProducts[0]?.price || 1;

  return (
    <div className="analyticsSection" style={{ animation: 'fadeUp 0.4s ease both' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
          Analytics
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: 4 }}>
          Overview of your menu & product performance
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { icon: '📦', label: 'Total Products', value: total, color: 'var(--accent)', bg: 'var(--accent-subtle)' },
          { icon: '🥦', label: 'Veg Items', value: veg, color: 'var(--green)', bg: 'var(--green-subtle)' },
          { icon: '🍗', label: 'Non-Veg Items', value: nonVeg, color: 'var(--red)', bg: 'var(--red-subtle)' },
          { icon: '⭐', label: 'Best Sellers', value: bestSellers, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px',
            transition: 'var(--transition)',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: s.bg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '1.1rem', marginBottom: 12,
            }}>{s.icon}</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: s.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4, fontWeight: 500 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>

        {/* Category Breakdown */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px',
        }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '-0.01em' }}>
            Category Breakdown
          </h3>
          {total === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No products yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Veg', count: veg, pct: vegPct, color: 'var(--green)', track: 'var(--green-subtle)' },
                { label: 'Non-Veg', count: nonVeg, pct: nonVegPct, color: 'var(--red)', track: 'var(--red-subtle)' },
                { label: 'Best Sellers', count: bestSellers, pct: bsPct, color: '#f59e0b', track: 'rgba(245,158,11,0.1)' },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                    <span style={{ fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.83rem', fontWeight: 700, color: item.color }}>{item.count} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({item.pct}%)</span></span>
                  </div>
                  <div style={{ height: 8, background: item.track, borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${item.pct}%`,
                      background: item.color, borderRadius: 99,
                      transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                    }} />
                  </div>
                </div>
              ))}

              {/* Donut-style visual */}
              <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                {Array.from({ length: total }).map((_, i) => {
                  const p = products[i];
                  const isVeg = p?.category?.includes('veg') && !p?.category?.includes('non-veg');
                  const isNonVeg = p?.category?.includes('non-veg');
                  const isBS = p?.bestSeller;
                  const color = isNonVeg ? 'var(--red)' : isVeg ? 'var(--green)' : 'var(--text-muted)';
                  return (
                    <div key={i} style={{
                      width: 10, height: 10, borderRadius: 3,
                      background: color, opacity: isBS ? 1 : 0.6,
                      transition: '0.2s',
                    }} title={p?.productName} />
                  );
                })}
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[['var(--green)', 'Veg'], ['var(--red)', 'Non-Veg'], ['var(--text-muted)', 'Uncategorised']].map(([c, l]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Products by Price */}
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', padding: '24px',
        }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, letterSpacing: '-0.01em' }}>
            Top Items by Price
          </h3>
          {topProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>No products yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topProducts.map((p, i) => {
                const barW = Math.round((p.price / maxPrice) * 100);
                return (
                  <div key={p._id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: 6,
                          background: i === 0 ? 'rgba(255,159,28,0.15)' : 'var(--surface3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '0.65rem', fontWeight: 800,
                          color: i === 0 ? '#f59e0b' : 'var(--text-muted)',
                          flexShrink: 0,
                        }}>{i + 1}</span>
                        <span style={{
                          fontSize: '0.83rem', fontWeight: 600, color: 'var(--text-primary)',
                          maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{p.productName}</span>
                      </div>
                      <span style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--green)' }}>₹{p.price}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${barW}%`,
                        background: i === 0
                          ? 'linear-gradient(90deg, var(--accent), var(--accent2))'
                          : 'var(--surface2)',
                        borderRadius: 99,
                        border: '1px solid var(--border)',
                        transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Image Coverage */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{ fontSize: '1.4rem' }}>🖼️</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Image Coverage</span>
            <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)' }}>
              {withImage}/{total} products have images
            </span>
          </div>
          <div style={{ height: 8, background: 'var(--surface3)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: total ? `${Math.round((withImage / total) * 100)}%` : '0%',
              background: 'linear-gradient(90deg, var(--blue), #818cf8)',
              borderRadius: 99, transition: 'width 1s ease',
            }} />
          </div>
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: 'var(--blue)', minWidth: 42, textAlign: 'right' }}>
          {total ? Math.round((withImage / total) * 100) : 0}%
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
