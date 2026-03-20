import React, { useEffect, useState } from "react";
import { API_URL } from "../data/apiPath";
import { getProductImageUrl, getFirmImageUrl } from "../data/imageUrl";
import { useToast } from "./Toast";

/* ─────────────────────────────────────────
   EDIT FIRM MODAL
───────────────────────────────────────── */
const EditFirmModal = ({ firm, onClose, onSaved }) => {
  const toast = useToast();
  const [firmName,  setFirmName]  = useState(firm.firmName  || "");
  const [area,      setArea]      = useState(firm.area      || "");
  const [offer,     setOffer]     = useState(firm.offer     || "");
  const [category,  setCategory]  = useState(firm.category  || []);
  const [region,    setRegion]    = useState(firm.region    || []);
  const [imageFile, setImageFile] = useState(null);
  const [preview,   setPreview]   = useState(null);
  const [saving,    setSaving]    = useState(false);
  const [errors,    setErrors]    = useState({});

  const toggleArr = (arr, setArr, val) =>
    setArr(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setImageFile(f);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  };

  const validate = () => {
    const e = {};
    if (!firmName.trim()) e.firmName = "Firm name is required";
    if (!area.trim())     e.area     = "Area is required";
    if (!category.length) e.category = "Select at least one category";
    if (!region.length)   e.region   = "Select at least one region";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      const token    = localStorage.getItem("loginToken");
      const formData = new FormData();
      formData.append("firmName", firmName);
      formData.append("area",     area);
      formData.append("offer",    offer);
      category.forEach(c => formData.append("category", c));
      region.forEach(r   => formData.append("region",   r));
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(`${API_URL}/firm/update-firm/${firm._id}`, {
        method: "PUT",
        headers: { token },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        // Keep localStorage in sync
        localStorage.setItem("firmName", data.vendorFirmName || firmName);
        toast.success("Firm updated successfully! 🏪");
        onSaved(data.firm);
        onClose();
      } else {
        toast.error(data.message || "Failed to update firm");
      }
    } catch (err) {
      toast.error("Failed to update firm: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  /* ── styles ── */
  const overlay = {
    position: "fixed", inset: 0, zIndex: 9999,
    background: "rgba(0,0,0,0.78)", backdropFilter: "blur(10px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 20, animation: "fadeIn 0.15s ease both",
  };
  const modal = {
    background: "#111114", border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 22, padding: "28px", width: "100%", maxWidth: 500,
    maxHeight: "90vh", overflowY: "auto",
    boxShadow: "0 32px 80px rgba(0,0,0,0.85)",
    animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
  };
  const inp = (err) => ({
    width: "100%", height: 44, boxSizing: "border-box",
    background: err ? "rgba(239,68,68,0.06)" : "#1f1f26",
    border: `1px solid ${err ? "#ef4444" : "rgba(255,255,255,0.07)"}`,
    borderRadius: 9, color: "#f0f0f2",
    fontSize: "0.9rem", fontFamily: "DM Sans, sans-serif",
    padding: "0 14px", outline: "none", transition: "0.2s",
  });
  const lbl = {
    display: "block", fontSize: "0.74rem", fontWeight: 700,
    color: "#8b8b9a", textTransform: "uppercase",
    letterSpacing: "0.06em", marginBottom: 6, marginTop: 16,
  };
  const pill = (active, color = "#ff6b35") => ({
    padding: "6px 14px", borderRadius: 99, fontSize: "0.82rem", fontWeight: 600,
    cursor: "pointer", fontFamily: "DM Sans, sans-serif", transition: "0.2s",
    background: active ? `${color}22` : "#1f1f26",
    border: `1px solid ${active ? color : "rgba(255,255,255,0.07)"}`,
    color: active ? color : "#8b8b9a",
  });

  const currentImg = getFirmImageUrl(firm.image);

  return (
    <div style={overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={modal}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h3 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "#f0f0f2", margin: 0, letterSpacing: "-0.02em" }}>
            Edit Firm Details
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#8b8b9a", fontSize: "1.2rem", cursor: "pointer", padding: 4 }}>✕</button>
        </div>
        <p style={{ color: "#8b8b9a", fontSize: "0.82rem", marginBottom: 6 }}>Update your restaurant information</p>

        {/* Firm Name */}
        <label style={lbl}>Firm Name *</label>
        <input style={inp(errors.firmName)} value={firmName}
          onChange={e => { setFirmName(e.target.value); setErrors(p => ({ ...p, firmName: "" })); }}
          onFocus={e => { e.target.style.borderColor = "#ff6b35"; e.target.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.15)"; }}
          onBlur={e  => { e.target.style.borderColor = errors.firmName ? "#ef4444" : "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "none"; }}
        />
        {errors.firmName && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.firmName}</span>}

        {/* Area */}
        <label style={lbl}>Area *</label>
        <input style={inp(errors.area)} value={area}
          onChange={e => { setArea(e.target.value); setErrors(p => ({ ...p, area: "" })); }}
          onFocus={e => { e.target.style.borderColor = "#ff6b35"; e.target.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.15)"; }}
          onBlur={e  => { e.target.style.borderColor = errors.area ? "#ef4444" : "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "none"; }}
        />
        {errors.area && <span style={{ color: "#ef4444", fontSize: "0.75rem" }}>{errors.area}</span>}

        {/* Offer */}
        <label style={lbl}>Offer (optional)</label>
        <input style={inp(false)} value={offer}
          placeholder="e.g. 20% off on orders above ₹500"
          onChange={e => setOffer(e.target.value)}
          onFocus={e => { e.target.style.borderColor = "#ff6b35"; e.target.style.boxShadow = "0 0 0 3px rgba(255,107,53,0.15)"; }}
          onBlur={e  => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; e.target.style.boxShadow = "none"; }}
        />

        {/* Category */}
        <label style={lbl}>Category *</label>
        <div style={{ display: "flex", gap: 8 }}>
          {[["veg", "🥦 Veg"], ["non-veg", "🍗 Non-Veg"]].map(([v, l]) => (
            <button key={v} type="button"
              onClick={() => { toggleArr(category, setCategory, v); setErrors(p => ({ ...p, category: "" })); }}
              style={pill(category.includes(v), v === "veg" ? "#22c55e" : "#ef4444")}>{l}</button>
          ))}
        </div>
        {errors.category && <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 4, display: "block" }}>{errors.category}</span>}

        {/* Region */}
        <label style={lbl}>Region *</label>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["south-indian","🍛 South Indian"],["north-indian","🫓 North Indian"],["chinese","🥢 Chinese"],["bakery","🥐 Bakery"]].map(([v, l]) => (
            <button key={v} type="button"
              onClick={() => { toggleArr(region, setRegion, v); setErrors(p => ({ ...p, region: "" })); }}
              style={pill(region.includes(v), "#3b82f6")}>{l}</button>
          ))}
        </div>
        {errors.region && <span style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: 4, display: "block" }}>{errors.region}</span>}

        {/* Image */}
        <label style={lbl}>Firm Image</label>

        {/* Current image preview */}
        {(preview || currentImg) && (
          <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src={preview || currentImg}
              alt="firm"
              onError={e => { e.target.style.display = "none"; }}
              style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <span style={{ fontSize: "0.78rem", color: "#8b8b9a" }}>
              {preview ? "New image selected" : "Current image"}
            </span>
          </div>
        )}

        <input type="file" accept="image/*" onChange={handleFileChange}
          style={{ ...inp(false), height: "auto", padding: "10px 14px", color: "#8b8b9a", fontSize: "0.82rem", cursor: "pointer" }} />

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: "11px", borderRadius: 9,
            background: "transparent", border: "1px solid rgba(255,255,255,0.1)",
            color: "#8b8b9a", fontSize: "0.87rem", fontWeight: 600,
            cursor: "pointer", fontFamily: "DM Sans, sans-serif",
          }}>Cancel</button>
          <button onClick={handleSave} disabled={saving} style={{
            flex: 2, padding: "11px", borderRadius: 9,
            background: "linear-gradient(135deg, #ff6b35, #ff9f1c)",
            border: "none", color: "white",
            fontSize: "0.88rem", fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "DM Sans, sans-serif",
            opacity: saving ? 0.7 : 1,
            boxShadow: "0 4px 16px rgba(255,107,53,0.3)",
          }}>{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes popIn {
          from { opacity:0; transform:scale(0.85) translateY(20px); }
          to   { opacity:1; transform:scale(1)    translateY(0);    }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────
   USER DETAILS PAGE
───────────────────────────────────────── */
const UserDetails = () => {
  const [vendor,      setVendor]      = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [editingFirm, setEditingFirm] = useState(false);
  const toast = useToast();

  const fetchVendor = async () => {
    const token    = localStorage.getItem("loginToken");
    const vendorId = localStorage.getItem("vendorId");
    if (!token || !vendorId) {
      setError("No user information found. Please log in again.");
      setLoading(false);
      return;
    }
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

  useEffect(() => { fetchVendor(); }, []);

  const handleFirmSaved = (updatedFirm) => {
    setVendor(prev => ({
      ...prev,
      primaryFirm: { ...prev.primaryFirm, ...updatedFirm },
    }));
  };

  /* ── Loading ── */
  if (loading) return (
    <div className="loaderSection">
      <div style={{ fontSize: "2rem", animation: "spin 1s linear infinite" }}>⟳</div>
      <p>Loading your details...</p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="userDetailsSection">
      <div className="user-card">
        <p style={{ color: "var(--red)" }}>⚠️ {error}</p>
      </div>
    </div>
  );

  const initial  = vendor?.username?.[0]?.toUpperCase() || "?";
  const firm     = vendor?.primaryFirm || null;
  const firmImg  = firm?.image ? getFirmImageUrl(firm.image) : null;

  return (
    <div className="userDetailsSection">

      {/* Edit modal */}
      {editingFirm && firm && (
        <EditFirmModal
          firm={firm}
          onClose={() => setEditingFirm(false)}
          onSaved={handleFirmSaved}
        />
      )}

      {/* Page title */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontFamily: "Syne, sans-serif", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 4 }}>
          User Details
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
          Your account information and linked restaurant
        </p>
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

      {/* ── Firm Card ── */}
      {firm ? (
        <div className="user-card" style={{ marginTop: 16 }}>

          {/* Firm header: image + name + edit button */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>

              {/* Firm image */}
              {firmImg ? (
                <img
                  src={firmImg}
                  alt={firm.firmName}
                  onError={e => { e.target.style.display = "none"; }}
                  style={{
                    width: 80, height: 80, objectFit: "cover",
                    borderRadius: 16, border: "1px solid var(--border)",
                    flexShrink: 0, boxShadow: "var(--shadow)",
                  }}
                />
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: 16, flexShrink: 0,
                  background: "linear-gradient(135deg, var(--accent), var(--accent2))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2.2rem", boxShadow: "var(--shadow-accent)",
                }}>🏪</div>
              )}

              <div>
                <div style={{ fontFamily: "Syne, sans-serif", fontSize: "1.15rem", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {firm.firmName}
                </div>
                <div style={{ fontSize: "0.83rem", color: "var(--text-secondary)", marginTop: 3 }}>
                  📍 {firm.area}
                </div>
                {firm.offer && (
                  <div style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 600, marginTop: 4 }}>
                    🎁 {firm.offer}
                  </div>
                )}
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setEditingFirm(true)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 9,
                background: "var(--accent-subtle)",
                border: "1px solid rgba(255,107,53,0.3)",
                color: "var(--accent)", fontSize: "0.82rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "DM Sans, sans-serif",
                transition: "var(--transition)", flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,107,53,0.2)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--accent-subtle)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              ✏️ Edit Firm
            </button>
          </div>

          {/* Firm details grid */}
          <div className="user-info-row">

            {/* Category */}
            <div className="user-info-item">
              <span className="user-info-label">Category</span>
              <span className="user-info-value">
                {firm.category?.length
                  ? firm.category.map(c => (
                      <span key={c} style={{
                        fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px",
                        borderRadius: 99, marginRight: 5, display: "inline-block",
                        background: c === "veg" ? "var(--green-subtle)" : "var(--red-subtle)",
                        color: c === "veg" ? "var(--green)" : "var(--red)",
                      }}>{c === "veg" ? "🥦 Veg" : "🍗 Non-Veg"}</span>
                    ))
                  : <span style={{ color: "var(--text-muted)" }}>—</span>}
              </span>
            </div>

            {/* Region */}
            <div className="user-info-item">
              <span className="user-info-label">Region</span>
              <span className="user-info-value" style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {firm.region?.length
                  ? firm.region.map(r => (
                      <span key={r} style={{
                        fontSize: "0.75rem", fontWeight: 700, padding: "3px 10px",
                        borderRadius: 99, display: "inline-block",
                        background: "var(--blue-subtle)", color: "var(--blue)",
                      }}>{r}</span>
                    ))
                  : <span style={{ color: "var(--text-muted)" }}>—</span>}
              </span>
            </div>

            {/* Product count */}
            <div className="user-info-item">
              <span className="user-info-label">Total Products</span>
              <span className="user-info-value" style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1.05rem" }}>
                {firm.products?.length || 0}
                <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 400, marginLeft: 4 }}>items on menu</span>
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="user-card" style={{ marginTop: 16, textAlign: "center", padding: "32px" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>🏪</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>No firm assigned yet.</p>
        </div>
      )}

      {/* ── Products List ── */}
      {firm?.products?.length > 0 && (
        <div className="products-list-card" style={{ marginTop: 16 }}>
          <h4>Menu Items ({firm.products.length})</h4>
          <ul>
            {firm.products.map((prod) => {
              const imgUrl = getProductImageUrl(prod.image);
              return (
                <li key={prod._id}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={prod.productName}
                        onError={e => { e.target.style.display = "none"; }}
                        style={{ width: 38, height: 38, objectFit: "cover", borderRadius: 9, border: "1px solid var(--border)", flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{ width: 38, height: 38, background: "var(--surface3)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", flexShrink: 0 }}>🍴</div>
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.87rem", color: "var(--text-primary)" }}>{prod.productName}</div>
                      {prod.category?.length > 0 && (
                        <div style={{ fontSize: "0.72rem", fontWeight: 600, marginTop: 1, color: prod.category.includes("non-veg") ? "var(--red)" : "var(--green)" }}>
                          {prod.category.join(" · ")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {prod.bestSeller && (
                      <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 7px", borderRadius: 99, background: "rgba(245,158,11,0.12)", color: "#f59e0b" }}>⭐</span>
                    )}
                    <span className="price-badge">₹{prod.price}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {firm && !firm.products?.length && (
        <div className="user-card" style={{ marginTop: 16, textAlign: "center", padding: "28px" }}>
          <div style={{ fontSize: "2rem", marginBottom: 8 }}>🍽️</div>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem" }}>No products added yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
