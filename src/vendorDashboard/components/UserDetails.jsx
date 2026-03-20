import React, { useEffect, useState } from "react";
import { API_URL } from "../data/apiPath";
import { getProductImageUrl } from "../data/imageUrl";

const UserDetails = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token    = localStorage.getItem("loginToken");
    const vendorId = localStorage.getItem("vendorId");

    if (!token || !vendorId) {
      setError("No user information found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchVendor = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user details");
        const data = await response.json();
        setVendor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, []);

  if (loading) return (
    <div className="loaderSection">
      <div style={{ fontSize: '2rem', animation: 'spin 1s linear infinite' }}>⟳</div>
      <p>Loading your details...</p>
    </div>
  );

  if (error) return (
    <div className="userDetailsSection">
      <div className="user-card" style={{ borderColor: 'var(--red)' }}>
        <p style={{ color: 'var(--red)' }}>⚠️ {error}</p>
      </div>
    </div>
  );

  const initial  = vendor?.username?.[0]?.toUpperCase() || '?';
  const firm     = vendor?.primaryFirm || null;
  const firmImg  = firm?.image ? getProductImageUrl(firm.image) : null;

  return (
    <div className="userDetailsSection">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          User Details
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your account information and linked restaurant</p>
      </div>

      {/* ── Account Card ── */}
      <div className="user-card">
        <div className="user-avatar">{initial}</div>
        <div className="user-info-row">
          <div className="user-info-item">
            <span className="user-info-label">Username</span>
            <span className="user-info-value">{vendor.username}</span>
          </div>
          <div className="user-info-item">
            <span className="user-info-label">Email</span>
            <span className="user-info-value">{vendor.email}</span>
          </div>
        </div>
      </div>

      {/* ── Firm Details Card ── */}
      {firm ? (
        <div className="user-card" style={{ marginTop: 16 }}>
          {/* Firm header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            {/* Firm image */}
            {firmImg ? (
              <img
                src={firmImg}
                alt={firm.firmName}
                onError={e => { e.target.style.display = 'none'; }}
                style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 14, border: '1px solid var(--border)', flexShrink: 0 }}
              />
            ) : (
              <div style={{
                width: 72, height: 72, borderRadius: 14,
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2rem', flexShrink: 0,
              }}>🏪</div>
            )}
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {firm.firmName}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                📍 {firm.area}
              </div>
            </div>
          </div>

          {/* Firm info rows */}
          <div className="user-info-row">
            <div className="user-info-item">
              <span className="user-info-label">Category</span>
              <span className="user-info-value">
                {firm.category?.length
                  ? firm.category.map(c => (
                      <span key={c} style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px',
                        borderRadius: 99, marginRight: 4,
                        background: c === 'veg' ? 'var(--green-subtle)' : 'var(--red-subtle)',
                        color: c === 'veg' ? 'var(--green)' : 'var(--red)',
                      }}>{c}</span>
                    ))
                  : '—'}
              </span>
            </div>

            <div className="user-info-item">
              <span className="user-info-label">Region</span>
              <span className="user-info-value">
                {firm.region?.length
                  ? firm.region.map(r => (
                      <span key={r} style={{
                        fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px',
                        borderRadius: 99, marginRight: 4,
                        background: 'var(--blue-subtle)', color: 'var(--blue)',
                      }}>{r}</span>
                    ))
                  : '—'}
              </span>
            </div>

            {firm.offer && (
              <div className="user-info-item">
                <span className="user-info-label">Offer</span>
                <span className="user-info-value" style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  🎁 {firm.offer}
                </span>
              </div>
            )}

            <div className="user-info-item">
              <span className="user-info-label">Products</span>
              <span className="user-info-value" style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                {firm.products?.length || 0} items
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="user-card" style={{ marginTop: 16, textAlign: 'center', padding: '28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏪</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No firm assigned yet.</p>
        </div>
      )}

      {/* ── Products List Card ── */}
      {firm?.products?.length > 0 ? (
        <div className="products-list-card" style={{ marginTop: 16 }}>
          <h4>Menu Items ({firm.products.length})</h4>
          <ul>
            {firm.products.map((prod) => {
              const imgUrl = getProductImageUrl(prod.image);
              return (
                <li key={prod._id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={prod.productName}
                        onError={e => { e.target.style.display = 'none'; }}
                        style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: 36, height: 36, background: 'var(--surface3)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', flexShrink: 0 }}>🍴</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.87rem' }}>{prod.productName}</div>
                      {prod.category?.length > 0 && (
                        <div style={{ fontSize: '0.72rem', color: prod.category.includes('veg') ? 'var(--green)' : 'var(--red)', fontWeight: 600 }}>
                          {prod.category.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="price-badge">₹{prod.price}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div className="user-card" style={{ marginTop: 16, textAlign: 'center', padding: '28px' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🍽️</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No products added yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
