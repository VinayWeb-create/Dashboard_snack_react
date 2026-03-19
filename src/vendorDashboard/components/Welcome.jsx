import React from 'react'

const Welcome = ({ onAddProduct, onViewProducts }) => {
  const firmName = localStorage.getItem("firmName")
  const vendorId = localStorage.getItem("vendorId")

  return (
    <div className='welcomeSection'>
      <div className="welcome-hero">
        <div className="welcome-hero-label">🟢 Dashboard Active</div>
        <h1>
          {firmName ? <>Welcome back, <span>{firmName}</span></> : <>Welcome to <span>VendorHub</span></>}
        </h1>
        <p>
          Manage your restaurant, update your menu, track your products — all from one place.
        </p>

        <div className="welcome-actions">
          <button className="btnSubmit" style={{ margin: 0 }}>
            <button onClick={onAddProduct} style={{ margin: 0 }}>+ Add Product</button>
          </button>
          <button
            onClick={onViewProducts}
            style={{
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
              padding: '11px 24px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              transition: 'var(--transition)'
            }}
            onMouseEnter={e => { e.target.style.borderColor = 'var(--border-hover)'; e.target.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-secondary)'; }}
          >
            View All Products →
          </button>
        </div>
      </div>

      <div className="welcome-stats">
        <div className="stat-card">
          <div className="stat-card-icon">🏪</div>
          <div className="stat-card-value">{firmName ? '1' : '0'}</div>
          <div className="stat-card-label">Active Firm</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">📦</div>
          <div className="stat-card-value">—</div>
          <div className="stat-card-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon">⭐</div>
          <div className="stat-card-value">—</div>
          <div className="stat-card-label">Best Sellers</div>
        </div>
      </div>
    </div>
  )
}

export default Welcome
