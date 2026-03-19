import React, { useState } from "react";
import { API_URL } from "../../data/apiPath";
import { ThreeCircles } from "react-loader-spinner";
import { useToast } from "../Toast";

const Login = ({ showWelcomeHandler }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/vendor/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("loginToken", data.token);
      localStorage.setItem("vendorId", data.vendorId);
      const firm = data.vendor?.primaryFirm || null;
      if (firm && firm._id) {
        localStorage.setItem("firmId", firm._id);
        localStorage.setItem("firmName", firm.firmName || "");
      } else {
        localStorage.removeItem("firmId");
        localStorage.removeItem("firmName");
      }
      toast.success("Welcome back! Login successful 🎉");
      if (showWelcomeHandler) showWelcomeHandler();
    } catch (error) {
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (hasErr) => ({
    width: '100%', height: 44,
    background: hasErr ? 'rgba(239,68,68,0.06)' : 'var(--surface2)',
    border: `1px solid ${hasErr ? 'var(--red)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: '0.9rem', fontFamily: 'DM Sans, sans-serif',
    padding: '0 14px', outline: 'none', transition: '0.2s',
    boxSizing: 'border-box',
  });

  return (
    <div className="loginSection" style={{ animation: 'fadeUp 0.4s ease both' }}>
      {loading ? (
        <div className="loaderSection">
          <ThreeCircles visible height={80} width={80} color="#ff6b35" />
          <p>Logging in...</p>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 6 }}>
              Welcome back 👋
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Sign in to your vendor account</p>
          </div>
          <form onSubmit={loginHandler} autoComplete="off"
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '28px',
              display: 'flex', flexDirection: 'column', gap: 0,
            }}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Email</label>
              <input style={inp(errors.email)} type="email" value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })); }}
                placeholder="you@restaurant.com"
                onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; }}
                onBlur={e => { e.target.style.borderColor = errors.email ? 'var(--red)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
              />
              {errors.email && <span style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.email}</span>}
            </div>
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input style={{ ...inp(errors.password), paddingRight: 50 }}
                  type={showPw ? "text" : "password"} value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: '' })); }}
                  placeholder="••••••••"
                  onFocus={e => { e.target.style.borderColor = 'var(--accent)'; e.target.style.boxShadow = '0 0 0 3px var(--accent-subtle)'; }}
                  onBlur={e => { e.target.style.borderColor = errors.password ? 'var(--red)' : 'var(--border)'; e.target.style.boxShadow = 'none'; }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)',
                  cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
                }}>{showPw ? 'Hide' : 'Show'}</button>
              </div>
              {errors.password && <span style={{ color: 'var(--red)', fontSize: '0.75rem', marginTop: 4, display: 'block' }}>{errors.password}</span>}
            </div>
            <button type="submit" style={{
              marginTop: 22, width: '100%', padding: '12px',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              border: 'none', borderRadius: 'var(--radius-sm)',
              color: 'white', fontSize: '0.9rem', fontWeight: 700,
              cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
              boxShadow: 'var(--shadow-accent)', transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
            >Sign In →</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
