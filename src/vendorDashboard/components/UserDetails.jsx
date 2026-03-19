import React, { useEffect, useState } from "react";
import { API_URL } from "../data/apiPath";

const UserDetails = () => {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    const vendorId = localStorage.getItem("vendorId");

    if (!token || !vendorId) {
      setError("No user information found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchVendor = async () => {
      try {
        const response = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
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
      <div className="user-card" style={{ borderColor: 'var(--red)', borderOpacity: 0.4 }}>
        <p style={{ color: 'var(--red)' }}>⚠️ {error}</p>
      </div>
    </div>
  );

  const initial = vendor?.username?.[0]?.toUpperCase() || '?';

  return (
    <div className="userDetailsSection">
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          User Details
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your account information and linked restaurant</p>
      </div>

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
          <div className="user-info-item">
            <span className="user-info-label">Firm</span>
            <span className="user-info-value" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              {vendor.primaryFirm?.firmName || "No firm assigned"}
            </span>
          </div>
        </div>
      </div>

      {vendor.primaryFirm?.products?.length > 0 ? (
        <div className="products-list-card">
          <h4>Linked Products ({vendor.primaryFirm.products.length})</h4>
          <ul>
            {vendor.primaryFirm.products.map((prod) => (
              <li key={prod._id}>
                <span>{prod.productName}</span>
                <span className="price-badge">₹{prod.price}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="user-card" style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🍽️</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>No products added yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
